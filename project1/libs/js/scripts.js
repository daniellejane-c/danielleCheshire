
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

L.easyButton("fa-info", function (btn, map) {
  $("#exampleModal").modal("show");
}).addTo(map);




var map = L.map('map').setView([54.5, -4], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

}).addTo(map);
/* add geolocaton for device.
function onAccuratePositionProgress (e) {
    console.log(e.accuracy);
    console.log(e.latlng);
}

function onAccuratePositionFound (e) {
    console.log(e.accuracy);
    console.log(e.latlng);
}

function onAccuratePositionError (e) {
    console.log(e.message)
}

map.on('accuratepositionprogress', onAccuratePositionProgress);
map.on('accuratepositionfound', onAccuratePositionFound);
map.on('accuratepositionerror', onAccuratePositionError);

map.findAccuratePosition({
    maxWait: 15000, // defaults to 10000
    desiredAccuracy: 30 // defaults to 20
});*/