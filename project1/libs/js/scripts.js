// GLOBAL DECLARATIONS

var map;
var layerControl;
var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
});
var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
});
var basemaps = {
    "Streets": streets,
    "Satellite": satellite
};

// EVENT HANDLERS

$(document).ready(function () {
    map = L.map("map", {
        layers: [streets]
    }).setView([51.505, -0.09], 6);

    layerControl = L.control.layers(basemaps).addTo(map);
    
    L.easyButton(" fa fa-info", function (btn, map) {
      $("#countryModal").modal("show");
  }).addTo(map);

  L.easyButton("fa fa-cloud", function (btn, map) {
      $("#weatherModal").modal("show");
  }).addTo(map);

  L.easyButton("fa fa-book", function (btn, map) {
      $("#wikiModal").modal("show");
  }).addTo(map);

  L.easyButton("fa fa-newspaper", function (btn, map) {
      $("#newsModal").modal("show");
  }).addTo(map);

  L.easyButton("fa fa-map-marker", function (btn, map) {
      $("#geolocationModal").modal("show");
  }).addTo(map);

    populateDropdown();

    //geolocation


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

$('#countrySelect').change(function () {
  var selectedCountry = $(this).val();
  getCountryInfo(selectedCountry);

  function showBorder() {
      // Clear existing polygons from the map
      map.eachLayer(function (layer) {
          if (layer instanceof L.Polygon) {
              map.removeLayer(layer);
          }
      });

      // Use jQuery's $.ajax() to fetch multipolygon coordinates from PHP file
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
// FUNCTIONS

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
//change to php rather than api
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

function updateMapView(coordinates, countryName) {
    map.setView(coordinates, 5);
    L.marker(coordinates).addTo(map).bindPopup(countryName);
}

function flipCoordinates(coordinates) {
  // Iterate through each coordinate pair
  for (var i = 0; i < coordinates.length; i++) {
    // If it's a single coordinate pair
    if (Array.isArray(coordinates[i]) && typeof coordinates[i][0] === 'number' && typeof coordinates[i][1] === 'number') {
      // Swap latitude and longitude
      var temp = coordinates[i][0];
      coordinates[i][0] = coordinates[i][1];
      coordinates[i][1] = temp;
    } else {
      // If it's an array of coordinates, recursively call flipCoordinates
      coordinates[i] = flipCoordinates(coordinates[i]);
    }
  }
  return coordinates;
};

