var express = require('express')
  , router = express.Router()

router.get('/', function(req, res){
	res.render('users/index');
});

module.exports = router