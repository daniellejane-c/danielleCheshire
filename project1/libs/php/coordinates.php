<?php 

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);


	$executionStartTime = microtime(true);
	$URL='https://api.geoapify.com/v1/geocode/search?text=' . 'B27' . '&lang=' . 'en' . '&limit=' . '10' . '&type=' . 'postcode' . '&filter=' . 'countrycode:gb' . '&apiKey=' . '2fabd7929f744f7983ba647564cb4c27';


	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $URL);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$key = key($array);

	$value = $array[$key];


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['type'];

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
