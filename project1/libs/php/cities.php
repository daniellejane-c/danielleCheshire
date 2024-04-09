<?php 

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);


	$executionStartTime = microtime(true);
    $URL = 'http://api.geonames.org/findNearbyJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&featureClass=P&featureCode=PPL&maxRows=80&radius=300&username=daniellejane_c';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $URL);

    $result = curl_exec($ch);
    curl_close($ch);

    $decode = json_decode($result, true);

    // Check if 'geonames' key exists in the decoded JSON
    if (isset($decode['geonames'])) {
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data'] = $decode['geonames'];
    } else {
        // If 'geonames' key doesn't exist, return an error response
        $output['status']['code'] = "404";
        $output['status']['name'] = "not found";
        $output['status']['description'] = "Data not found for the given coordinates.";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data'] = null;
    }

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 
?>
