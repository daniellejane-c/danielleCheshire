<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
$countryName = $_REQUEST['countryName'] ?? '';

if (empty($countryName)) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Country name is missing";
    echo json_encode($output);
    exit;
}

$URL = 'https://restcountries.com/v3.1/name/' . $_REQUEST['countryName'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $URL);

$result = curl_exec($ch);

if (curl_errno($ch)) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Curl error: " . curl_error($ch);
    echo json_encode($output);
    curl_close($ch);
    exit;
}

curl_close($ch);

$decode = json_decode($result, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "JSON decoding error: " . json_last_error_msg();
    echo json_encode($output);
    exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>
