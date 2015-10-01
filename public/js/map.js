// 'bin/map.js'
//var cdb = require('../../bin/cdb-client.js'); // cannot be added this way, need to pass through an HTTP request via routes.js

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

// set mapbox token for pretty base maps and some mapbox functions maybe
// eg, sample for animated map: https://www.mapbox.com/mapbox.js/example/v1.0.0/dynamically-drawing-a-line/
L.mapbox.accessToken = 'pk.eyJ1IjoiY3JzaHVudGVyIiwiYSI6IjRrVmptLU0ifQ.hZUdCnosSZMYUnEYMw1xIQ';

// sample sql in browser to get bins dynamically
/*
var sql = cartodb.SQL({ user: 'andrew' });
sql.execute("SELECT date_part('Month', t.date) as month, count(*) total, sum(damage) damage
FROM tornados t GROUP BY date_part('Month', t.date) ORDER BY date_part('Month', t.date) ASC").done(function(data) {

*/

// initialize some variables
var map = new L.map('map'),
    startPosition,
    summary_tbl = 'ums_roadtest0917_minuteaverages',
    raw_tbl = 'ums_roadtest_0917',
    cbd_sql = cartodb.SQL({ user: 'crshunter' });

// change to function which pulls table stats for binning from cdb-client.js and column from user input
/*
var cartocss = '#summary_tbl{ polygon-fill: #F1EEF6; polygon-opacity: 0.8; line-color: #FFF; line-width: 0.5; line-opacity: 1;}', cartocss = cartocss + '#summary_tbl [ methane <= 158.47731712611244] { polygon-fill: #91003F; }',
    cartocss = cartocss + '#summary_tbl [ methane <= 135] { polygon-fill: #CE1256; }', cartocss = cartocss + '#summary_tbl [ methane <= 120.95519348268839] { polygon-fill: #E7298A; }',
    cartocss = cartocss + '#summary_tbl [ methane <= 112.3529411764706] { polygon-fill: #DF65B0; }', cartocss = cartocss + '#summary_tbl [ methane <= 108.42857142857143] { polygon-fill: #C994C7; }',
    cartocss = cartocss + '#summary_tbl [ methane <= 104.09859154929578] { polygon-fill: #D4B9DA; }', cartocss = cartocss + '#summary_tbl [ methane <= 98.36206896551724] { polygon-fill: #F1EEF6; }';
*/

// still need to update this to pull from a back end updates, for now just manually updating on CartoDB account
var sql_summ = 'SELECT * FROM ' + summary_tbl,
    sql_raw = 'SELECT * FROM ' + raw_tbl;

/*var sql_summ = "WITH summary_tbl AS (SELECT avg(n.methane) as methane, count(n.methane) as record_count, h.the_geom_webmercator ",
    sql_summ = sql_summ + "FROM nurve_sample_boston_0828 n JOIN hex_base_v500m h ON ST_Within(n.the_geom, h.the_geom) ",
    sql_summ = sql_summ + "GROUP BY h.the_geom_webmercator) SELECT methane, the_geom_webmercator FROM summary_tbl";*/

var cdb_layer = {
  user_name: 'crshunter', // Required
  type: 'cartodb', // Required
  sublayers: [{
    sql: sql_summ,
    cartocss: makeCartoCSS(summary_tbl)//, // Required
    //interactivity: "methane, record_count"//, column2, ...", // Optional
  }/*,{
    sql: sql_raw,
    cartocss: makeCartoCSS(raw_tbl)
  }*/]
};

var LayerActions = {
  summary: function(){
    sublayers[0].show();
    sublayers[1].hide();
    return true;
  },
  raw: function(){
    sublayers[1].show();
    sublayers[0].hide();
    return true;
  }
}


function createSummarySQL(avgField){
}

