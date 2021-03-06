const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cors = require("cors");
//const SocketManager = require("./SocketManager");
const User = require("./models/User");
const Room = require("./models/Room");
const config = require("./config/config");
const path = require("path");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
authRoute(app);
productRoute(app);

mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("adrent-spa-client/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "adrent-spa-client", "build", "index.html")
    );
  });
}

const users = {};
const admins = {};

io.on("connection", function(socket) {
  socket.on("add user", function(data) {
    socket.isAdmin = false;
    socket.roomId = data.roomId;
    User.findById(data.roomId)
      .then(user => {
        socket.userDetails = user;
      })
      .catch(err => console.log(err));
    socket.join(socket.roomId);
    let newUser = false;
    if (!users[socket.roomId]) {
      users[socket.roomId] = socket;
      newUser = true;
    }
    Room.findOne({ roomId: socket.roomId })
      .then(room => {
        if (!room) {
          Room.create({ roomId: socket.roomId })
            .then(r => {
              socket.emit("chat history", {
                history: [],
                getMore: false
              });
            })
            .catch(err => {
              console.log("Room not created!");
              console.log(err);
            });
        } else {
          //room.messages.slice(-1, 1);
          socket.emit("chat history", {
            history: room.messages,
            getMore: false
          });
        }
        if (Object.keys(admins).length === 0) {
          if (room.messages.length < 1) {
            socket.emit(
              "log message",
              "Thank you for reaching us. Please leave your message here and we will get back to you shortly."
            );
          }
        } else {
          if (newUser) {
            socket.emit(
              "log message",
              "Hello " + socket.userDetails.username + ", How can I help you?"
            );
            Object.values(admins).forEach(adminSocket => {
              adminSocket.join(socket.roomId);
              adminSocket.emit("New Client", {
                roomId: socket.roomId,
                history: room && room.messages ? room.messages : [],
                details: socket.userDetails,
                justJoined: false
              });
            });
          }
        }
        let len = room && room.messages ? room.messages.length : 0;
        socket.MsgHistoryLen = len - 10;
        socket.TotalMsgLen = len;
      })
      .catch(err => console.log(err));
  });

  socket.on("add admin", function(data) {
    this.isAdmin = data.isAdmin;
    socket.username = data.admin;

    Object.values(admins).forEach(adminSocket => {
      adminSocket.emit("admin added", socket.username);
      socket.emit("admin added", adminSocket.username);
    });

    admins[socket.username] = socket;

    //If some user is already online on chat
    if (Object.keys(users).length > 0) {
      Object.values(users).forEach(function(userSocket) {
        Room.findOne({ roomId: userSocket.roomId })
          .then(room => {
            let userSocket = users[room.roomId];
            let history = room.messages;
            //history.splice(-1, 1);
            socket.join(userSocket.roomId);
            socket.emit("New Client", {
              roomId: userSocket.roomId,
              history: history,
              details: userSocket.userDetails,
              justJoined: true
            });
          })
          .catch(err => console.log(err));
      });
    }
  });

  socket.on("chat message", function(data) {
    if (data.roomId === "null") data.roomId = socket.roomId;
    data.isAdmin = socket.isAdmin;
    const message = {
      isAdmin: data.isAdmin,
      msg: data.msg,
      username: data.username ? data.username : null,
      timestamp: data.timestamp
    };
    Room.findOne({ roomId: data.roomId }).then(room => {
      if (!room) {
        Room.create({ roomId: data.roomId })
          .then(r => {
            r.messages.push(message);
            r.save().then(() => console.log("Room: " + r.roomId + " saved"));
          })
          .catch(err => console.log("Room: " + data.roomId + " didn't save!"));
      } else {
        room.messages.push(message);
        room.save().then(() => console.log("Room: " + room.roomId + " saved"));
      }
    });
    io.in(data.roomId).emit("chat message", data);
  });

  socket.on("more messages", function() {
    if (socket.MsgHistoryLen >= 0) {
      Room.findOne({ roomId: socket.roomId }).then(room => {
        if (socket.MsgHistoryLen < 10) {
          socket.emit("more chat history", {
            history: [...room.messages]
          });
        } else {
          socket.emit("more chat history", {
            history: room.messages.slice(socket.MsgHistoryLen)
          });
        }
      });
      socket.MsgHistoryLen -= 10;
    }
  });

  socket.on("typing", function(data) {
    socket.broadcast.to(data.roomId).emit("typing", {
      isTyping: data.isTyping,
      person: data.person,
      roomId: data.roomId
    });
  });

  socket.on("disconnect", function() {
    console.log("logout attempt!");

    if (socket.isAdmin) {
      delete admins[socket.username];
      Object.values(admins).forEach(function(adminSocket) {
        adminSocket.emit("admin removed", socket.username);
      });
    } else {
      if (io.sockets.adapter.rooms[socket.roomId]) {
        var total = io.sockets.adapter.rooms[socket.roomId]["length"];
        var totAdmins = Object.keys(admins).length;
        var clients = total - totAdmins;
        if (clients == 0) {
          //check if user reconnects in 4 seconds
          setTimeout(function() {
            if (io.sockets.adapter.rooms[socket.roomId])
              total = io.sockets.adapter.rooms[socket.roomId]["length"];
            totAdmins = Object.keys(admins).length;
            if (total <= totAdmins) {
              delete users[socket.roomId];
              socket.broadcast
                .to(socket.roomId)
                .emit("User Disconnected", socket.roomId);
              Object.values(admins).forEach(function(adminSocket) {
                adminSocket.leave(socket.roomId);
              });
            }
          }, 4000);
        }
      } else {
        if (socket.userDetails) {
          delete users[socket.roomId];
          socket.broadcast
            .to(socket.roomId)
            .emit("User Disconnected", socket.roomId);
          Object.values(admins).forEach(function(adminSocket) {
            adminSocket.leave(socket.roomId);
          });
        }
      }
    }
  });
});

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Server running at ${port}`));
