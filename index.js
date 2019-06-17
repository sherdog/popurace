const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const url = require('url');


app.get('/', function(req, res){
	var hostname = req.headers.host;
	console.log("Request for " + hostname + " received.");
	res.render('index.ejs', { host: hostname });
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

let port = 8080;
if (process.env.PORT)
	port = process.env.PORT;

const server = http.listen(port, function(){
	console.log('Listening on port ' + port);
});
