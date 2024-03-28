<?php

   $str = file_get_contents('countryBorders.geo.json');
   $decoded_json = json_decode($str, true);

   $features = $decoded_json['features'];

   foreach($features as $feature) {
      foreach($feature as  $key => $value) {
         if (!empty($key)) {
            if ($key == "properties") {
               if ($value['iso_a3'] == "GBR") {
                  foreach($feature as  $key => $value) {
                      if (!empty($key)) {
                          if ($key == "geometry") {
                               echo $value['type'] . "\n";
                               foreach($value['coordinates'] as $key => $value) {
                                     echo "$key" . "\n";
                                     foreach($value[0] as $key => $value) {
                                         echo $value[0] . "|", $value[1] . "\n";
                                     }
                               }
                          }
                      }
                  }
              }
              #echo $value['name'] . "|" . $value['iso_a3'] . "\n";
            }
         }
      }
   }

?>
