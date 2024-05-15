<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    
    mysqli_close($conn);
    
    echo json_encode($output);
    
    exit;
}   

$query = $conn->prepare('SELECT id FROM location WHERE name = ?');

$query->bind_param("s", $_GET['location']);

$query->execute();

if ($query === false) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "Query failed";    
    $output['data'] = [];

    echo json_encode($output); 
    
    mysqli_close($conn);
    exit;
}

$result = $query->get_result();

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data = $row;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "Success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

echo json_encode($output); 

mysqli_close($conn);

?>
