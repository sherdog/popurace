var app = require('./index')
var config = require('./config')
const http = require('http').Server(app);
const io = require('./socket')(http);

//include some sort of logging.. need to research
console.log('Starting server instance')

let port = 3000;

//override port for dynamic setting by heroku
if (process.env.PORT) {
	port = process.env.PORT;
}

const server = http.listen(port, function() {
	console.log('Listening on port ' + port);
});