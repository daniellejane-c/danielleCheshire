<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    $url='https://api.currencyapi.com/v3/historical?apikey=' . 'cur_live_A0VZdmnGDthxiEdiLLKeMe0TixxJqmvDV1y7lQIv' . '&currencies=' . 'EUR%2CUSD%2CCAD' . '&base_currency=' . 'GBP' . '&date=' . '2002-05-17';




	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);

	$result=curl_exec($ch);
	
	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['meta'];
	$output['data'] = $decode['data'];
	header('Content-Type: application/json; charset=UTF-8');
	
	echo json_encode($output); 
	

?>

