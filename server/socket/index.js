const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');

const app = express();

/***socket connection */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// socket running at http://localhost:8080/

//online User
const onlineUser = new Set();

io.on('connection', async (socket) => {
  const token = socket.handshake.auth.token;
  console.log('token', token);
  console.log('connect User ', socket.id);

  //current user details
  const user = await getUserDetailsFromToken(token);

  // console.log('user', user);
  
  //create a room
  socket.join(user?._id);
  onlineUser.add(user?._id);

  io.emit('onlineUser', Array.from(onlineUser));

  //disconnect
  socket.on('disconnect', () => {
    onlineUser.delete(user?._id);
    console.log('disconnect user ', socket.id);
  });
});

module.exports = { app, server };
