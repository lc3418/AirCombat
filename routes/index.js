var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/regis', function(req,res) {
	res.render('regis');
})

router.get('/login', function(req,res) {
	res.render('login');
})

router.get('/homepage', function(req,res) {
	res.render('homepage');
});

module.exports = router;
