<?php

// Load GeoJSON data
$str = file_get_contents('countryBorders.geo.json');

// Check if the file was loaded successfully
if ($str === false) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Error loading GeoJSON file.";
    $output['status']['returnedIn'] = 0 . " ms";
    $output['data'] = null;

    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

$decoded_json = json_decode($str, true);

// Check if the JSON data was decoded successfully
if ($decoded_json === null && json_last_error() !== JSON_ERROR_NONE) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Error decoding GeoJSON data.";
    $output['status']['returnedIn'] = 0 . " ms";
    $output['data'] = null;

    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

$countryData = array();

foreach ($decoded_json['features'] as $feature) {
    $properties = $feature['properties'];
    
    $countryName = $properties['name'];
    
    $iso_a2 = isset($properties['iso_a2']) ? $properties['iso_a2'] : null;

    $countryData[] = array(
        'name' => $countryName,
        'iso_a2' => $iso_a2,
        'coordinates' => $feature['geometry']['coordinates']
    );
}

// Function to get coordinates by ISO a2 code
function getCoordinatesByIsoA2($countryData, $isoA2) {
    foreach ($countryData as $country) {
        if ($country['iso_a2'] === $isoA2) {
            return $country['coordinates'];
        }
    }
    return null; // Return null if country not found
}

// Example usage:
if (isset($_REQUEST['iso_a2'])) {
    $selectedIsoA2 = $_REQUEST['iso_a2'];
    $coordinates = getCoordinatesByIsoA2($countryData, $selectedIsoA2);

    if ($coordinates) {
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = intval((microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"]) * 1000) . " ms";
        $output['data']['coordinates'] = $coordinates;

        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    } else {
        $output['status']['code'] = "404";
        $output['status']['name'] = "Not Found";
        $output['status']['description'] = "Coordinates not found for country with ISO a2 code $selectedIsoA2.";
        $output['status']['returnedIn'] = intval((microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"]) * 1000) . " ms";
        $output['data'] = null;

        header('HTTP/1.1 404 Not Found');
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    }
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Parameter 'iso_a2' is missing.";
    $output['status']['returnedIn'] = intval((microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"]) * 1000) . " ms";
    $output['data'] = null;

    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
}

?>
