const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express();
const config = require('./config');
const MongoStore = require('connect-mongo')(session)

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/static', express.static(path.resolve('public')));
app.set('view options', { pretty: true });
app.set('views', path.join(__dirname, 'components'));
app.set('view engine', 'pug');
app.enable('strict routing');
app.use(session({ 
    secret: config.session.hash, 
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({url: config.mongodb.host})
}));

if (config.environment === 'development')
    app.locals.pretty = true;

app.use(require('./routes'));

module.exports = app
