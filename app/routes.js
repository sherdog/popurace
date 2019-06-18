var express = require('express')
var join = require('path').join


var router = new express.Router();

router.use('/login', require('./components/login/login_routes'))
router.use('/community', require('./components/community/home'))

router.get('/', function(req, res){
    res.render('default/index')
})

//define all routes here.

module.exports = router