// ---------------------------------------------------------
// GLOBAL DECLARATIONS
// ---------------------------------------------------------

var map;

// tile layers

var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
  }
);

var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);

var basemaps = {
  "Streets": streets,
  "Satellite": satellite
};

// buttons

var infoBtn = L.easyButton("fa-info", function (btn, map) {
  $("#exampleModal").modal("show");
});

var weatherBtn = L.easyButton("fa-info", function (btn, map) {
    $("#exampleModal").modal("show");
  });

var locationBtn = L.easyButton("fa-info", function (btn, map) {
    $("#exampleModal").modal("show");
  });
var weatherBtn = L.easyButton("fa-info", function (btn, map) {
    $("#exampleModal").modal("show");
  });
var weatherBtn = L.easyButton("fa-info", function (btn, map) {
    $("#exampleModal").modal("show");
  });
var weatherBtn = L.easyButton("fa-info", function (btn, map) {
    $("#exampleModal").modal("show");
  });
var weatherBtn = L.easyButton("fa-info", function (btn, map) {
    $("#exampleModal").modal("show");
  });
// ---------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------

// initialise and add controls once DOM is ready



$(document).ready(function () {
  
  map = L.map("map", {
    layers: [streets]
  }).setView([51.505, -0.09], 6);
  
  // setView is not required in your application as you will be
  // deploying map.fitBounds() on the country border polygon

  layerControl = L.control.layers(basemaps).addTo(map);

  infoBtn.addTo(map);
  weatherBtn.addTo(map);
  locationBtn.addTo(map);
populateDropdown();
showBorder();
})

function populateDropdown(){

  $.ajax({
      url: "/clone/libs/php/countryform.php",
      type: 'post',

      success: function(result) {
        $(".form-select").append(result);

      },
      error: function (jqXHR, textStatus, errorThrown) {
   console.log(textStatus, errorThrown);
  
      }
    });
  }

  function getCountryInfo(countryName){
    //make a call to opencage to get country information.
    //create php and then ajax call.
  }

  $(document).ready(function() {
    // Attach change event handler to the select element
    $('#countrySelect').change(function() {
      // Get the selected value
      var selectedCountry = $(this).val();
      console.log(selectedCountry);
     getCountryInfo(selectedCountry);
      // You can perform additional actions here based on the selected value
    });
  });
  



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

function showBorder() {
    // Use jQuery's $.ajax() to fetch multipolygon coordinates from PHP file
    $.ajax({
        dataType: "json",
        url: "/clone/libs/php/countryBorders.geo.json",
        success: function(data) {
            //an array to hold coordinates for JavaScript
            var coordinatesArray = [];

            // Iterate through features
            $.each(data.features, function(index, feature) {
                  var coordinates = feature.geometry.coordinates;
  
                  // Flip the coordinates
                  coordinates = flipCoordinates(coordinates);
  
                  // Push coordinates to the array
                  coordinatesArray.push(coordinates);

                // Output country name, ISO_A3 code, and coordinates
                console.log("Country: " + feature.properties.name);
                console.log("ISO_A3: " + feature.properties.iso_a3);
                console.log("Coordinates: " + JSON.stringify(coordinates) + "\n");
            });

            // Iterate through coordinates array and draw polygons
            $.each(coordinatesArray, function(index, coordinates) {
                var polygon = L.polygon(coordinates, {color: 'blue'}).addTo(map);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error fetching GeoJSON data:", error);
        }
    });
};
