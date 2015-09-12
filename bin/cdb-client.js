var CartoDB = require('cartodb')
var secret = require('../../secret.js');

var client = new CartoDB({user: secret.USER, api_key: secret.API_KEY});

var base_data = {},
    ;
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

// should pull both a) stats summary of table and b) formatted data for graphing purposes
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
      console.log('base_data set'); // tentatively worked! slow with apartment internet...
      //return(base_data);
    }
  });
}

// even need to create new view programmatically?
function setSummary(){
  client.connect();
  console.log("connected in setSummary");
  // check if summary_tbl already exists in database
  var sqlCheck = "SELECT EXISTS (SELECT 1 FROM pg_catalog.pg_class c WHERE c.relname = 'summary_tbl' AND c.reltype <> 0);";//,
      //tblExists = false;
  var sql = '';
  client.query(sqlCheck, function(err, data){
    if(err){
      console.log('error in tblTest query:', err);
    } else{
      console.log('summary_tbl data is: ', JSON.stringify(data)); // check response
      if(data.rows.exists){
        // replace previous table with new one
        console.log('tblExists is true');
        client.query('DROP VIEW summary_tbl;', function(err, data){
          console.log('after DROP view, data is: ', data);
        });
        console.log('summary_tbl dropped...');
      }else{
        // create summary table
        console.log('summary_tbl does not exist, creating it...');

      }
      //client.query()
      //}
    }
  })
  .query(sql, function(err, data){
  })
}

/* sample decile stat query
SELECT decile, count(altitude) records, min(altitude) min_alt, avg(altitude) avg_alt, max(altitude) max_alt
FROM (SELECT altitude, ntile(10) over (ORDER BY altitude) as decile
  FROM nurve_sample_boston_0828) q
GROUP BY decile ORDER BY decile

w/2 variables
SELECT q1.decile, records_alt, records_co, min_alt, min_co, avg_alt, avg_co, max_alt, max_co FROM (
SELECT decile, count(altitude) records_alt, min(altitude) min_alt, avg(altitude) avg_alt, max(altitude) max_alt
  FROM (SELECT altitude, ntile(10) over (ORDER BY altitude) as decile
        FROM nurve_sample_boston_0828) q GROUP BY decile ORDER BY decile) q1
JOIN (SELECT decile, count(co) records_co, min(co) min_co, avg(co) avg_co, max(co) max_co
      FROM (SELECT co, ntile(10) over (ORDER BY co) as decile FROM nurve_sample_boston_0828 WHerE co < 9999) q GROUP BY decile ORDER BY decile) q2
ON q1.decile = q2.decile
*/

// client is a Stream object instance so you can pipe responses as new line delimited JSON, for example, to a file
/*
var output = require('fs').createWriteStream(__dirname + '/responses.log');
client.pipe(output);
*/

//client.connect();


module.exports = {
  GetBaseData: getBaseData,
  SetSummary: setSummary,
  baseData: base_data
}
