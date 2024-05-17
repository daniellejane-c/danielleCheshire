<?php
// Set error reporting and display errors for debugging
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Measure script execution time
$executionStartTime = microtime(true);

// Include database configuration
include("config.php");

// Set response headers to indicate JSON content
header('Content-Type: application/json; charset=UTF-8');

// Establish database connection
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for database connection errors
if ($conn->connect_errno) {
    // Database connection failed
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Database connection failed";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    // Close database connection
    mysqli_close($conn);

    // Return error response as JSON
    echo json_encode($output);
    exit;
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $output['status']['code'] = "405";
    $output['status']['name'] = "Method Not Allowed";
    $output['status']['description'] = "Invalid request method";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Validate the presence and format of the ID
if (!isset($_POST['id']) || !is_numeric($_POST['id']) || intval($_POST['id']) <= 0) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Invalid or missing ID";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Delete personnel record
$id = intval($_POST['id']);
$sql = "DELETE FROM personnel WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Failed to prepare SQL statement: " . $conn->error;
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$stmt->bind_param('i', $id);
if (!$stmt->execute()) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Failed to execute SQL statement: " . $stmt->error;
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Check if any row was affected
if ($stmt->affected_rows === 0) {
    $output['status']['code'] = "404";
    $output['status']['name'] = "Not Found";
    $output['status']['description'] = "No record found with the given ID";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Success response
$output['status']['code'] = "200";
$output['status']['description'] = "Personnel deleted successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

// Close statement and connection
$stmt->close();
$conn->close();

// Output the response as JSON
echo json_encode($output);
?>
