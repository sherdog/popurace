var express = require('express')
  , router = express.Router()
const Community = require('../models/community_model');
const User = require('../../users/models/user_model');
const mongoose = require('mongoose');
const authenticated = require('../../../helpers/authenticated');

router.get('/', function(req, res) 
{
  res.render('./community/views/index', { host: req.headers.host })
});

router.get('/invitation/:id', function(req, res) 
{
  Community.findOne({ invite_code: req.params.id })
  .then(function(communityData)
  {
    if (communityData) 
    {
      res.render('community/views/join', { community_name:communityData._id, invite_code: req.params.id, host: req.headers.host });
    } 
    else 
    {
      res.render('community/views/join', { error:true, error_message: "Error, could not find invite code", host: req.headers.host });
    }
  })
  .catch(function(err)
  {
    console.log('Error searching for community.');
  })
})

router.get('/get_joined_communities', function(req, res)
{
      //return a list of communities that a user is subscribed to.
      User.findById(req.session.user, 'communities')
        .populate('communities', 'community_name')
        .exec(function(err, data) {
          if (err)
          {
            res.send({status: 'error', 'communities': null})
          }
          else
          {
            res.send({status: 'ok', 'communities': data.communities})
          }
        });
});

router.get('/error', function(req, res)
{
  res.render('./community/views/denied')
})

router.get('/room/:id', authenticated, function(req, res)
{

  let roomID = req.params.id;
  let connectError = false;
  let loggedIn = true;

  Community.findById(mongoose.Types.ObjectId(roomID))
  .then(function(com) {
    if (com) 
    {
      //we found one. is user logged in?
      if (!req.session.logged_in) 
      {
        req.session.flash = "You must be logged in to view the community room";
        req.session.room = roomID;
        connectError = true;
        loggedIn = false;
      } 
      else 
      {
        //check if user has access to this room.
        User.findById(mongoose.Types.ObjectId(req.session.user))
        .then(function(user) {

          if (user.communities.indexOf(roomID) === -1)
          {
            //fucking user trying to be sneaky.
            connectError = true;
            console.log('Rooms do not match.');
            res.redirect('/community/error');
            res.end();
          }
        })
        .catch(function(err){
          console.log('Couldnt locate user? wtf. ' + err);
          connectError = true;
          res.redirect( '../../sign-in');
          res.end();
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

router.post('/join', function(req, res)
{
  //validate code:
  let invite_code = req.body.invite_code;
  let error = false;
  let msg = "";
  let community_id = '';

  if (invite_code == "" || invite_code.length != 8)
  {
    error = true;
    msg = "Invalid invite code";
  }
  else
  {
    //check for invite code in all community.
    Community.findOne({invite_code: invite_code })
    .then (function(comm)
    {
      console.log('Community found with invite code: ' + invite_code);
      if (!comm) 
      {
        error = false;
        msg = "Invalid invite code";
      }
      else 
      {
        console.log("Community data: " + comm);
        User.findById(req.session.user)
        .then(function(userData)
        {
          if (!userData) 
          {
            console.log('Couldnt find user! ' + userData);
            error = true;
            msg = "Must be signed in to continue."
          }
          else
          {
            console.log('found user! ' + userData);
            if (!userData.communities.indexOf(comm._id) === -1 || userData.communities.length === 0)
            {
              console.log("Empty communities " + comm);
              userData.communities.push(comm._id);
              userData.save();
            }

            if (comm.users.indexOf(userData._id) == -1)
            {
              comm.users.communities.push(userData._id);
              comm.save();
            }
          }
        })
        .catch(function(err)
        {
          error = true;
          msg = "Unexpected error occurred"
        })
        res.send(JSON.stringify({ status: "ok", community_id: comm._id }))
      return;
      }
    })
    .catch(function(err)
    {
      error = true;
      msg = "Unexpected error occurred"
      res.send(JSON.stringify({status: "error", "msg": msg}));
      return;
    })
  }
})

router.post('/create_community', function(req, res)
{
  let name = req.body.community_name.trim();
  let query = { community_name: name }
  
  Community.findOne(query)
  .then (function(communityData) 
  {
    if (communityData)
    {
      res.send({ status: 'ok', valid: false })
    } 
    else
    {
       Community.create({ community_name: name }, function(err, communityData)
       {
          if (err)
          { 
            res.send({ status: 'error', 'msg': err })
          }

          User.findById(req.session.user)
          .then(function(userData)
          {

            //Add user to communities.
            communityData.users.push(userData._id)
            communityData.save();

            userData.communities.push(communityData._id); //Add to list of communities this user owns.
            userData.save();
            
            req.session.community_name = name;
            res.send({status: 'ok', valid:true, community_id: communityData._id, community_name: name })
          })
          .catch(function(err)
          {
            console.log("Error finding user by ID " + req.session.user);
          })
       })
    }
  })
  .catch(function(error)
  {
    console.log("Error checking for commmunity name " + error);
  })
})

module.exports = router
