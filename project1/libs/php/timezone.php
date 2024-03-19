<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://world-time-zones-api.p.rapidapi.com/api/v1/location?location=North%20America",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"X-RapidAPI-Host: world-time-zones-api.p.rapidapi.com",
		"X-RapidAPI-Key: 8ff931560cmshac41b97b3716a78p15ad85jsn9586566ded16"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}