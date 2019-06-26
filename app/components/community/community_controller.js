var express = require('express')
  , router = express.Router()

router.get('/', function(req, res){
	  res.render('community/index', { host: req.headers.host, session: req.session });
});

router.get('/room/:id', function(req, res){
  res.render('community/index', { host: req.headers.host, session: req.session, channel: req.params.id });
});

module.exports = router