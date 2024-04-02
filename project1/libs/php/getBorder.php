
<?php

$geojson_data = file_get_contents('countryBorders.geo.json');
$data = json_decode($geojson_data, true);

// Extract coordinates
$coordinates = [];

foreach ($data['features'] as $feature) {
    $geometry = $feature['geometry'];
    if ($geometry['type'] == 'MultiPolygon') {
        foreach ($geometry['coordinates'] as $polygon) {
            foreach ($polygon as $ring) {
                $coordinates = array_merge($coordinates, $ring);
            }
        }
    }
}

print_r($coordinates);

?>
