<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Check if the required parameter 'countryName' is provided
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

$URL = 'https://content.guardianapis.com/search?q=' . $_REQUEST['countryName'] . '&api-key=cc2947f5-406e-4493-a257-cec588de90ca&show-fields=trailText,headline,thumbnail,shortUrl,publication,score';

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

header('Content-Type: application/json; charset=UTF-8');

// Check if the response is valid JSON
$decode = json_decode($result, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "internal server error";
    $output['status']['description'] = "Error decoding JSON: " . json_last_error_msg();
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = array();

    echo json_encode($output);
    exit;
}

echo $result;

?>
