<?php
// Set error reporting and display errors for debugging
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
if ($conn->connect_errno) {
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

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    $output['status']['code'] = "405";
    $output['status']['name'] = "Method Not Allowed";
    $output['status']['description'] = "Invalid request method";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Validate the presence and format of the location ID
$locationID = isset($_GET['locationID']) ? $_GET['locationID'] : "";

// Prepare SQL query to fetch filtered personnel data
$sql = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location 
        FROM personnel p 
        LEFT JOIN department d ON (d.id = p.departmentID) 
        LEFT JOIN location l ON (l.id = d.locationID) 
        WHERE l.id = '$locationID'
        ORDER BY p.lastName, p.firstName, d.name, l.name";

// Execute the query
$result = mysqli_query($conn, $sql);

if (!$result) {
    // Error handling if query fails
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Error executing SQL query: " . mysqli_error($conn);
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
} else {
    // Fetch data and prepare response
    $personnelData = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $personnelData[] = $row;
    }

    // Send the filtered personnel data as JSON response
    $output['status']['code'] = "200";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $personnelData;
}

// Close database connection
mysqli_close($conn);

// Output the response as JSON
echo json_encode($output);
?>
