// 'bin/map.js'
//console.log('map.js called');

// set CartoDB token

// initialize map and some variables
/*var map = L.mapbox.map('map'),
    startPosition,
    mapboxDark = L.mapbox.tileLayer('mapbox.dark');
*/
// CartoDB map
// NY apt -> https://crshunter.cartodb.com/api/v2/viz/d8faee2a-4db6-11e5-9192-0e43f3deba5a/viz.json
// Boston O3 and Methane sample: https://crshunter.cartodb.com/api/v2/viz/fca462ac-4dca-11e5-ad02-0e9d821ea90d/viz.json
// Boston Methane (so layer selecter from CartoDB doesn't screw with my legend): https://crshunter.cartodb.com/api/v2/viz/9242caa6-501e-11e5-b64b-0e0c41326911/viz.json

/*****************************
  webmap controls >>
*****************************/
window.onload = function() {
  cartodb.createVis('map', 'https://crshunter.cartodb.com/api/v2/viz/9242caa6-501e-11e5-b64b-0e0c41326911/viz.json');
}
/*
$(document).ready(function () {
  if (navigator.geolocation) {
    var timeoutVal = 10 * 1000 * 1000;
    //console.log('about to getCurrentPosition...');
    navigator.geolocation.getCurrentPosition(
      //displayPosition,
      setPosition, displayError,
      { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
    );
  }
  else {
    alert("Geolocation is not supported by this browser");
  }
  map.on('load', function(e){
    map.addLayer(mapboxDark);
    //map.addLayer(heatmapLayer);
    addToSelector(mapboxDark, 'Base layer', 1);
    //addLayer(heatmapLayer, 'heatmap', 2); // adds to selection list

});

/*****************************
  map.js internal functions
*****************************/

// handle geolocation response and initialize map
function setPosition(pos) {
  startPosition = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
  //console.log('success, startPosition is ', startPosition);
  map.setView(startPosition, 15);
}
function displayError(error) {
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
  startPosition = new L.LatLng(42.3601, -71.0589); // Boston, MA
  map.setView(startPosition, 12);
}
