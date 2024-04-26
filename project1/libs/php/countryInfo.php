<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


if (!isset($_REQUEST['countryName'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "bad request";
    $output['status']['description'] = "Parameter 'countryName' is missing.";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = array();

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

$URL = 'https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['countryName'] . '&key=48a78b864d4b4e85a485b585c3d6fdb0&language=en&pretty=1';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $URL);

$result = curl_exec($ch);

// Check for curl errors
if (curl_errno($ch)) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "internal server error";
    $output['status']['description'] = "Curl error: " . curl_error($ch);
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = array();

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
    $output['status']['name'] = "internal server error";
    $output['status']['description'] = "Error decoding JSON: " . json_last_error_msg();
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = array();

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

// Check if 'results' key exists in the decoded JSON
if (isset($decode['results'])) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode['results'];
    echo json_encode($output);
} else {
    $output['status']['code'] = "404";
    $output['status']['name'] = "not found";
    $output['status']['description'] = "No results found for the provided query.";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = array();
    echo json_encode($output);
}

?>
