<?php

// example use from browser
// http://localhost/companydirectory/libs/php/addDepartment.php?name=<Department_name>&locationID=<Location_ID>

// Remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if the 'name' parameter is provided
if (!isset($_REQUEST['name'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'name' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Check if the 'locationID' parameter is provided
if (!isset($_REQUEST['locationID'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'locationID' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for database connection error
if ($conn->connect_errno) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Database connection failed: " . $conn->connect_error;
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Retrieve 'name' and 'locationID' parameters
$name = $_REQUEST['name'];
$locationID = $_REQUEST['locationID'];

// Check if the Department already exists in the database
$checkQuery = $conn->prepare("SELECT id FROM department WHERE name = ?");
$checkQuery->bind_param("s", $name);
$checkQuery->execute();
$checkResult = $checkQuery->get_result();

if ($checkResult->num_rows > 0) {
    // Department already exists
    $output['status']['code'] = "409";
    $output['status']['name'] = "Conflict";
    $output['status']['description'] = "Department already exists";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Insert the Department into the database
$insertQuery = $conn->prepare('INSERT INTO department (name, locationID) VALUES (?, ?)');
$insertQuery->bind_param("si", $name, $locationID);
$insertQuery->execute();
$inserted_id = $insertQuery->insert_id;

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "Department added successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = ['Department_id' => $inserted_id];

echo json_encode($output);

mysqli_close($conn);

?>
