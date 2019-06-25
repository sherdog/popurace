const express = require('express')
const router = express.Router()
const User = require('../../models/userSchema')

router.get('/', function(req, res){
	res.render('users/index', { host: req.headers.host });
});

router.post('/check_username', function(req, res){
  //here we're going to check if the username if not available.
  //if it's not available we tell the user.
  console.log('Req username: ' + req.body.username);
  User.findOne({username: req.body.username})
    .then(function(user){
        res.send({'available': (user === null)})
    })
    .catch(function(err){
      res.send(err);
    })
})

router.post('/create', function(req, res){
	let user = req.body.username;
	let pass = req.body.password;
	
	User.create({ username:  user, password: pass }, function (err, user) {
	  if (err) return handleError(err);
	   res.send({ status: 'success', user: user });
	});
});

module.exports = router
