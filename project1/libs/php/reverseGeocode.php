<?php 

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    if(isset($_REQUEST['lat']) && isset($_REQUEST['lng'])) {
        $lat = $_REQUEST['lat'];
        $lng = $_REQUEST['lng'];

        // Construct the URL
        $URL = 'https://api.opencagedata.com/geocode/v1/json?q=' . $lat .  '%2C' . $lng . '&key=48a78b864d4b4e85a485b585c3d6fdb0';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $URL);

        $result = curl_exec($ch);
        curl_close($ch);

        $decode = json_decode($result, true);  
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data'] = $decode;

        header('Content-Type: application/json; charset=UTF-8');

        echo json_encode($output); 
    } else {
        // Handle case where 'lat' or 'lng' parameters are missing
        $output['status']['code'] = "400";
        $output['status']['name'] = "Bad Request";
        $output['status']['description'] = "'lat' and/or 'lng' parameters are missing";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data'] = null;

        header('Content-Type: application/json; charset=UTF-8');

        echo json_encode($output); 
    }
?>
