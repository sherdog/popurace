const express = require('express')
const router = new express.Router();

//define all routes here.
router.use('/community', require('./components/community/community_routes'))
router.use('/users', require('./components/users/users_routes'))

//default to main entry route
router.get('/', function(req, res) {
     if (req.session.views) {
        req.session.views++
      } else {
        req.session.views = 1
      }
    
    res.render('default/index', { host: req.headers.host, views: req.session.views })
})

module.exports = router
