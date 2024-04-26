<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
$countryCode = isset($_GET['countryCode']) ? $_GET['countryCode'] : '';

if(empty($countryCode)) {
    handleError("400", "Bad Request", "Country code is missing.");
}

$URL = 'http://api.geonames.org/searchJSON?formatted=true&q=city&featureCode=PPL&country=' . $countryCode . '&maxRows=80&lang=en&username=daniellejane_c&style=full';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $URL);

$result = curl_exec($ch);

if(curl_errno($ch)) {
    handleError("500", "Internal Server Error", "cURL error: " . curl_error($ch));
}

curl_close($ch);

$decode = json_decode($result, true);

if(json_last_error() !== JSON_ERROR_NONE) {
    handleError("500", "Internal Server Error", "JSON decoding error: " . json_last_error_msg());
}

// Check if 'geonames' key exists in the decoded JSON
if(isset($decode['geonames'])) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode['geonames'];
} else {
    $output['status']['code'] = "404";
    $output['status']['name'] = "not found";
    $output['status']['description'] = "No cities found for the provided country code.";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = array();
}

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

function handleError($statusCode, $statusName, $description) {
    global $executionStartTime;
    
    $output['status']['code'] = $statusCode;
    $output['status']['name'] = $statusName;
    $output['status']['description'] = $description;
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = array();

    header('Content-Type: application/json; charset=UTF-8');
    http_response_code($statusCode);
    echo json_encode($output);
    exit();
}

?>
