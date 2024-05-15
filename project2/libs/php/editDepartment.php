<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if the 'name' parameter is set
if (!isset($_REQUEST['departmentName']) || !isset($_REQUEST['locationID'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'departmentName' or 'locationID' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Attempt to establish a database connection
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check if the connection was successful
if ($conn->connect_errno) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Failed to connect to the database";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Retrieve and sanitize the 'departmentName' parameter
$departmentName = $conn->real_escape_string($_REQUEST['departmentName']);
$locationID = $conn->real_escape_string($_REQUEST['locationID']);

// Prepare and execute the query to check if the department already exists
$checkQuery = $conn->prepare("SELECT id FROM department WHERE name = ?");
$checkQuery->bind_param("s", $departmentName);
$checkQuery->execute();
$checkResult = $checkQuery->get_result();

// Check if there are any rows returned
if ($checkResult->num_rows > 0) {
    $output['status']['code'] = "409";
    $output['status']['name'] = "Conflict";
    $output['status']['description'] = "Department already exists";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// If 'originalDepartmentName' parameter is set, retrieve and sanitize it
$originalDepartmentName = isset($_REQUEST['originalDepartmentName']) ? $conn->real_escape_string($_REQUEST['originalDepartmentName']) : '';

// Prepare and execute the query to update the department
$updateQuery = $conn->prepare("UPDATE department SET name = ?, locationID = ? WHERE name = ?");
$updateQuery->bind_param("sss", $departmentName, $locationID, $originalDepartmentName);

$updateQuery->execute();

// Check if the update was successful
// Check if the update was successful
if ($updateQuery->affected_rows > 0) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Department updated successfully";
} else {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Failed to update department: " . $conn->error;
    // Additional debug statement
    error_log("MySQL error: " . $conn->error);
}

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

echo json_encode($output);

// Close the database connection
mysqli_close($conn);

?>
