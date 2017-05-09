var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET categories. */
router.get('/:category', function(req, res, next) {
  console.log(req.params.category);
  res.render('index', { title: 'Express' });
});
module.exports = router;
