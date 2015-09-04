var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Urban Mobile Sensors' });
});

// GET web pages
/* don't use catch all page serve, as per security article: http://wegnerdesign.com/blog/why-node-js-security/ */
router.get('/about', function(req, res){
  res.render('about')
});
router.get('/blog', function(req, res){
  res.render('blog')
});
router.get('/funding', function(req, res){
  res.render('funding')
});
router.get('/legal', function(req, res){
  res.render('legal')
});
router.get('/map', function(req, res){
  res.render('map')
});
router.get('/my-account', function(req, res){
  res.render('my-account')
});
router.get('/nUrve-sensor', function(req, res){
  res.render('nUrve-sensor')
});

module.exports = router;
