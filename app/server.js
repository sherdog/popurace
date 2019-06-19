var app = require('./index')
var config = require('./config')
const http = require('http').Server(app);
const io = require('./socket')(http);
const mongo = require('./db');

//include some sort of logging.. need to research
console.log('Starting server instance')

let port = 3000;

//override port for dynamic setting by heroku
if (process.env.PORT) {
	port = process.env.PORT;
}
console.log('config: ' + config.mongodb.host );

/*
mongo.connect(config.mongodb.host,
{ useNewUrlParser: true }, (err, db) => {
	if (err) console.log("Error connecting to db");

});
*/

const server = http.listen(port, function() {
	console.log('Listening on port ' + port);
});