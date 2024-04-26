<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Check if 'lat' and 'lng' parameters are provided
if (!isset($_REQUEST['lat']) || !isset($_REQUEST['lng'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "'lat' and/or 'lng' parameters are missing";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = null;

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

$lat = $_REQUEST['lat'];
$lng = $_REQUEST['lng'];

// Construct the URL
$URL = 'https://api.opencagedata.com/geocode/v1/json?q=' . $lat .  '%2C' . $lng . '&key=48a78b864d4b4e85a485b585c3d6fdb0';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $URL);

$result = curl_exec($ch);

// Check for curl errors
if (curl_errno($ch)) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Curl error: " . curl_error($ch);
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = null;

    curl_close($ch);

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

curl_close($ch);

$decode = json_decode($result, true);

// Check if the response is valid JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Error decoding JSON: " . json_last_error_msg();
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = null;

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

// Check if 'country' and 'ISO_3166-1_alpha-2' keys exist in the decoded JSON
if (isset($decode['results'][0]['components']['country'])) {
    $country = $decode['results'][0]['components']['country'];
    $iso2Code = $decode['results'][0]['components']['ISO_3166-1_alpha-2'];
    $latitude = $decode['results'][0]['geometry']['lat'];
    $longitude = $decode['results'][0]['geometry']['lng'];

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['country'] = $country;
    $output['data']['iso2Code'] = $iso2Code;
    $output['data']['latitude'] = $latitude;
    $output['data']['longitude'] = $longitude;

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
} else {
    $output['status']['code'] = "404";
    $output['status']['name'] = "Not Found";
    $output['status']['description'] = "No country information found for the provided coordinates";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = null;

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
}

?>
