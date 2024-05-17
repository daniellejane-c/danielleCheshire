<?php
// Include your database configuration file
include("config.php");

// Establish a connection to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Determine which table to refresh based on the request parameters
$table = isset($_GET['table']) ? $_GET['table'] : '';

// Initialize the SQL variable
$sql = '';

// Execute the appropriate SQL query based on the requested table
switch ($table) {
    case 'personnel':
        $sql = "SELECT * FROM personnel";
        break;
    case 'department':
        $sql = "SELECT * FROM department";
        break;
    case 'location':
        $sql = "SELECT * FROM location";
        break;
    default:
        // If the requested table is not recognized, return an error
        echo json_encode(["status" => "error", "message" => "Invalid table specified"]);
        exit;
}

// Execute the SQL query
$result = $conn->query($sql);

// Check the result of the query execution
if ($result === false) {
    // If query execution fails, send the error message back to the frontend
    echo json_encode(["status" => "error", "message" => "Error executing query: " . $conn->error]);
} else {
    // If the query was successful, check if any rows were returned
    if ($result->num_rows > 0) {
        // Fetch and output the data
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $data]);
    } else {
        echo json_encode(["status" => "success", "data" => []]);
    }
}

// Close the database connection
$conn->close();
?>
