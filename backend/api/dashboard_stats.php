<?php
/**
 * Dashboard Stats API Endpoint
 * Returns statistics for the dashboard
 * TODO: Add authentication/session validation
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../database/db.php';

// Helper function to send JSON response
function sendResponse($success, $data = null, $message = '', $statusCode = 200) {
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

try {
    $stats = [];
    
    // Total files (non-deleted)
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM files WHERE deleted_at IS NULL");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['total_files'] = (int)$result->fetch_assoc()['count'];
    
    // Total cabinets (active and pending, not archived)
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM cabinets WHERE status != 'archived' OR status IS NULL");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['total_cabinets'] = (int)$result->fetch_assoc()['count'];
    
    // Pending cabinets
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM cabinets WHERE status = 'pending'");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['pending_cabinets'] = (int)$result->fetch_assoc()['count'];
    
    // Files by status
    $stmt = $conn->prepare("SELECT status, COUNT(*) as count FROM files WHERE deleted_at IS NULL GROUP BY status");
    $stmt->execute();
    $result = $stmt->get_result();
    $statusCounts = ['available' => 0, 'borrowed' => 0, 'archived' => 0];
    while ($row = $result->fetch_assoc()) {
        $statusCounts[$row['status']] = (int)$row['count'];
    }
    $stats['files_by_status'] = $statusCounts;
    
    // Files by category
    $stmt = $conn->prepare("SELECT category, COUNT(*) as count FROM files WHERE deleted_at IS NULL GROUP BY category");
    $stmt->execute();
    $result = $stmt->get_result();
    $categoryCounts = ['Documents' => 0, 'Sports' => 0, 'Objects' => 0];
    while ($row = $result->fetch_assoc()) {
        $category = $row['category'] ?: 'Documents';
        if (isset($categoryCounts[$category])) {
            $categoryCounts[$category] = (int)$row['count'];
        } else {
            $categoryCounts['Documents'] += (int)$row['count'];
        }
    }
    $stats['files_by_category'] = $categoryCounts;
    
    // Total archived files (files with deleted_at IS NOT NULL are soft-deleted)
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM files WHERE deleted_at IS NOT NULL OR status = 'archived'");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['archived_files'] = (int)$result->fetch_assoc()['count'];
    
    // Recent documents (latest 4, ordered by created_at DESC)
    $stmt = $conn->prepare("
        SELECT 
            id,
            filename,
            category,
            status,
            created_at,
            description
        FROM files
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT 4
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $recentDocuments = [];
    while ($row = $result->fetch_assoc()) {
        $recentDocuments[] = [
            'id' => (int)$row['id'],
            'filename' => $row['filename'],
            'category' => $row['category'] ?: 'Documents',
            'status' => $row['status'] ?: 'available',
            'created_at' => $row['created_at'],
            'description' => $row['description']
        ];
    }
    $stats['recent_documents'] = $recentDocuments;
    
    sendResponse(true, $stats);
} catch (Exception $e) {
    sendResponse(false, null, 'Server error: ' . $e->getMessage(), 500);
} finally {
    closeDBConnection($conn);
}
?>
