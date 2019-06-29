var express = require('express')
  , router = express.Router()
const Community = require('../models/community_model');
const User = require('../../users/models/user_model');
const mongoose = require('mongoose');

router.get('/', function(req, res) {
  res.render('./community/views/index', { host: req.headers.host })
});

router.get('/invitation/:id', function(req, res) {
  
  Community.findOne({ invite_code: req.params.id })
  .then(function(communityData){
    if (communityData) {
      console.log("Found community: " + communityData);
      res.render('community/views/join', { community_name:communityData._id, invite_code: req.params.id, host: req.headers.host });
    } else {
      res.render('community/views/join', { error:true, error_message: "Error, could not find invite code", host: req.headers.host });
    }
  })
  //res.render('community/views/getstarted', { host: req.headers.host })
})

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
        connectError = true;
        loggedIn = false;
      } else {
        //check if user has access to this room.
        console.log("Checking user session: " + req.session.user);
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

router.post('/join-community', function(req, res) {

  //validate code:
  let invite_code = req.body.invite_code.trim();
  let error = false;
  let msg = "";

  if (invite_code == "" || invite_code.length != 8)
  {
    error = true;
    msg = "Invalid invite code";
  }
  else
  {
    //check for invite code in all community.
    Community.findOne({invite_code: invite_code })
    .then (function(comm){
      if (!comm) {
        error = false;
        msg = "Invalid invite code";
      } else {

        User.findById(req.session.user)
        .then(function(user){
          if (!user) {
            error = true;
            msg = "Must be signed in to continue."
          }
          else
          {
            user.community_id = comm._id;
            user.save();
          }
        })
        .catch(function(err){
          error = true;
          msg = "Unexpected error occurred"
        })
        
      }
    })
    .catch(function(err){
      error = true;
      msg = "Unexpected error occurred"
    })

    if (error)
    {
      res.send(JSON.stringify({status: "error", "msg": msg}));
      return;
    } else {
      res.send(JSON.stringify({ status: "ok", community_id: comm._id }))
      return;
    }
  }
})

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