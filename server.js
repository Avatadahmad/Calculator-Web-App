const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/user");
const { userJoin, getCurrentUser } = require("./utils/currentUser");

const serverApp = express();
const server = http.createServer(serverApp);
const io = socketio(server);
serverApp.use(express.static(path.join(__dirname, "public")));

//run when client connects using socket.io

io.on("connection", (socket) => {
  socket.on("joinRoom", (username) => {
    const user = userJoin(socket.id, username);
  });
  // Get the result on server side and display to all clients
  socket.on("message", (msg) => {
    const user = getCurrentUser(socket.id);
    io.emit("message", formatMessage(user.username, msg));
  });
});
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log("server is runing"));
