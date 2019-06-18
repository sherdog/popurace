var app = require('./index')
var config = require('./config')
const http = require('http').Server(app);
const io = require('socket.io')(http);

//include some sort of logging.. need to research
console.log('starting server')

io.sockets.on('connection', function(socket){
	//start the realtime stuffs.
	socket.on('username', function(username){
		socket.username = username;
		io.emit('is_online', '<i>' + socket.username + ' joined the chat...</i>');
	});

	socket.on('disconnect', function(username){
		io.emit('is_online', '<i>' + socket.username + ' has left the chat...</i>');
	});

	socket.on('chat_message', function(message){
		io.emit('chat_message', '<strong>'+socket.username+'</strong>: ' + message);
	});
});

let port = 3000;
if (process.env.PORT)
	port = process.env.PORT;

const server = http.listen(port, function(){
	console.log('Listening on port ' + port);
});