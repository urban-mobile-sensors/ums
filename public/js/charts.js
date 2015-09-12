//js/charts.js, following Andrew Hill's example here http://bl.ocks.org/andrewxhill/9134155

//qry to get buckets for variables
var qryJenks = 'SELECT CDB_JenksBins(array_agg(temperature::numeric), 10) FROM nurve_sample_boston_0828',
var qryDecile = 'SELECT CDB_QuantileBins(array_agg(temperature::numeric), 10) FROM nurve_sample_boston_0828',


var sql = cartodb.SQL({ user: 'crshunter' });

/*
  VERY WIP - still need to update all the below to get
    a) summary chart of key metrics (freq bars?) and
    b) more detailed line graphs a la Andrew's example below
*/


sql.execute(qryJenks)

sql.execute("SELECT date_part('Month', t.date) as month, count(*) total, sum(damage)  damage FROM tornados t GROUP BY date_part('Month', t.date) ORDER BY date_part('Month', t.date) ASC")
.done(function(data) {
  console.log(data)
  var total = [];
  var damage = [];
  for (i in data.rows){
    total.push(data.rows[i].total)
    damage.push(data.rows[i].damage)
  }
  console.log(data)
  var lineChartData = {
    labels : ["January","February","March","April","May","June","July", "August", "September", "October", "November", "December"],
    datasets : [
      {
        fillColor : "rgba(220,220,120,0.5)",
        strokeColor : "rgba(220,220,120,1)",
        pointColor : "rgba(220,220,120,1)",
        pointStrokeColor : "#fff",
        data : damage
      },
      {
        fillColor : "rgba(151,187,205,0.5)",
        strokeColor : "rgba(151,187,205,1)",
        pointColor : "rgba(151,187,205,1)",
        pointStrokeColor : "#fff",
        data : total
      }
    ]

  }

  var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Line(lineChartData);
})