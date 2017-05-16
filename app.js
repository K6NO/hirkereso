var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var cors = require('cors');

const cron = require('node-cron');
const feedService = require('./src/feedservice.js');
const feedList = require('./mockdata/mock_feedlist.json');

//TODO check CORS headers
var corsOptions = {
  origin : true,
  methods : 'GET',
  optionsSuccessStatus : 200,
  exposedHeaders : "AMP-Access-Control-Allow-Source-Origin",
};

var index = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// TODO - move cron to separate module
// CRON module refreshes cached feeds every 5 mins
//var task = cron.schedule('*/300 * * * * *', function () {
//  feedList.items.forEach(function (feed) {
//    //console.log('5');
//    //let feed = feedService.getFreshFeed(item.title.toLowerCase());
//    feedService.getFreshFeed(feed.title.toLowerCase()).then(function (feedList) {
//      //console.log(feedList.items);
//    });
//  });
//});
//task.start();

//app.use(cors(corsOptions));
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
