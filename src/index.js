var express = require('express');  
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '../frontend/index.html'))
});

import {users} from './users.js';

io.on('connection', function(socket){
	//users.add(socket.id);
	io.emit('updateOnline', users.readable(), {for:'everyone'});

	socket.on('login', function(data) {
		users.update(socket.id, data);
		io.emit('updateOnline', users.readable(), {for:'everyone'});
	});

	socket.on('message', function(data) {
		data = {...data, senderId:socket.id};
		if (!data.dest) {
			socket.broadcast.emit('message', data);
		}
		else {
			let id = users.getByUsername(data.dest);
			socket.broadcast.to(id).emit('message', data)
		}
	})

	socket.on('disconnect', function(){
		users.remove(socket.id);
		io.emit('updateOnline', users.readable(), {for:'everyone'});
	});
});


http.listen(3000, function(){
	//console.log('listening on *:3000');
});