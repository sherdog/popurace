var express = require('express')
const path = require('path')

var app = express();

app.set('views', path.join(__dirname, 'components'))
app.set('view engine', 'pug')

console.log(app.settings.views);

//load all of routers/controller/middleware what have you.
app.use(require('./routes'))

module.exports = app