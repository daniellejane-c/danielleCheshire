<?php 

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);
    $URL = 'https://openexchangerates.org/api/latest.json?app_id=67dfb5b618574153adb56e19b8955114';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $URL);

    $result = curl_exec($ch);
    curl_close($ch);

    header('Content-Type: application/json; charset=UTF-8');

    echo $result; 

?>
