const app = require('./index')
const http = require('http').Server(app)
const { Connection } = require('./db')
const config = require('./config');

//start connection to mongo db
Connection.connect()
    .then(con => {
        //set db instance to app, so it can be used globally.
        app.set('db', con);
        const server = http.listen(config.express.port, function() {

            console.log('Listening on port ' + config.express.port + ' in mode: ' + config.environment);
        });
    })
    .catch(error => {
        console.log('Error, website done! Website down!');
    })