// update to pull user selected bucket definition from backend, will also need to
// a) add user selected field for visual
// b) autogenerate color gradient and
// c) dynamically select shape type: polygon or point (+line?)
// jenks bins for summary tbl: 27.53,28.8,29.38,30.25,31.07,32.03,33.5
// jenks bins for raw tble: 28.52,29.79,30.26,30.64,31.02,32.07,34.14
function makeCartoCSS(tbl_name){
  // something like this line should be able to dynamically grab bins from client, but better from backend?
  //var bins = cbd_sql.query("SELECT CDB_JenksBins(array_agg(round(amb_temp::numeric, 2)), 7) FROM ums_roadtest0917_minuteaverages");
  if (tbl_name == summary_tbl) {
    var tmp_css = '#' + tbl_name + '{ polygon-fill: #F1EEF6; polygon-opacity: 0.8; line-color: #FFF; line-width: 0.5; line-opacity: 1;}',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 33.5] { polygon-fill: #91003F; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 32.03] { polygon-fill: #CE1256; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 31.07] { polygon-fill: #E7298A; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 30.25] { polygon-fill: #DF65B0; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 29.38] { polygon-fill: #C994C7; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 28.8] { polygon-fill: #D4B9DA; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 27.53] { polygon-fill: #F1EEF6; }';
  } else if (tbl_name == raw_tbl){
    var tmp_css = '#' + tbl_name + '{   marker-fill-opacity: 0.8; marker-line-color: #FFF; marker-line-width: 0.5; marker-line-opacity: 0.5; marker-width: 10; marker-fill: #FFFFB2; marker-allow-overlap: true;}',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 34.14] { marker-fill: #91003F; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 32.03] { marker-fill: #CE1256; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 31.07] { marker-fill: #E7298A; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 30.25] { marker-fill: #DF65B0; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 29.38] { marker-fill: #C994C7; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 28.8] { marker-fill: #D4B9DA; }',
      tmp_css = tmp_css + '#' + tbl_name + ' [ amb_temp <= 27.53] { marker-fill: #F1EEF6; }';
  } else {
    var tmp_css = '#null{ marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 10; marker-fill: #FF6600; marker-allow-overlap: true;}';
  }
  return tmp_css;
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
    /*L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    */
    var mapboxDark = L.mapbox.tileLayer('mapbox.dark');
    mapboxDark.addTo(map);
    console.log('mapboxDark layer added');
    /* looks like would need to pull existing visualization from their site to get sexy basemap, starting with something like:
    var cbd_viz = cartodb.createVis('map', 'https://crshunter.cartodb.com/api/v2/viz/9242caa6-501e-11e5-b64b-0e0c41326911/viz.json');
    var cbd_darkBase = cbd_viz.getLayers
    */

    console.log('cbd_layer object is ', JSON.stringify(cdb_layer));

    var cdb_layers = cartodb.createLayer(map, cdb_layer); // maybe not working b/c need to start with CartoDB viz.json?
    console.log('cbd_layers object is ', JSON.stringify(cdb_layers));
    cdb_layers.addTo(map);
    cdb_layers.createSubLayer({
      sql: sql_raw,
      cartocss: makeCartoCSS(raw_tbl)
    });
    console.log('cbd_layers added, has ', cdb_layers.getSubLayerCount() ,' sublayers');

    //cbd_layers.sublayers[0].show(); // by default show summary table
    //cbd_layers.sublayers[1].hide();

    // button only creates layer from cartodb definition refernced above, TO DO: put updates / processing in back end, ths button may go away / be repurposed
    $('#primary-field').click(function(){
      alert($('#ddlList').val());
    });

  });
  // set to view of Boston
  startPosition = new L.LatLng(42.3601, -71.0589); // Boston, MA
  map.setView(startPosition, 13);

  $('.button').click(function() {
    // pulled from CartoDB tutorial: http://docs.cartodb.com/tutorials/toggle_map_view.html
    $('.button').removeClass('selected');
    $(this).addClass('selected');
    LayerActions[$(this).attr('id')]();
  });
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
