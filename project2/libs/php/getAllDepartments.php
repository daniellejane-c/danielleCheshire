<?php

// Display errors for debugging purposes
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Measure script execution time
$executionStartTime = microtime(true);

// Set response headers to indicate JSON content
header('Content-Type: application/json; charset=UTF-8');

// Include database configuration
include("config.php");

// Check if the configuration file exists
if (!file_exists("config.php")) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Configuration file not found";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    echo json_encode($output);
    exit;
}

// Check if the configuration file is readable
if (!is_readable("config.php")) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Configuration file is not readable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    echo json_encode($output);
    exit;
}

// Include database configuration
include("config.php");

// Check for required database configuration variables
if (!isset($cd_host) || !isset($cd_user) || !isset($cd_password) || !isset($cd_dbname) || !isset($cd_port) || !isset($cd_socket)) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Incomplete database configuration";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    echo json_encode($output);
    exit;
}

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

    echo json_encode($output);
    exit;
}

// SQL query to select department data
$query = 'SELECT id, name, locationID FROM department';

// Execute SQL query
$result = $conn->query($query);

// Check for query execution errors
if (!$result) {
    // Query execution failed
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Query execution failed";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    echo json_encode($output);
    exit;
}

// Initialize an array to store fetched data
$data = [];

// Fetch rows from the result set and store in the data array
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Close the database connection
$conn->close();

// Prepare success response
$output['status']['code'] = "200";
$output['status']['name'] = "success";
$output['status']['description'] = "Query executed successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

// Return success response as JSON
echo json_encode($output); 

?>
