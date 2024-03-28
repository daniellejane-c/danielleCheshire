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
  }).setView([54.5, -4], 6);
  
  // setView is not required in your application as you will be
  // deploying map.fitBounds() on the country border polygon

  layerControl = L.control.layers(basemaps).addTo(map);

  infoBtn.addTo(map);
  weatherBtn.addTo(map);
  locationBtn.addTo(map);
populateDropdown();
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
  