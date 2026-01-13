<?php
/**
 * Cabinets API Endpoint
 * Handles CRUD operations for cabinets
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

// TODO: Get current user ID from session
// For now, using default user_id = 1 (admin)
$currentUserId = 1;
$currentUser = 'Admin'; // TODO: Get from session

try {
    switch ($method) {
        case 'GET':
            // Get all cabinets or single cabinet
            $cabinetId = isset($_GET['id']) ? intval($_GET['id']) : null;
            
            if ($cabinetId) {
                // Get single cabinet
                $stmt = $conn->prepare("
                    SELECT c.*, 
                           COUNT(DISTINCT f.id) as file_count
                    FROM cabinets c
                    LEFT JOIN files f ON c.id = f.cabinet_id AND f.deleted_at IS NULL
                    WHERE c.id = ?
                    GROUP BY c.id
                ");
                $stmt->bind_param("i", $cabinetId);
                $stmt->execute();
                $result = $stmt->get_result();
                $cabinet = $result->fetch_assoc();
                
                if ($cabinet) {
                    sendResponse(true, $cabinet);
                } else {
                    sendResponse(false, null, 'Cabinet not found', 404);
                }
            } else {
                // Get all cabinets with file counts
                $stmt = $conn->prepare("
                    SELECT c.*, 
                           COUNT(DISTINCT f.id) as file_count
                    FROM cabinets c
                    LEFT JOIN files f ON c.id = f.cabinet_id AND f.deleted_at IS NULL
                    WHERE c.status != 'archived' OR c.status IS NULL
                    GROUP BY c.id
                    ORDER BY c.position ASC, c.created_at ASC
                ");
                $stmt->execute();
                $result = $stmt->get_result();
                $cabinets = [];
                while ($row = $result->fetch_assoc()) {
                    $cabinets[] = $row;
                }
                sendResponse(true, $cabinets);
            }
            break;
            
        case 'POST':
            // Create new cabinet
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['name']) || empty(trim($data['name']))) {
                sendResponse(false, null, 'Cabinet name is required', 400);
            }
            
            $name = trim($data['name']);
            $description = isset($data['description']) ? trim($data['description']) : null;
            $position = isset($data['position']) ? intval($data['position']) : null;
            $status = isset($data['status']) ? $data['status'] : 'active';
            
            // Validate status
            if (!in_array($status, ['active', 'pending', 'archived'])) {
                $status = 'active';
            }
            
            $stmt = $conn->prepare("
                INSERT INTO cabinets (user_id, name, description, position, status, added_by, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->bind_param("ississ", $currentUserId, $name, $description, $position, $status, $currentUser);
            
            if ($stmt->execute()) {
                $cabinetId = $conn->insert_id;
                // Fetch the created cabinet with file count
                $stmt = $conn->prepare("
                    SELECT c.*, 
                           COUNT(DISTINCT f.id) as file_count
                    FROM cabinets c
                    LEFT JOIN files f ON c.id = f.cabinet_id AND f.deleted_at IS NULL
                    WHERE c.id = ?
                    GROUP BY c.id
                ");
                $stmt->bind_param("i", $cabinetId);
                $stmt->execute();
                $result = $stmt->get_result();
                $cabinet = $result->fetch_assoc();
                
                sendResponse(true, $cabinet, 'Cabinet created successfully', 201);
            } else {
                sendResponse(false, null, 'Failed to create cabinet', 500);
            }
            break;
            
        case 'PUT':
        case 'PATCH':
            // Update cabinet
            $data = json_decode(file_get_contents('php://input'), true);
            $cabinetId = isset($_GET['id']) ? intval($_GET['id']) : null;
            
            if (!$cabinetId) {
                sendResponse(false, null, 'Cabinet ID is required', 400);
            }
            
            $updates = [];
            $params = [];
            $types = '';
            
            if (isset($data['name'])) {
                $updates[] = "name = ?";
                $params[] = trim($data['name']);
                $types .= 's';
            }
            
            if (isset($data['description'])) {
                $updates[] = "description = ?";
                $params[] = trim($data['description']);
                $types .= 's';
            }
            
            if (isset($data['position'])) {
                $updates[] = "position = ?";
                $params[] = intval($data['position']);
                $types .= 'i';
            }
            
            if (isset($data['status']) && in_array($data['status'], ['active', 'pending', 'archived'])) {
                $updates[] = "status = ?";
                $params[] = $data['status'];
                $types .= 's';
            }
            
            if (empty($updates)) {
                sendResponse(false, null, 'No fields to update', 400);
            }
            
            $updates[] = "updated_at = NOW()";
            $params[] = $cabinetId;
            $types .= 'i';
            
            $sql = "UPDATE cabinets SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param($types, ...$params);
            
            if ($stmt->execute()) {
                // Fetch updated cabinet
                $stmt = $conn->prepare("
                    SELECT c.*, 
                           COUNT(DISTINCT f.id) as file_count
                    FROM cabinets c
                    LEFT JOIN files f ON c.id = f.cabinet_id AND f.deleted_at IS NULL
                    WHERE c.id = ?
                    GROUP BY c.id
                ");
                $stmt->bind_param("i", $cabinetId);
                $stmt->execute();
                $result = $stmt->get_result();
                $cabinet = $result->fetch_assoc();
                
                sendResponse(true, $cabinet, 'Cabinet updated successfully');
            } else {
                sendResponse(false, null, 'Failed to update cabinet', 500);
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
