var express = require('express');
var router = express.Router();

var feedService = require('../src/feedservice.js');

var cors = require('cors');
var corsOptions = {
  origin : true,
  methods : 'GET, OPTIONS, POST',
  optionsSuccessStatus : 200,
  allowedHeaders : "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token",
  exposedHeaders : "AMP-Access-Control-Allow-Source-Origin"
};

/* GET home page. */
router.get('/', function(req, res, next) {
  let feedList = feedService.getFeedList();
  //console.log(feedList);
  res.render('index', {
    feedlist1 : feedList.col1,
    feedlist2 : feedList.col2,
    feedlist3 : feedList.col3
  });
});

/* GET categories. */
router.get('/:category', function(req, res, next) {
  let feedList = feedService.getFeedList(req.params.category);
  console.log(feedList);
    if(Object.getOwnPropertyNames(feedList).length == 0) {
      res.redirect('/');
      console.log('No such category exists.')
    } else {
      res.render('index', {
        feedlist1 : feedList.col1,
        feedlist2 : feedList.col2,
        feedlist3 : feedList.col3
      });
    }
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
  });
});

module.exports = router;

// CORS
/* CORS endpoints receive requesting origin via "Origin" HTTP header. This header has to be restricted to only allow the following origins:

 *.ampproject.org
 *.amp.cloudflare.com
 The Publisher’s own origins
 */