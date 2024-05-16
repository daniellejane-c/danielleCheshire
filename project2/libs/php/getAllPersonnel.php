<?php

// Display errors for debugging purposes
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
if (mysqli_connect_errno()) {
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

// SQL query to select personnel data
$query = 'SELECT id, firstName, lastName, jobTitle, email, departmentID FROM personnel';

// Execute SQL query
$result = $conn->query($query);

// Check for query execution errors
if (!$result) {
    // Query execution failed
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Query execution failed";
    $output['data'] = [];

    // Close database connection
    mysqli_close($conn);

    // Return error response as JSON
    echo json_encode($output); 
    exit;
}

// Initialize an array to store fetched data
$data = [];

// Fetch rows from the result set and store in the data array
while ($row = mysqli_fetch_assoc($result)) {
    array_push($data, $row);
}

// Close the database connection
mysqli_close($conn);

// Prepare success response
$output['status']['code'] = "200";
$output['status']['name'] = "success";
$output['status']['description'] = "Query executed successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

// Return success response as JSON
echo json_encode($output); 

?>
