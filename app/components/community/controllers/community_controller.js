var express = require('express')
  , router = express.Router()
const Community = require('../models/community_model');
const User = require('../../users/models/user_model');
const mongoose = require('mongoose');

router.get('/', function(req, res) {
  res.render('./community/views/index', { host: req.headers.host })
});

router.get('/error', function(req, res){
  res.render('./community/views/denied')
})

router.get('/room/:id', function(req, res) {

  let roomID = req.params.id;
  let connectError = false;
  let loggedIn = true;

  Community.findById(mongoose.Types.ObjectId(roomID))
  .then(function(com) {
    if (com) {

      console.log("Found community: " + com);

      //we found one. is user logged in?
      if (!req.session.logged_in) {
        req.session.flash = "You must be logged in to view the community room";
        req.session.room = roomID;
        loggedIn = false;
      } else {
        //check if user has access to this room.
        User.findById(mongoose.Types.ObjectId(req.session.user))
        .then(function(user) {
          console.log('user com: ' + user.community + ' room: ' + roomID);
          if (user.community != roomID) {
            //fucking user trying to be sneaky.
            connectError = true;
            console.log('Rooms do not match.');
          }
        })
        .catch(function(err){
          console.log('Couldnt locate user? wtf. ' + err);
          connectError = true;
        })
      }
    }
    else 
    {
      connectError = true;
    }
    console.log("Connect error: " + connectError);

    if (connectError) {
      if (!loggedIn) {
        console.log("Not logged in");
        res.redirect( '../../sign-in');
      }
      else
        res.redirect('/community/error');
    } else {
      let channelName = (com.community_name != "") ? com.community_name : com._id;
      res.render('./community/views/chatroom', { host: req.headers.host, session: req.session, channel: channelName, invite_code: com.invite_code });
    }
  })
  .catch(function(error){
    console.log("error finding community: " + error);
    connectError = true;
  })

  
  
});

router.post('/check_name', function(req, res){

  let name = req.body.community_name.trim();

  let query = { community_name: name }
  Community.findOne(query)
  .then (function(communityData) {
    
    if (communityData) {

      res.send({ status: 'ok', valid: false })

    } else {

       Community.create({ community_name: name }, function(err, communityData) {
          
          if (err) { 
            res.send({ status: 'error', 'msg': err })
          }

          //get user and update his record with this new community.
          console.log("find by id: " + req.session.user);

          User.findById(req.session.user)
          .then(function(userData){
            
            console.log("Found user: " + userData);

            userData.community = communityData._id;
            userData.save();
            
            req.session.community_name = name;
            res.send({status: 'ok', valid:true, community_id: communityData._id, community_name: name })
          })
       })
    }
  })
  .catch(function(error){
    console.log("Error checking for commmunity name " + error);
  })
  console.log("Checking for available community name");

})

module.exports = router