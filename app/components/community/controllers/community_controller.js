var express = require('express')
  , router = express.Router()
const Community = require('../models/community_model');

router.get('/', function(req, res){
	  res.render('./community/views/index', { host: req.headers.host, session: req.session });
});

router.get('/room/:id', function(req, res){
  let roomID = req.params.id;
  //check to make sure user is logged in.
  if (!req.session.loggedIn) {
    req.session.flash = "You must be logged in to view the community room";
    req.session.dest = '/room/' + roomID;
    res.redirect( '../../sign-in');

    return;
  }

  res.render('./community/views/index', { host: req.headers.host, session: req.session, channel: req.params.id });
});

router.post('/check_name', function(req, res){

  let name = req.body.community_name.trim();

  let query = { community_name: name }
  Community.findOne(query)
  .then (function(communityData){
    if (communityData) {
      res.send({ status: 'ok', valid: false })
    } else {
       Community.create({
         community_name: name
       }, function(err, communityData){
          if (err) { 
            res.send({ status: 'error', 'msg': err })
          }
          req.session.community_name = name;
          res.send({status: 'ok', valid:true, community_id: communityData._id, community_name: name })
       })
    }
  })
  .catch(function(error){
    console.log("Error checking for commmunity name " + errro);
  })
  console.log("Checking for available community name");

})

module.exports = router