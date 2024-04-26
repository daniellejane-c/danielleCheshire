<?php

// Load GeoJSON data
$str = file_get_contents('countryBorders.geo.json');

// Check if the GeoJSON file was loaded successfully
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

$features = $decoded_json['features'];

$selectlist = array();
foreach ($features as $feature) {
    foreach ($feature as $key => $value) {
        if (!empty($key)) {
            if ($key == "properties") {
                // Store both country name and country code in the associative array
                $selectlist[] = array(
                    'name' => $value['name'],
                    'code' => $value['iso_a2'] // Using iso_a2 instead of iso_a3
                );
            }
        }
    }
}

// Check if the selectlist is empty
if (empty($selectlist)) {
    $output['status']['code'] = "404";
    $output['status']['name'] = "Not Found";
    $output['status']['description'] = "No country data found in GeoJSON.";
    $output['status']['returnedIn'] = intval((microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"]) * 1000) . " ms";
    $output['data'] = null;

    header('HTTP/1.1 404 Not Found');
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

// Sort the selectlist alphabetically based on country name
usort($selectlist, function($a, $b) {
    if ($a['code'] == '-99' && $b['code'] != '-99') {
        return 1; // $a comes after $b
    } elseif ($a['code'] != '-99' && $b['code'] == '-99') {
        return -1; // $a comes before $b
    } else {
        return strcmp($a['name'], $b['name']); // standard comparison
    }
});

// Generate the HTML for the dropdown menu
foreach ($selectlist as $country) {
    echo "<option value='" . $country['code'] . "'>" . $country['name'] . "</option>\n";
}

?>
