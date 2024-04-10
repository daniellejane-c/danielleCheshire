<?php
// Load GeoJSON data

$str = file_get_contents('countryBorders.geo.json');
$decoded_json = json_decode($str, true);


$countryData = array();


foreach ($decoded_json['features'] as $feature) {

    $properties = $feature['properties'];
    

    $countryName = $properties['name'];
    $iso_a2 = isset($properties['iso_a2']) ? $properties['iso_a2'] : null;
    $iso_a3 = isset($properties['iso_a3']) ? $properties['iso_a3'] : null;
    $iso_n3 = isset($properties['iso_n3']) ? $properties['iso_n3'] : null;

    $coordinates = $feature['geometry']['coordinates'];
    

    $countryData[] = array(
        'name' => $countryName,
        'iso_a2' => $iso_a2,
        'iso_a3' => $iso_a3,
        'iso_n3' => $iso_n3,
        'coordinates' => $coordinates
    );
}

// Output the country data as JSON
echo json_encode($countryData);
?>
