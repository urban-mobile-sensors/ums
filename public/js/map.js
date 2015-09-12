// 'bin/map.js'
//var cdb = require('../../bin/cdb-client.js');

// CartoDB map vizualizations to use as simple samples
// NY apt -> https://crshunter.cartodb.com/api/v2/viz/d8faee2a-4db6-11e5-9192-0e43f3deba5a/viz.json
// Boston O3 and Methane sample: https://crshunter.cartodb.com/api/v2/viz/fca462ac-4dca-11e5-ad02-0e9d821ea90d/viz.json
// Boston Methane (so layer selecter from CartoDB doesn't screw with my legend): https://crshunter.cartodb.com/api/v2/viz/9242caa6-501e-11e5-b64b-0e0c41326911/viz.json

// CartoDB api_key if needed in UMS folder
//easy way to port CartoDB visualization to our site, can use any ...viz.json URLs above
/*
window.onload = function() {
  cartodb.createVis('map', 'https://crshunter.cartodb.com/api/v2/viz/9242caa6-501e-11e5-b64b-0e0c41326911/viz.json');
}
*/

// to grab CartoDB stuff if we want their styling and functionality
/*
*/

// initialize some variables
var map = new L.map('map'),
    startPosition;
/* works but slow, what is result of query named to avoid using CTE's?
*/

// change to function which pulls table stats for binning from cdb-client.js and column from user input
var cartocss = '#summary_tbl{ polygon-fill: #F1EEF6; polygon-opacity: 0.8; line-color: #FFF; line-width: 0.5; line-opacity: 1;}',
cartocss = cartocss + '#summary_tbl [ methane <= 158.47731712611244] { polygon-fill: #91003F; }',
    cartocss = cartocss + '#summary_tbl [ methane <= 135] { polygon-fill: #CE1256; }',
    cartocss = cartocss + '#summary_tbl [ methane <= 120.95519348268839] { polygon-fill: #E7298A; }',
    cartocss = cartocss + '#summary_tbl [ methane <= 112.3529411764706] { polygon-fill: #DF65B0; }',
    cartocss = cartocss + '#summary_tbl [ methane <= 108.42857142857143] { polygon-fill: #C994C7; }',
    cartocss = cartocss + '#summary_tbl [ methane <= 104.09859154929578] { polygon-fill: #D4B9DA; }',
    cartocss = cartocss + '#summary_tbl [ methane <= 98.36206896551724] { polygon-fill: #F1EEF6; }';

var sql_summ = "WITH summary_tbl AS (SELECT avg(n.methane) as methane, count(n.methane) as record_count, h.the_geom_webmercator ",
    sql_summ = sql_summ + "FROM nurve_sample_boston_0828 n JOIN hex_base_v500m h ON ST_Within(n.the_geom, h.the_geom) ",
    sql_summ = sql_summ + "GROUP BY h.the_geom_webmercator) SELECT methane, the_geom_webmercator FROM summary_tbl";

var cbd_layer = {
  user_name: 'crshunter', // Required
  type: 'cartodb', // Required
  sublayers: [{
    sql: sql_summ,
    cartocss: cartocss//, // Required
    //interactivity: "methane, record_count"//, column2, ...", // Optional
  }]
};

function createSummarySQL(avgField){
}

    //sql: "SELECT avg(methane) as methane, the_geom_webmercator FROM boston_sample_hexv500m GROUP BY the_geom_webmercator", // Required
/*
var cbd_torque = {
  type: 'torque', // Required
  order: 1, // Optional
  options: {
    query: "SQL statement", 	// Required if table_name is not given
    table_name: "table_name", 	// Required if query is not given
    user_name: "your_user_name", // Required
    cartocss: "CartoCSS styles" // Required
  }
};*/
/*****************************
  webmap controls >>
*****************************/

$(document).ready(function () {
  /* // get user position
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
  }*/

  map.on('load', function(e){
    // grab OSM basemap for context
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    /* looks like would need to pull existing visualization from their site to get sexy basemap, starting with something like:
    var cbd_viz = cartodb.createVis('map', 'https://crshunter.cartodb.com/api/v2/viz/9242caa6-501e-11e5-b64b-0e0c41326911/viz.json');
    var cbd_darkBase = cbd_viz.getLayers
    */

    // create layer from cartodb layer refernced above, TO DO: include a jquery form to set summary parameters, or is there a better way?
    $('#primary-field').click(function(){
      alert($('#ddlList').val());
      cartodb.createLayer(map, cbd_layer).addTo(map);
    });

  });
  // set to view of Boston
  startPosition = new L.LatLng(42.3601, -71.0589); // Boston, MA
  map.setView(startPosition, 13);
});

/*****************************
  map.js internal functions
*****************************/

// handle geolocation response and initialize map, for future versions
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
  map.setView(startPosition, 13);
}
