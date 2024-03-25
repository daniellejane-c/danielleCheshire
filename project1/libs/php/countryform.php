
<?php

   $str = file_get_contents('countryBorders.geo.json');
   $decoded_json = json_decode($str, true);

   $features = $decoded_json['features'];

   $selectlist=array();
   foreach($features as $feature) {
      foreach($feature as  $key => $value) {
         if (!empty($key)) {
            if ($key == "properties") {
              #echo $value['name'] . "|" . $value['iso_a3'] . "\n";
	      array_push($selectlist,$value['name']);
            }
         }
      }
     }

     foreach( $selectlist as $country ) {
        echo "<option value='" . $country . "'>" . $country . "</option>\n";
      }

?>
