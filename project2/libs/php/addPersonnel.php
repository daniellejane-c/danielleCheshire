<?php


ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if the 'firstName' parameter is provided
if (!isset($_POST['firstName'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'firstName' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    exit;
}

// Check if the 'lastName' parameter is provided
if (!isset($_POST['lastName'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'lastName' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    exit;
}

// Check if the 'jobTitle' parameter is provided
if (!isset($_POST['jobTitle'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'jobTitle' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    exit;
}

// Check if the 'email' parameter is provided
if (!isset($_POST['email'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'email' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    exit;
}

// Check if the 'departmentID' parameter is provided
if (!isset($_POST['departmentID'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing 'departmentID' parameter";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    exit;
}




// Sanitize and validate input data
// Sanitize and validate input data
$firstName = filter_var($_POST['firstName'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$lastName = filter_var($_POST['lastName'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$jobTitle = filter_var($_POST['jobTitle'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$departmentID = intval($_POST['departmentID']); // No need to sanitize as it's already an integer

if (empty($firstName) || empty($lastName) || empty($jobTitle) || empty($email) || $departmentID <= 0) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Invalid input data";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    exit;
}


$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for database connection error
if ($conn->connect_errno) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "Failure";
    $output['status']['description'] = "Database connection failed: " . $conn->connect_error;
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    exit;
}

// Check if email already exists
$checkEmailQuery = $conn->prepare("SELECT id FROM personnel WHERE email = ?");
$checkEmailQuery->bind_param("s", $email);
$checkEmailQuery->execute();
$checkEmailResult = $checkEmailQuery->get_result();

if ($checkEmailResult->num_rows > 0) {
    $output['status']['code'] = "409";
    $output['status']['name'] = "Conflict";
    $output['status']['description'] = "Email already exists";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    exit;
}

// Insert personnel into the database
$insertQuery = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES (?, ?, ?, ?, ?)');
$insertQuery->bind_param("ssssi", $firstName, $lastName, $jobTitle, $email, $departmentID);
$insertQuery->execute();
$inserted_id = $insertQuery->insert_id;

// Prepare the response
$output['status']['code'] = "200";
$output['status']['name'] = "OK";
$output['status']['description'] = "Personnel added successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = ['personnel_id' => $inserted_id];

echo json_encode($output);

mysqli_close($conn);
?>
