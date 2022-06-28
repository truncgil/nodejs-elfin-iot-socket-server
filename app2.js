var express = require('express');
var app = express();
var server = app.listen(9999);
var io = require('socket.io').listen(server);

console.log("server start");
var name = {};
io.sockets.on('connection', function(socket) {
var ipv4 = socket.request.socket.remoteAddress;

socket.on('sendMsg', function(data) {
if (data.message === '' || data.message === null) {
return;
}else if(data.message.indexOf('<')>=0){
socket.disconnect();
return;
}
if (name[socket.id] !== null) {
var msg = name[socket.id] + "(" + ipv4 + ") : " + data.message.trim();
console.log(msg);
io.sockets.emit('sendMsg', {message: msg});
}
});
socket.on('sendName', function(data) {
if (data.name === "" || data.name === null) {
socket.disconnect();
} else {
console.log(data.name.trim() + "(" + ipv4 + ") 's connected");
name[socket.id] = data.name;
io.sockets.emit('sendName', {name: data.name.trim() + "(" + ipv4 + ") 's connected"});
}
});
socket.on('disconnect', function() {
console.log(name[socket.id] + " was disconnected");
io.sockets.emit('disconnected', {name: name[socket.id]});
});
});