var express = require('express')
  , router = express.Router()

router.get('/', function(req, res){
    console.log(req.headers.host);
	res.render('community/index', { host: req.headers.host });
});

module.exports = router