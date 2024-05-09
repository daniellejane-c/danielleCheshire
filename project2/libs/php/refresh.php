<?php
// Connect to your database
include("config.php");

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Determine which table to refresh based on the request parameters
$table = isset($_GET['table']) ? $_GET['table'] : '';

// Execute the appropriate SQL query based on the requested table
switch ($table) {
    case 'personnel':
        $sql = "SELECT * FROM personnel";
        break;
    case 'departments':
        $sql = "SELECT * FROM department";
        break;
    case 'locations':
        $sql = "SELECT * FROM location";
        break;
    default:
        // If the requested table is not recognized, return an error
        echo "Error: Invalid table specified";
        exit;
}

echo "SQL Query: $sql"; 
// Execute the SQL query
$result = $conn->query($sql);

if ($result === false) {
    // If query execution fails, send the error message back to the frontend
    echo "Error executing query: " . $conn->error;
} else {
    // You can process the result further if needed
    // Send response back to the frontend
    echo "success";
}

// Close the connection
$conn->close();

// Log any unexpected errors
if ($result === false && !$conn->error) {
    echo "Unexpected error occurred during query execution.";
}
?>
