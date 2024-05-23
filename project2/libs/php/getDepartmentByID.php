<?php

// example use from browser
// http://localhost/companydirectory/libs/php/getDepartmentByID.php?id=<id>

// remove next two lines for production    
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if the 'id' parameter is provided
if (!isset($_REQUEST['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'id' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// SQL statement accepts parameters and so is prepared to avoid SQL injection.
$query = $conn->prepare('SELECT id, name, locationID FROM department WHERE id = ?');
$query->bind_param("i", $_REQUEST['id']);
$query->execute();

$result = $query->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$query->close();

// Second query to fetch locations
$query = 'SELECT id, name FROM location ORDER BY name';
$result = $conn->query($query);

if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    $conn->close();

    echo json_encode($output);

    exit;
}

$locations = [];

while ($row = $result->fetch_assoc()) {
    $locations[] = $row;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [
    'department' => $data,
    'locations' => $locations
];

echo json_encode($output);

$conn->close();

?>
