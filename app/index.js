var express = require('express')
const path = require('path')
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static(path.resolve('public')))
app.set('view options', { pretty: true });
app.set('views', path.join(__dirname, 'components'))
app.set('view engine', 'pug')

//load all of routers/controller/middleware what have you.
app.use(require('./routes'))

module.exports = app