//Singleton instance of IO
let ioInstance;

module.exports = function(http) {

	const io = require('socket.io')(http);
	ioInstance = io;
	let usernames = {};

	io.sockets.on('connection', function(socket){
		//start the realtime stuffs. 

		socket.on('adduser', function(username, room){
				socket.username = username;
				socket.room = room;
				usernames[username] = username;
				socket.join(room);
				io.sockets.emit('updateusers', usernames);
				socket.emit('updatechat', 'SERVER', 'You have connected to '+ room);
				socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected');
		})

		socket.on('sendchat', function(data) {
			io.sockets.in(socket.room).emit('updatechat', socket.username, data);
		});

		socket.on('disconnect', function(){
			delete usernames[socket.username];
			io.sockets.emit('updateusers', usernames);
			socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
			socket.leave(socket.room);
		})
		/*
		socket.on('room', function(room){
			socket.join(room);
		});

		socket.on('username', function(username){
			socket.username = username;
			io.emit('is_online', '<i>' + socket.username + ' joined the chat...</i>');
			io.emit('enter_chat', socket.username);
		});

		socket.on('disconnect', function(username){
			io.emit('is_online', '<i>' + socket.username + ' has left the chat...</i>');
			io.emit('leavechat', socket.username);
		});

		socket.on('chat_message', function(message){
			io.emit('chat_message', '<strong>'+socket.username+'</strong>: ' + message);
		});
		*/
	});

    return io;
}

// this getIO method is designed for subsequent 
// sharing of the io instance with other modules once the module has been initialized
// other modules can do: let io = require("./io.js").getIO();
exports.getIO = function() {

    if (!ioInstance) {
        throw new Error("Must call module constructor function before you can get the IO instance");
    }

    return ioInstance;
}