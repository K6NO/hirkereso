var express = require('express');
var router = express.Router();
var path = require('path');

var feedService = require(path.join(__dirname, '..', 'src', 'feedservice.js'));

var cors = require('cors');
var corsOptions = {
  origin : true,
  methods : 'GET, OPTIONS, POST',
  optionsSuccessStatus : 200,
  allowedHeaders : "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token",
  exposedHeaders : "AMP-Access-Control-Allow-Source-Origin"
};

/**
 * GET home page.
 */
router.get('/', function(req, res) {
  let publisherList = feedService.getPublisherList();
  console.log(publisherList.col1);
  res.render('index', {
    publisherList1 : publisherList.col1,
    publisherList2 : publisherList.col2,
    publisherList3 : publisherList.col3,
    category: undefined
  });
});

/**
 * GET category page
 */
router.get('/:category', function(req, res) {
  let publisherList = feedService.getPublisherList(req.params.category);

  if(isEmpty(publisherList.col1)) {
      res.redirect('/');
      console.log('No such category.')
  } else {
    res.render('index', {
      publisherList1 : publisherList.col1,
      publisherList2 : publisherList.col2,
      publisherList3 : publisherList.col3,
      category: req.params.category
    });
  }
});

/**
 * API
 */
// TODO set up CORS !
router.get('/v0/api/feeds/:feedname', cors(corsOptions), function(req, res, next) {
  if(req.headers['amp-same-origin']){
    var feed = feedService.getCachedFeed(req.params.feedname.toLowerCase());
    res.setHeader("Cache-Control", "public, max-age=2592000");
    res.json(feed);
  }
});

/**
 * Helper method checking if an object is empty
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = router;

// CORS
/* CORS endpoints receive requesting origin via "Origin" HTTP header. This header has to be restricted to only allow the following origins:

 *.ampproject.org
 *.amp.cloudflare.com
 The Publisher’s own origins
 */