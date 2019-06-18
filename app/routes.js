var express = require('express')
var join = require('path').join

var router = new express.Router();

//define all routes here.
router.use('/community', require('./components/community/community_routes'))

//default to main entry route
router.get('/', function(req, res) {
    res.render('default/index')
})

module.exports = router