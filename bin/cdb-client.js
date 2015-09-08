var CartoDB = require('cartodb')
var secret = require('../../secret.js');

var client = new CartoDB({user: secret.USER, api_key: secret.API_KEY});

var base_data = {};
/*
client.on('connect', function() {
  console.log("connected");
  var sql =  "SELECT h.cartodb_id hex500_id,  extract(hour from dt_captured) hr, extract(month from dt_captured) mon, extract(day from dt_captured) daynum, extract(dow from dt_captured) dayofweek, extract(year from dt_captured) yr, altitude, co, impact_accel, light, lpg, methane, o3, sound, temperature FROM nurve_sample_boston_0828 n JOIN hex_base_v500m h ON ST_Within(n.the_geom, h.the_geom)"
/*
  // template can be used
  client.query("select * from {table} limit 5", {table: 'tracker'}, function(err, data){
    // JSON parsed data or error messages are returned
  })

  client.query(sql, function(err, data){
    // JSON parsed data or error messages are returned
    if (err){
      console.log('error in sql query: ', err);
    } else {
      base_data = data;
    }
  })
  // chained calls are allowed
  //.query("select * from tracker limit 5 offset 5", function(err, data){});
});*/

function getBaseData(){
  client.connect();
  console.log("connected in getBaseData");
  var sql =  "SELECT h.cartodb_id hex500_id,  extract(hour from dt_captured) hr, extract(month from dt_captured) mon, extract(day from dt_captured) daynum, extract(dow from dt_captured) dayofweek, extract(year from dt_captured) yr, altitude, co, impact_accel, light, lpg, methane, o3, sound, temperature FROM nurve_sample_boston_0828 n JOIN hex_base_v500m h ON ST_Within(n.the_geom, h.the_geom)"
  client.query(sql, function(err, data){
    // JSON parsed data or error messages are returned
    if (err){
      console.log('error in sql query: ', err);
      //return(err);
    } else {
      base_data = data;
      console.log('base_data set'); // tentatively worked! slow with apt internet...
      //return(base_data);
    }
  });
}

function setSummary(){
  client.connect();
  console.log("connected in setSummary");
  // check if summary_tbl already exists in database
  var sqlTest = "SELECT EXISTS (SELECT 1 FROM pg_catalog.pg_class c WHERE c.relname = 'summary_tbl');",
      tblExists = false;
  client.query(sqlTest, function(err, data){
    if(err){
      console.log('error in tblTest query:', err);
    } else{
      if(data){
        tblExists = true;
        //client.query('DROP TABLE tmp_summary;');
      }
    }
  });
  // create new table or replace existing if already exists
  var sql = '';
  if(tblExists){
    // replace previous table with new one
  }else{
    // create summary table
  }
  client.query()
}

// client is a Stream object instance so you can pipe responses as new line delimited JSON, for example, to a file
/*
var output = require('fs').createWriteStream(__dirname + '/responses.log');
client.pipe(output);
*/

//client.connect();

/* query used to create hourly summary data
SELECT h.cartodb_id hex500_id, n.yr, n.mon, n.daynum, n.dayweek, n.hr, min(n.altitude) min_altitude, avg(n.altitude) avg_altitude, max(n.altitude) max_altitude, min(n.co) min_co, avg(n.co) avg_co, max(n.co) max_co, min(n.impact_accel) min_accel, avg(n.impact_accel) avg_accel, max(n.impact_accel), min(n.light) min_light, avg(n.light) avg_light, max(n.light) max_light, min(n.lpg) min_lpg, avg(n.lpg) avg_lpg, max(n.lpg) max_lpg, min(n.methane) min_methane, avg(n.methane) avg_methane, max(n.methane) max_methane, min(n.o3) min_o3, avg(n.o3) avg_o3, max(n.o3) max_o3, min(n.sound) min_sound, avg(n.sound) avg_sound, max(n.sound) max_sound, min(n.temperature) min_temperature, avg(n.temperature) avg_temperature, max(n.temperature) max_temperature FROM hex_base_v500m h LEFT JOIN (SELECT *, extract(hour from dt_captured) hr, extract(month from dt_captured) mon, extract(day from dt_captured) daynum, extract(dow from dt_captured) dayweek, extract(year from dt_captured) yr FROM nurve_sample_boston_0828) n ON ST_Within(n.the_geom, h.the_geom) GROUP BY h.cartodb_id, n.mon, n.dayweek, n.daynum, n.hr, n.yr
*///nurve_hourly_hexagon_summary

module.exports = {
  GetBaseData: getBaseData,
  baseData: base_data
}