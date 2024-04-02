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
  




  function showBorder() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

    // Use jQuery's $.ajax() to fetch multipolygon coordinates from PHP file
    $.ajax({
      dataType: "json",
      url: "/clone/libs/php/countryBorders.geo.json",
      success: function(data) {
          //an array to hold coordinates for JavaScript
          var coordinatesArray = [];

          // Iterate through features
          $.each(data.features, function(index, feature) {
              // Extract coordinates
              var coordinates = feature.geometry.coordinates;

              // Push coordinates to the array
              coordinatesArray.push(coordinates);

              // Output country name, ISO_A3 code, and coordinates
              console.log("Country: " + feature.properties.name);
              console.log("ISO_A3: " + feature.properties.iso_a3);
              console.log("Coordinates: " + JSON.stringify(coordinates) + "/n");
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
    
