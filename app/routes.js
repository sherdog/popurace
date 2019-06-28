const express = require('express')
const router = new express.Router();

//default to main entry route
router.get('/', function(req, res) {
    res.render('default/index', { host: req.headers.host })
})

//default to main entry route
router.get('/sign-in', function(req, res) {
    res.render('users/views/signin', { host: req.headers.host })
})

//default to main entry route
router.get('/get-started', function(req, res) {
    res.render('community/views/getstarted', { host: req.headers.host })
})



//define all routes "controllers" here.
router.use('/community', require('./components/community/controllers/community_controller'))
router.use('/users', require('./components/users/controllers/users_controller'))

module.exports = router