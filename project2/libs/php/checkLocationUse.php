<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if the 'id' parameter is set
if (!isset($_REQUEST['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'id' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$locationID = intval($_REQUEST['id']);

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

// Prepare and execute the SQL statement
$sql = "SELECT l.name AS locationName, COUNT(d.id) as departmentCount
        FROM location l 
        LEFT JOIN department d ON d.locationID = l.id
        WHERE l.id = ?";
        
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $locationID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Success";
    $output['data'] = [$data];
} else {
    $output['status']['code'] = "404";
    $output['status']['name'] = "Not Found";
    $output['status']['description'] = "No location found with the given ID";
    $output['data'] = [];
}

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

echo json_encode($output);

// Close the database connection
$conn->close();


?>
