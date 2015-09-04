// "/app.js"
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

/* set up memwatch */
var memwatch = require('memwatch-next'),
    filename = "./page_testing/memwatch_stats.txt",
    firstLine = true,
    leakFile = "./page_testing/memwatch_stats.txt";
memwatch.on('leak', function(info) {
  var fs = require("fs");
  fs.appendFile(leakFile, JSON.stringify(info) + "\n");
  //console.log('leak is', JSON.stringify(info, null, 2));
});

memwatch.on('stats', function(stats) {
/***
example from:
http://www.willvillanueva.com/the-node-js-profiling-guide-that-hasnt-existed-finding-a-potential-memory-leak-using-memwatch-part-2/
***/
  var fs = require("fs"),
        info = [];

    if(firstLine) {
        info.push("num_full_gc");
        info.push("num_inc_gc");
        info.push("heap_compactions");
        info.push("usage_trend");
        info.push("estimated_base");
        info.push("current_base");
        info.push("min");
        info.push("max");
        fs.appendFileSync(filename, info.join(",") + "\n");
        info = [];
        firstLine = false;
    }
    info.push(stats["num_full_gc"]);
    info.push(stats["num_inc_gc"]);
    info.push(stats["heap_compactions"]);
    info.push(stats["usage_trend"]);
    info.push(stats["estimated_base"]);
    info.push(stats["current_base"]);
    info.push(stats["min"]);
    info.push(stats["max"]);

    fs.appendFile(filename, info.join(",") + "\n");
});
/* END memwatch*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
