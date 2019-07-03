const express = require('express')
const router = express.Router()
const User = require('../models/user_model')
const Community = require('../../community/models/community_model')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

//------- GET ROUTES --------- //
router.get('/', function(req, res) {
	res.render('users/views/index', { host: req.headers.host, sess: req.session });
});

router.get('/join-community', function(req, res) {
	//Of course we need to check this user is in a community,
	//if so, we just take them to the community landing page.
	//but for now. meh.
	res.render('./community/views/join_community', { host: req.headers.host })
})

//------- POST ROUTES --------- //
router.post('/join-community', function(req, res) {
	
	console.log('Trying to join a community')
	
	//check for open slot.
	var query = { full: false }

	Community.findOne(query)
	.then(function(communityData) {
		//if null, we need to create a new one.
		if (communityData)
		{
			User.findById(mongoose.Types.ObjectId( req.session.user ))
			.then(function(userData) 
			{
				userData.communities.push(communityData._id);
				userData.save()
				.then(function(updatedUser) 
				{
					res.send(JSON.stringify({ status: 'ok', community: communityData._id } ))
				})
				.catch(function(err)
				{
					res.send(JSON.stringify({ status: 'error', msg: 'error joining community'}));
				})
			})
		}
		else 
		{
			//create new community.
			Community.create({}, function (err, communityData) {
				
				if (err ) {
					res.send({ status: 'error', error: err })
					console.log("error creating community: " + err)
				}
				
				User.findById(req.session.id)
				.then(function(user) {
					User.update({_id: user._id }, update, function(err, userData) {
						if (error) {
							res.send(JSON.stringify({ status: 'error', error: err}))
						}
						res.send(JSON.stringify({status: 'ok', community: communityData._id } ))
					})
				})
				.catch(function(err){
					console.log('Error saving ' + err)
				})
			});
		}
	})
	.catch(function(err) {
		res.send(JSON.stringify({ status: 'error', error: err}));
	})
})

router.post('/check_username', function(req, res) {
  //here we're going to check if the username if not available.
  //if it's not available we tell the user.
  User.findOne({username: req.body.username})
		.then(function(user)
		{
        res.send({'available': (user === null)})
    })
		.catch(function(err)
		{
      res.send(err);
    })
})

router.post('/logout', function(req, res) 
{
	req.session.destroy(function(err) 
	{
    console.log("error destroying session");
  })

	res.send(JSON.stringify({ status: 'ok' }))
	
})

router.post('/login', function(req, res) 
{

	let username = req.body.username;
	let pass = req.body.password;
	let room = req.body.room;
	
	User.findOne({ username: username })
		.then(function(user) 
		{
			if(user == "") 
				res.send(JSON.stringify({ status: 'error'}))

			if (!bcrypt.compareSync(pass, user.password)) 
				res.send(JSON.stringify({ status: 'error' }))
		
			//Logged in successfully
			req.session.logged_in = true
			req.session.username = user.username
			req.session.user = user._id;

			//if room is being submitted, lets up the users with that community room.
			let roomID = "";
			if (user.communities.length === 0 && room) 
			{
				if (room)
				{
					//maybe this was an invite. lets check to see if the user is in this community.
					Community.findById(room)
					.then(function(comm)
					{
						if (comm)
						{
							if(comm.users.indexOf(user._id) === -1)
							{
								comm.users.push(user._id);
								comm.save();
							}
						}
					})
					.catch(function(err)
					{
						console.log("Error finding community with " + room);
					})
				}

				if (user.communities.indexOf(room) === -1)
				{
					user.communities.push(room);
					user.save();
				}
			
				roomID = room;
				res.send(JSON.stringify({ status: 'ok', room: roomID }))
			} 
			else if (user.communities.length === 0 && !room)
			{
				console.log('no rooms found sending null ' + user.communities.length);
				//Shit, we need to send them to the get started
				res.send(JSON.stringify({ status: 'ok', room: null }))
			}
			else 
			{
				console.log('Found many communities, sending to the first one');
				roomID = user.communities[0];
				res.send(JSON.stringify({ status: 'ok', room: roomID }))
			}
		})
		.catch(function(err) 
		{
			res.send(JSON.stringify({ status: 'error'}));	
		})
});

router.post('/create', function(req, res){
	let user = req.body.username;
	let pass = req.body.password;
	let roomID = req.body.room;
	
	
	User.create({ username:  user, password: pass }, function (err, user) {
	  if (err ) res.send({ status: 'error', error: err });
		
		if (roomID) {
			//user needs to be redirect so let's add that
			user.community = roomID;
			user.save();
			
			req.session.logged_in = true
			req.session.username = user.username
			req.session.user = user._id;

			res.send({ status: 'ok', user: user, room: roomID });

		} else {
			
			req.session.logged_in = true
			req.session.username = user.username
			req.session.user = user._id;

			res.send({ status: 'ok', user: user });
		}
	});
});

module.exports = router
