const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express();
const config = require('./config');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/static', express.static(path.resolve('public')));
app.set('view options', { pretty: true });
app.set('views', path.join(__dirname, 'components'));
app.set('view engine', 'pug');
app.use(session({ secret: config.session.hash, cookie: { maxAge: 60000 }}));

app.use(require('./routes'));

module.exports = app
