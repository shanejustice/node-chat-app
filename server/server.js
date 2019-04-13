const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server); 

app.use(express.static(publicPath));

io.on('connection', function(socket){
	console.log('new user connected');

	socket.emit('newMessage',{
		from: 'Admin',
		text: 'Welcome to the Chat App',
		createdAt : new Date().getTime()
	});

	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'New User Joined',
		createdAt : new Date().getTime()
	});

	socket.on('createMessage', function(message){
		console.log('Message Created', message);
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt : new Date().getTime()
		});
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		//     text: message.text,
		//     createdAt: new Date().getTime()
		// });
	}); 

	socket.on('disconnect', function(){
	console.log('User was disconnected');
});
});




server.listen(port, function(){
	console.log('Server is up on ' + port);
});