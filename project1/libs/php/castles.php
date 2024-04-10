<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);
    $countryCode = $_GET['countryCode'];
    $URL = 'http://api.geonames.org/searchJSON?formatted=true&q=castle&featureCode=CSTL&country=' . $countryCode . '&maxRows=80&lang=en&username=daniellejane_c&style=full';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $URL);

    $result = curl_exec($ch);
    curl_close($ch);

    $decode = json_decode($result, true);

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
        $output['status']['description'] = "No castles found for the provided country code.";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data'] = array();
    }

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>
