<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Check if 'countryName' parameter is provided
if (!isset($_REQUEST['countryName'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Parameter 'countryName' is missing.";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = null;

    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

$URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/' . $_REQUEST['countryName'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $URL);

$result = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Check for curl errors
if (curl_errno($ch)) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Curl error: " . curl_error($ch);
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = null;

    curl_close($ch);

    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

curl_close($ch);

// Check if the response is valid JSON
$decode = json_decode($result, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Error decoding JSON: " . json_last_error_msg();
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = null;

    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

if ($httpcode == 200) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode;

    header('HTTP/1.1 200 OK');
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
} else {
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(array('message' => 'ERROR', 'code' => $httpcode));
}

?>
