'use strict';
const express = require('express'),
      path = require('path'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      compression = require('compression'),
      sitemap = require('express-sitemap');

const app = express();

sitemap({
  map: {
    '/': ['get'],
    '/belfold': ['get'],
    '/kulfold': ['get'],
    '/sport': ['get'],
    '/bulvar': ['get'],
    '/tech': ['get']
  },
  http: "https",
  url: "hirekegyben.hu",
  sitemapSubmission : "sitemap"
}).XMLtoFile();

const index = require(path.join(__dirname, 'routes', 'index.js'));

const feedService = require(path.join(__dirname, 'src', 'feedservice.js'));

// remove X-Powered-By header 
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static server
app.use(express.static(path.join(__dirname, 'public')));

// robots.txt
app.use(function (req, res, next) {
  if ('/robots.txt' == req.url) {
    res.type('text/plain')
    res.send("User-agent: *\nAllow: /");
  } else {
    next();
  }
});

// launch cron task
feedService.startPeriodicRefreshOfFeeds();

//GZIP compression
app.use(compression({level: 1}));

//router
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
