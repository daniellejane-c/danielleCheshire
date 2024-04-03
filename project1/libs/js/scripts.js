// GLOBAL DECLARATIONS

var map;
var layerControl;
var countryMarker;
var proximityRadius = 2;

//create map layers
var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
});
var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
});


var basemaps = {
    "Streets": streets,
    "Satellite": satellite,
};
//on ready function
$(document).ready(function () {
    map = L.map("map", {
        layers: [streets]
    }).setView([51.505, -0.09], 6);

    layerControl = L.control.layers(basemaps).addTo(map);
    //additionalmarkers set to false for each button call

    // var additionalMarkersShown = {
    //     info: {},
    //     cloud: {},
    //     book: {},
    //     newspaper: {},
    //     marker: {}
    // };
      
//buttons - each declare whether there is additional markers shown the selected country. if not, onclick puts them on the map
    L.easyButton(" fa fa-info", function (btn, map) {
      $("#countryModal").modal("show");
    // if (!additionalMarkersShown.info[countryMarker.getLatLng()]) {
    //     showAdditionalMarkers();
    //     additionalMarkersShown.info[countryMarker.getLatLng()] = true; 
    //}
  }).addTo(map);

  L.easyButton("fa fa-cloud", function (btn, map) {
      $("#weatherModal").modal("show");
    // if (!additionalMarkersShown.cloud[countryMarker.getLatLng()]) {
    //     showAdditionalMarkers('green');
    //     additionalMarkersShown.cloud[countryMarker.getLatLng()] = true; 
    // }
    
  }).addTo(map);

  L.easyButton("fa fa-book", function (btn, map) {
      $("#wikiModal").modal("show");
    // if (!additionalMarkersShown.book[countryMarker.getLatLng()]) {
    //     showAdditionalMarkers('purple');
    //     additionalMarkersShown.book[countryMarker.getLatLng()] = true; 
    // }
    
  }).addTo(map);

  L.easyButton("fa fa-newspaper", function (btn, map) {
      $("#newsModal").modal("show");
    // if (!additionalMarkersShown.newspaper[countryMarker.getLatLng()]) {
    //     showAdditionalMarkers('orange');
    //     additionalMarkersShown.newspaper[countryMarker.getLatLng()] = true; 
    // }
    
  }).addTo(map);

  L.easyButton("fa fa-map-marker", function (btn, map) {
      $("#geolocationModal").modal("show");
    // if (!additionalMarkersShown.marker[countryMarker.getLatLng()]) {
    //     showAdditionalMarkers('pink');
    //     additionalMarkersShown.marker[countryMarker.getLatLng()] = true; 
    // }
    
  }).addTo(map);

    populateDropdown();

    //geolocation

//geolocation - on load
map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng).addTo(map)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
  alert(e.message);
}

map.on('locationerror', onLocationError);
});

//when selecting country.
$('#countrySelect').change(function () {
  var selectedCountry = $(this).val();
  getCountryInfo(selectedCountry);
//creates polygon from geojson file and plots it on the map in blue.  
  function showBorder() {
      // Clear existing polygons from the map
      map.eachLayer(function (layer) {
          if (layer instanceof L.Polygon) {
              map.removeLayer(layer);
          }
      });



      // fetch multipolygon coordinates from PHP file
      $.ajax({
          dataType: "json",
          url: "/clone/libs/php/countryBorders.geo.json",
          success: function (data) {
              // Iterate through features to find the selected country
              var selectedFeature = data.features.find(function (feature) {
                  return feature.properties.name === selectedCountry || feature.properties.name === selectedCountry;
              });

              if (!selectedFeature) {
                  console.error("Selected country not found.");
                  return;
              }

              var coordinates = selectedFeature.geometry.coordinates;

              // Flip the coordinates
              coordinates = flipCoordinates(coordinates);

              // Output country name, ISO_A3 code, and coordinates
              // console.log("Country: " + selectedFeature.properties.name);
              // console.log("ISO_A3: " + selectedFeature.properties.iso_a3);
              // console.log("Coordinates: " + JSON.stringify(coordinates) + "\n");

              // Draw the polygon for the selected country
              var polygon = L.polygon(coordinates, { color: 'blue' }).addTo(map);
          },
          error: function (xhr, status, error) {
              console.error("Error fetching GeoJSON data:", error);
          }
      });
  }

  showBorder();

});
//populate the select/dropdown list

function populateDropdown() {
    $.ajax({
        url: "/clone/libs/php/countryform.php",
        type: 'post',
        success: function (result) {
            $(".form-select").append(result);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}
//may need to change to php rather than api
function getCountryInfo(countryName) {
    $.ajax({
        url: "https://api.opencagedata.com/geocode/v1/json",
        data: {
            key: "48a78b864d4b4e85a485b585c3d6fdb0",
            q: countryName
        },
        success: function (response) {
            if (response.results.length > 0) {
                var coordinates = [response.results[0].geometry.lat, response.results[0].geometry.lng];
                updateMapView(coordinates, countryName);
            } else {
                console.error("No results found for the country: " + countryName);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error fetching country information:", textStatus, errorThrown);
        }
    });
}
//update the maps view based on selected country
function updateMapView(coordinates, countryName) {
    map.setView(coordinates, 6);
    if (countryMarker) {
        map.removeLayer(countryMarker);
    }
    countryMarker = L.marker(coordinates).addTo(map).bindPopup(countryName);


}
// //generate colored markers
// function coloredIcon(color) {
//     return L.ExtraMarkers.icon({
//         icon: 'fa-number',
//         number: '',
//         shape: 'circle',
//         markerColor: color,
//         prefix: 'fa'
//     });
// }
// //function to allow for random placement of 3 markers.
//      function showAdditionalMarkers(markerColor) {
//         if (countryMarker) {
//             var countryLatLng = countryMarker.getLatLng();

//             // Generate additional markers within the proximity radius
//             for (var i = 0; i < 3; i++) {
//                 var randomLat = countryLatLng.lat + (Math.random() - 0.5) * proximityRadius;
//                 var randomLng = countryLatLng.lng + (Math.random() - 0.5) * proximityRadius;
//                 L.marker([randomLat, randomLng], { icon: coloredIcon(markerColor) }).addTo(map);
//             }
//         } else {
//             alert('Please select a country first.');
//         }
//     }
    
//flip coordinates for correct alignment
function flipCoordinates(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    //single coordinate pair
    if (Array.isArray(coordinates[i]) && typeof coordinates[i][0] === 'number' && typeof coordinates[i][1] === 'number') {
      // Swap latitude and longitude
      var temp = coordinates[i][0];
      coordinates[i][0] = coordinates[i][1];
      coordinates[i][1] = temp;
    } else {
      //array of coordinates, recursively call flipCoordinates
      coordinates[i] = flipCoordinates(coordinates[i]);
    }
  }
  return coordinates;
};

