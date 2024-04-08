<?php 

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);


	$executionStartTime = microtime(true);
    $URL = 'https://content.guardianapis.com/search?q=' . $_REQUEST['countryName'] .'&api-key=cc2947f5-406e-4493-a257-cec588de90ca&show-fields=trailText,headline,thumbnail,shortUrl,publication,score';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $URL);

	$result=curl_exec($ch);
	curl_close($ch);

	$decode = json_decode($result,true);	
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
