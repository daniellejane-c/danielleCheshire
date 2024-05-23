<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if the 'name' parameter is set
if (!isset($_REQUEST['name'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'name' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$name = $_REQUEST['name'];

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

// Retrieve and sanitize the 'name' parameter
$name = $conn->real_escape_string($name);

// Check if the location already exists
$checkQuery = $conn->prepare("SELECT id FROM location WHERE name = ?");
$checkQuery->bind_param("s", $name);
$checkQuery->execute();
$checkResult = $checkQuery->get_result();

if ($checkResult->num_rows > 0) {
    $output['status']['code'] = "409";
    $output['status']['name'] = "Conflict";
    $output['status']['description'] = "Location already exists";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Update the location's name where the ID is the one specified (assuming 'id' parameter is passed)
if (!isset($_REQUEST['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'id' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$id = $conn->real_escape_string($_REQUEST['id']);

$updateQuery = $conn->prepare("UPDATE location SET name = ? WHERE id = ?");
$updateQuery->bind_param("si", $name, $id);
$updateQuery->execute();

// Check if the update was successful
if ($updateQuery->affected_rows > 0) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Location updated successfully";
} else {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Failed to update location or no changes detected";
}

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

echo json_encode($output);

// Close the database connection
mysqli_close($conn);

?>
