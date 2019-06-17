const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
	res.render('index.ejs');
})

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

const server = http.listen(8080, function(){
	console.log('Listening on port *:8080');
});