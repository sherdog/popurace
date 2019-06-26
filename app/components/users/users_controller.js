const express = require('express')
const router = express.Router()
const User = require('../../models/user_model')
const bcrypt = require('bcrypt')


//------- GET ROUTES --------- //
router.get('/', function(req, res) {
	res.render('users/index', { host: req.headers.host });
});

router.get('/join-community', function(req, res) {
	//Of course we need to check this user is in a community,
	//if so, we just take them to the community landing page.
	//but for now. meh.
	res.render('community/join_community', { host: req.headers.host })
})


//------- POST ROUTES --------- //
router.post('/join-community', function(req, res){
	
	var community = require('../../models/community_model')

	//check for open slot.
	let query = { full: false }
	community.findOne(query)
		.then(function(community) {
			//if null, we need to create a new one.
			if (community != null)
			{
				let update = { 
					community: community._id
				}
				
				console.log('User id: ' + User._id);
	
				User.update({_id: User._id }, update, function(err, userData) {
					if (error) {
						res.send(JSON.stringify({ status: 'error', error: err}))
					}
					res.send(JSON.stringify({status: 'ok', user: userData } ))
				})
			}
			else {
				//create new community.
				community.create({}, function (err, communityData) {
					
					if (err ) res.send({ status: 'error', error: err });
					
					console.log('User id: ' + User._id);

					let update = { 
						community: communityData._id
					}

					console.log('Community id: ' + communityData._id);

				   	User.update({_id: User._id }, update, function(err, userData) {
						if (error) {
							res.send(JSON.stringify({ status: 'error', error: err}))
						}
						res.send(JSON.stringify({status: 'ok', user: userData } ))
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
    .then(function(user){
        res.send({'available': (user === null)})
    })
    .catch(function(err){
      res.send(err);
    })
})

router.post('/logout', function(req, res) {
  req.session.destroy(function(err) {
    console.log("error destroying session");
  })

  res.send(JSON.stringify({ status: 'ok' }))
})

router.post('/login', function(req, res) {

	let username = req.body.username;
	let pass = req.body.password;
	
	User.findOne({ username: username })
		.then(function(user){
			if(user == "") {
				res.send(JSON.stringify({ status: 'error'}))
			}
			if (!bcrypt.compareSync(pass, user.password)) {
				res.send(JSON.stringify({ status: 'error' }))
		}
		
			//Logged in successfully
			req.session.logged_in = true
			req.session.username = user.username

				res.send(JSON.stringify({ status: 'ok' }))
			})
		.catch(function(err) {
			res.send(JSON.stringify({ status: 'error'}));	
		})
});

router.post('/create', function(req, res){
	let user = req.body.username;
	let pass = req.body.password;
	
	User.create({ username:  user, password: pass }, function (err, user) {
	  if (err ) res.send({ status: 'error', error: err });
     res.send({ status: 'ok', user: user });
	});
});

module.exports = router
