const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
const {generateMessage} = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection', function(socket){
	console.log('new user connected');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', function(message, callback){
		console.log('Message Created', message);
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback('This is from the server');
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