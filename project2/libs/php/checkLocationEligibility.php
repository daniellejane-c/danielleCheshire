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

// Check if there are any personnel records associated with the department
$id = intval($_POST['id']);
$query = "SELECT COUNT(*) AS count FROM department WHERE locationID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$count = $row['count'];

if ($count > 0) {
    // Personnel records exist for the department, so it cannot be deleted
    $output['status']['code'] = "409";
    $output['status']['name'] = "Conflict";
    $output['status']['description'] = "Cannot delete Location. There are $count personnel records associated with it.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [
        'count' => $count
    ];
    echo json_encode($output);
    exit;
}

// Department is eligible for deletion
$output['status']['code'] = "200";
$output['status']['description'] = "Location is eligible for deletion";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

// Close statement and connection
$stmt->close();
$conn->close();

// Output the response as JSON
echo json_encode($output);
?>
