const express = require('express')
const router = new express.Router();
const Community = require('./models/communitySchema')

//define all routes here.
//Could loop and locate any files ending with _routes.js - but for now this is simple.
router.use('/community', require('./components/community/community_routes'))
router.use('/users', require('./components/users/users_routes'))

//default to main entry route
router.get('/', function(req, res) {
    res.render('default/index')

    /*
    Community.find({}).then(function(communities){
        console.log(communities);
        res.send(communities);
    })
    */
})

module.exports = router