//Singleton instance of IO
let ioInstance;

module.exports = function(http) 
{
	const io = require('socket.io')(http);
	var Room = require('./helpers/rooms/room.js')
	let rooms = {};

	ioInstance = io;

	io.sockets.on('connection', function(socket)
	{
		socket.on('adduser', function(username, room){

			socket.username = username;
			socket.room = room;
			socket.join(room);

			if (rooms[room])
				rooms[room].addUser(username);
			else
				rooms[room] = new Room(username);

			io.sockets.to(room).emit('updateusers', rooms[room].getUsers());
			io.sockets.to(room).emit('updatechat', '<span style="color:red">Daemon</span>', 'You have connected to '+ room);
			socket.broadcast.to(room).emit('updatechat', '<span style="color:red">Daemon</span>', username + ' has joined the chat');
		})

		socket.on('sendchat', function(data) 
		{
			io.sockets.in(socket.room).emit('updatechat', socket.username, data);
		});

		socket.on('disconnect', function()
		{
			if (rooms[socket.room])
				rooms[socket.room].removeUser(socket.username);

			io.sockets.in(socket.room).emit('updateusers', rooms[socket.room].getUsers());
			io.sockets.in(socket.room).emit('updatechat', '<span style="color:red">Daemon</span>', socket.username + ' has left the chat');
			socket.leave(socket.room);
		})
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