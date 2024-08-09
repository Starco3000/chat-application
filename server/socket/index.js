const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');

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
  // console.log('token', token);
  console.log('connect User ', socket.id);

  //current user details
  const user = await getUserDetailsFromToken(token);

  // console.log('user', user);

  //create a room
  socket.join(user?._id?.toString());
  onlineUser.add(user?._id?.toString());

  io.emit('onlineUser', Array.from(onlineUser));

  socket.on('message-page', async (userId) => {
    console.log('userId', userId);
    const userDetails = await UserModel.findById(userId).select('-password');

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };

    socket.emit('message-user', payload);
  });

  //disconnect
  socket.on('disconnect', () => {
    onlineUser.delete(user?._id?.toString());
    console.log('disconnect user ', socket.id);
  });
});

module.exports = { app, server };
