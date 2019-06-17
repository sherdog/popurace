var myVar = <%- JSON.stringify(host) %>;
var socket = io.connect(myVar);

$('form').submit(function(e){
    e.preventDefault();
    socket.emit('chat_message', $('#txt').val());
    $('#txt').val('');

    return false;
});

socket.on('chat_message', function(msg){
    $('#messages').append($('<li>').html(msg));
});

socket.on('is_online', function(username){
    $('#messages').append($('<li>').html(username));
});

var username = prompt('Enter your username');
socket.emit('username', username);