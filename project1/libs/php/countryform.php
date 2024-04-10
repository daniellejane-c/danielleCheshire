<?php
$str = file_get_contents('countryBorders.geo.json');
$decoded_json = json_decode($str, true);

$features = $decoded_json['features'];

$selectlist = array();
foreach ($features as $feature) {
    foreach ($feature as $key => $value) {
        if (!empty($key)) {
            if ($key == "properties") {
                // Store both country name and country code in the associative array
                $selectlist[] = array(
                    'name' => $value['name'],
                    'code' => $value['iso_a2'] // Using iso_a2 instead of iso_a3
                );
            }
        }
    }
}

// Sort the selectlist alphabetically based on country name
usort($selectlist, function($a, $b) {
    return strcmp($a['name'], $b['name']);
});

// Generate the HTML for the dropdown menu
foreach ($selectlist as $country) {
    echo "<option value='" . $country['name'] . "' data-code='" . $country['code'] . "'>" . $country['name'] . "</option>\n";
}
?>
