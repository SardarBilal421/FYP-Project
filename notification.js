const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('notification', (data) => {
    console.log('notification received:', data);
    socket.broadcast.emit('notification', data);
  });
});

const notificationData = {
  message: 'New notification!',
};

console.log(io.emit('notification', notificationData));
