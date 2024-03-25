
var streets = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
);

var satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);
var basemaps = {
  "Streets": streets,
  "Satellite": satellite
};

var map = L.map("map", {
  layers: [streets]
}).setView([54.5, -4], 6);

var layerControl = L.control.layers(basemaps).addTo(map);



//testing map markers
var marker = L.marker([51.5, -0.09]).addTo(map);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

//when map opens, popup shows
var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);

    var popup = L.popup();

//get coordinates where clicked on map
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);

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





//ajax call countryform.php to fill select form

$('.form-select').on("click", function() {

  $.ajax({
      url: "/project1/libs/php/countryform.php",
      type: 'post',

      success: function(result) {
        $(".form-select").append(result);

      },
      error: function (jqXHR, textStatus, errorThrown) {
   console.log(textStatus, errorThrown);
      }
  })

});
