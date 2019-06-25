const express = require('express')
const router = new express.Router();

//define all routes here.
router.use('/community', require('./components/community/community_routes'))
router.use('/users', require('./components/users/users_routes'))

//default to main entry route
router.get('/', function(req, res) {
    res.render('default/index', { host: req.headers.host })
})

module.exports = router
