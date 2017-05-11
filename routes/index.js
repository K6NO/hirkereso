var express = require('express');
var router = express.Router();

var feedService = require('../src/feedservice.js');

var cors = require('cors');
var corsOptions = {
  origin : true,
  methods : 'GET, OPTIONS, POST',
  optionsSuccessStatus : 200,
  allowedHeaders : "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token",
  exposedHeaders : "AMP-Access-Control-Allow-Source-Origin",
};

/* GET home page. */
router.get('/', function(req, res, next) {
  var feedList = feedService.getFeedList();
  res.render('index', {
    feedlist : feedList
  });
});

/* GET categories. */
router.get('/:category', function(req, res, next) {
  console.log(req.params.category);
  res.render('index', {
    feedlist : feedList
  });
});

/* API . */
/*TODO set up cors !
* */
router.get('/v0/api/feeds/:feedname', cors(corsOptions), function(req, res, next) {
  if(req.headers['amp-same-origin']){
    var feed = feedService.getCachedFeed(req.params.feedname.toLowerCase());
    res.json(feed);
  }
});

router.get('/freshfeed/:feedname', function(req, res, next) {
  feedService.getFreshFeed(req.params.feedname)
      .then(function (feed) {
        res.json(feed);
      }).catch(function (err) {
    console.log('Error when resolving feed promise in router ' + err);
  });;
});

module.exports = router;

// CORS
/* CORS endpoints receive requesting origin via "Origin" HTTP header. This header has to be restricted to only allow the following origins:

 *.ampproject.org
 *.amp.cloudflare.com
 The Publisher’s own origins
 */