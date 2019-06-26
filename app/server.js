const app = require('./index')
const http = require('http').Server(app)
const { Connection } = require('./db')
const socket = require('./socket')(http)
const fs = require('fs')
const path = require('path')

//include some sort of logging.. need to research
console.log('Starting server instance')

let port = (process.env.PORT) ? process.env.PORT : 3000;

//start connection to mongo db
Connection.connect()
    .then(con => {
        //set db instance to app, so it can be used globally.
        app.set('db', con);

        //start the server.
        const server = http.listen(port, function() {
            console.log('Listening on port ' + port)
        });
    })
    .catch(error => {
        console.log('Error creating mongoose connection ', error)
    })