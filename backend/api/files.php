<?php
/**
 * Files API Endpoint
 * Handles CRUD operations for files
 * TODO: Add authentication/session validation
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../database/db.php';

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Helper function to send JSON response
function sendResponse($success, $data = null, $message = '', $statusCode = 200) {
    // Ensure no output before this
    if (ob_get_level()) {
        ob_clean();
    }
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ]);
    exit;
}

// Get database connection
try {
    $conn = getDBConnection();
} catch (Exception $e) {
    sendResponse(false, null, 'Database connection error: ' . $e->getMessage(), 500);
}

// Helper function to generate next cabinet number
function getNextCabinetNumber($conn, $cabinetId) {
    // Get cabinet prefix (C1, C2, C3, etc.)
    $stmt = $conn->prepare("SELECT id FROM cabinets WHERE id = ?");
    $stmt->bind_param("i", $cabinetId);
    $stmt->execute();
    $result = $stmt->get_result();
    $cabinet = $result->fetch_assoc();
    
    if (!$cabinet) {
        return null;
    }
    
    $prefix = 'C' . $cabinetId;
    
    // Get max cabinet number for this cabinet
    // Extract the number after the prefix (e.g., C1.3 -> 3)
    $stmt = $conn->prepare("
        SELECT MAX(CAST(SUBSTRING(cabinet_number, LENGTH(?) + 2) AS UNSIGNED)) as max_num
        FROM files
        WHERE cabinet_id = ? AND deleted_at IS NULL AND cabinet_number LIKE CONCAT(?, '.%')
    ");
    $stmt->bind_param("sis", $prefix, $cabinetId, $prefix);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    $nextNum = ($row['max_num'] ?? 0) + 1;
    return $prefix . '.' . $nextNum;
}

// TODO: Get current user ID from session
$currentUser = 'Admin'; // TODO: Get from session

try {
    switch ($method) {
        case 'GET':
            // Get files by cabinet_id or single file
            $cabinetId = isset($_GET['cabinet_id']) ? intval($_GET['cabinet_id']) : null;
            $fileId = isset($_GET['id']) ? intval($_GET['id']) : null;
            $search = isset($_GET['search']) ? trim($_GET['search']) : null;
            
            if ($fileId) {
                // Get single file
                $stmt = $conn->prepare("
                    SELECT f.*, c.name as cabinet_name
                    FROM files f
                    LEFT JOIN cabinets c ON f.cabinet_id = c.id
                    WHERE f.id = ? AND f.deleted_at IS NULL
                ");
                $stmt->bind_param("i", $fileId);
                $stmt->execute();
                $result = $stmt->get_result();
                $file = $result->fetch_assoc();
                
                if ($file) {
                    sendResponse(true, $file);
                } else {
                    sendResponse(false, null, 'File not found', 404);
                }
            } else if ($cabinetId) {
                // Get files by cabinet_id
                $sql = "
                    SELECT f.*, c.name as cabinet_name
                    FROM files f
                    LEFT JOIN cabinets c ON f.cabinet_id = c.id
                    WHERE f.cabinet_id = ? AND f.deleted_at IS NULL
                ";
                
                $params = [$cabinetId];
                $types = 'i';
                
                if ($search) {
                    $sql .= " AND (f.cabinet_number LIKE ? OR f.filename LIKE ?)";
                    $searchTerm = '%' . $search . '%';
                    $params[] = $searchTerm;
                    $params[] = $searchTerm;
                    $types .= 'ss';
                }
                
                $sql .= " ORDER BY CAST(SUBSTRING(f.cabinet_number, LENGTH(CONCAT('C', f.cabinet_id, '.')) + 1) AS UNSIGNED) ASC";
                
                $stmt = $conn->prepare($sql);
                $stmt->bind_param($types, ...$params);
                $stmt->execute();
                $result = $stmt->get_result();
                $files = [];
                while ($row = $result->fetch_assoc()) {
                    $files[] = $row;
                }
                sendResponse(true, $files);
            } else {
                sendResponse(false, null, 'cabinet_id or id parameter is required', 400);
            }
            break;
            
        case 'POST':
            // Create new file
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['cabinet_id']) || !isset($data['filename']) || empty(trim($data['filename']))) {
                sendResponse(false, null, 'cabinet_id and filename are required', 400);
            }
            
            $cabinetId = intval($data['cabinet_id']);
            $filename = trim($data['filename']);
            $description = isset($data['description']) ? trim($data['description']) : null;
            $category = isset($data['category']) ? trim($data['category']) : 'Documents';
            $status = isset($data['status']) ? $data['status'] : 'available';
            
            // Validate status
            if (!in_array($status, ['available', 'borrowed', 'archived'])) {
                $status = 'available';
            }
            
            // Generate cabinet number
            $cabinetNumber = getNextCabinetNumber($conn, $cabinetId);
            if (!$cabinetNumber) {
                sendResponse(false, null, 'Invalid cabinet_id', 400);
            }
            
            $stmt = $conn->prepare("
                INSERT INTO files (cabinet_id, cabinet_number, filename, description, category, status, added_by, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->bind_param("issssss", $cabinetId, $cabinetNumber, $filename, $description, $category, $status, $currentUser);
            
            if ($stmt->execute()) {
                $fileId = $conn->insert_id;
                // Fetch the created file
                $stmt = $conn->prepare("
                    SELECT f.*, c.name as cabinet_name
                    FROM files f
                    LEFT JOIN cabinets c ON f.cabinet_id = c.id
                    WHERE f.id = ?
                ");
                $stmt->bind_param("i", $fileId);
                $stmt->execute();
                $result = $stmt->get_result();
                $file = $result->fetch_assoc();
                
                sendResponse(true, $file, 'File created successfully', 201);
            } else {
                sendResponse(false, null, 'Failed to create file', 500);
            }
            break;
            
        case 'PUT':
        case 'PATCH':
            // Update file
            $data = json_decode(file_get_contents('php://input'), true);
            $fileId = isset($_GET['id']) ? intval($_GET['id']) : null;
            
            if (!$fileId) {
                sendResponse(false, null, 'File ID is required', 400);
            }
            
            $updates = [];
            $params = [];
            $types = '';
            
            if (isset($data['filename'])) {
                $updates[] = "filename = ?";
                $params[] = trim($data['filename']);
                $types .= 's';
            }
            
            if (isset($data['description'])) {
                $updates[] = "description = ?";
                $params[] = trim($data['description']);
                $types .= 's';
            }
            
            if (isset($data['category'])) {
                $updates[] = "category = ?";
                $params[] = trim($data['category']);
                $types .= 's';
            }
            
            if (isset($data['status']) && in_array($data['status'], ['available', 'borrowed', 'archived'])) {
                $updates[] = "status = ?";
                $params[] = $data['status'];
                $types .= 's';
            }
            
            if (empty($updates)) {
                sendResponse(false, null, 'No fields to update', 400);
            }
            
            $updates[] = "updated_at = NOW()";
            $params[] = $fileId;
            $types .= 'i';
            
            $sql = "UPDATE files SET " . implode(', ', $updates) . " WHERE id = ? AND deleted_at IS NULL";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param($types, ...$params);
            
            if ($stmt->execute()) {
                // Fetch updated file
                $stmt = $conn->prepare("
                    SELECT f.*, c.name as cabinet_name
                    FROM files f
                    LEFT JOIN cabinets c ON f.cabinet_id = c.id
                    WHERE f.id = ?
                ");
                $stmt->bind_param("i", $fileId);
                $stmt->execute();
                $result = $stmt->get_result();
                $file = $result->fetch_assoc();
                
                sendResponse(true, $file, 'File updated successfully');
            } else {
                sendResponse(false, null, 'Failed to update file', 500);
            }
            break;
            
        case 'DELETE':
            // Soft delete (archive) file
            $fileId = isset($_GET['id']) ? intval($_GET['id']) : null;
            
            if (!$fileId) {
                sendResponse(false, null, 'File ID is required', 400);
            }
            
            $stmt = $conn->prepare("
                UPDATE files 
                SET deleted_at = NOW(), 
                    status = 'archived',
                    updated_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            ");
            $stmt->bind_param("i", $fileId);
            
            if ($stmt->execute()) {
                sendResponse(true, null, 'File archived successfully');
            } else {
                sendResponse(false, null, 'Failed to archive file', 500);
            }
            break;
            
        default:
            sendResponse(false, null, 'Method not allowed', 405);
            break;
    }
} catch (Exception $e) {
    sendResponse(false, null, 'Server error: ' . $e->getMessage(), 500);
} finally {
    closeDBConnection($conn);
}
?>
