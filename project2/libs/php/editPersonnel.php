<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$executionStartTime = microtime(true);

// Check if employeeID is set and not empty
if (!isset($_REQUEST['employeeID']) || empty($_REQUEST['employeeID'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Missing or empty parameter: employeeID";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) . " sec";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Retrieve and sanitize parameters
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check if the connection was successful
if ($conn->connect_errno) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Failed to connect to the database";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) . " sec";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Retrieve and sanitize parameters
$employeeID = $_REQUEST['employeeID'];
$updatedFields = [];

// Check and collect updated fields
if (isset($_REQUEST['firstName']) && !empty($_REQUEST['firstName'])) {
    $updatedFields[] = "firstName = '" . $conn->real_escape_string($_REQUEST['firstName']) . "'";
}

if (isset($_REQUEST['lastName']) && !empty($_REQUEST['lastName'])) {
    $updatedFields[] = "lastName = '" . $conn->real_escape_string($_REQUEST['lastName']) . "'";
}

if (isset($_REQUEST['jobTitle']) && !empty($_REQUEST['jobTitle'])) {
    $updatedFields[] = "jobTitle = '" . $conn->real_escape_string($_REQUEST['jobTitle']) . "'";
}

if (isset($_REQUEST['email']) && !empty($_REQUEST['email'])) {
    // Check if the new email is different from the current email in the database
    $checkEmailQuery = $conn->prepare("SELECT email FROM personnel WHERE id = ?");
    $checkEmailQuery->bind_param("i", $employeeID);
    $checkEmailQuery->execute();
    $checkEmailResult = $checkEmailQuery->get_result();
    $row = $checkEmailResult->fetch_assoc();
    $currentEmail = $row['email'];

    if ($_REQUEST['email'] !== $currentEmail) {
        // New email is different, check for duplicate email
        $checkDuplicateQuery = $conn->prepare("SELECT id FROM personnel WHERE email = ?");
        $checkDuplicateQuery->bind_param("s", $_REQUEST['email']);
        $checkDuplicateQuery->execute();
        $checkDuplicateResult = $checkDuplicateQuery->get_result();

        if ($checkDuplicateResult->num_rows > 0) {
            // Email already exists, return conflict error
            $output['status']['code'] = "409";
            $output['status']['name'] = "Conflict";
            $output['status']['description'] = "Email already exists";
            $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) . " sec";
            $output['data'] = [];
            echo json_encode($output);
            exit;
        }
    }

    // Add email to updated fields
    $updatedFields[] = "email = '" . $conn->real_escape_string($_REQUEST['email']) . "'";
}

if (isset($_REQUEST['departmentID']) && !empty($_REQUEST['departmentID'])) {
    $updatedFields[] = "departmentID = '" . $conn->real_escape_string($_REQUEST['departmentID']) . "'";
}

// Check if any field has been updated
if (empty($updatedFields)) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "No fields provided for update";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) . " sec";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Prepare and execute the query to update the personnel
$updateQuery = "UPDATE personnel SET " . implode(', ', $updatedFields) . " WHERE id = ?";
$updateStatement = $conn->prepare($updateQuery);
$updateStatement->bind_param("i", $employeeID);
$updateStatement->execute();

// Check if the update was successful
if ($updateStatement->affected_rows > 0) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "OK";
    $output['status']['description'] = "Personnel updated successfully";
} else {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Failed to update personnel";
}

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) . " sec";
$output['data'] = [];

echo json_encode($output);

// Close the database connection
mysqli_close($conn);
?>
