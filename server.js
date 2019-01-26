const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cors = require("cors");
const SocketManager = require("./SocketManager");
const User = require("./models/User");
const Message = require("./models/Message");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
authRoute(app);
productRoute(app);

mongoose
  .connect("mongodb://adrentuser:anger1ssue@ds259410.mlab.com:59410/adrentdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const users = {};
const admins = {};

io.on("connection", function(socket) {
  socket.on("add user", function(roomId) {
    socket.roomId = roomId;
    User.findById(roomId)
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
    Message.find({ roomId: socket.roomId })
      .then(messages => {
        messages.slice(-1, 1);
        socket.emit("chat history", {
          history: messages,
          getMore: false
        });
        if (Object.keys(admins).length === 0) {
          socket.emit(
            "log message",
            "Thank you for reaching us. Please leave your message here and we will get back to you shortly."
          );
        } else {
          if (newUser) {
            socket.emit(
              "log message",
              "Hello " + socket.userDetails.name + ", How can I help you?"
            );
            Object.values(admins).forEach(adminSocket => {
              adminSocket.join(socket.roomId);
              adminSocket.emit("New Client", {
                roomId: socket.roomId,
                history: messages,
                details: socket.userDetails,
                justJoined: false
              });
            });
          }
        }
      })
      .catch(err => console.log(err));
    Message.count({ roomId: socket.roomId })
      .then(len => {
        socket.MsgHistoryLen = len - 10;
        socket.TotalMsgLen = len;
      })
      .catch(err => console.log("Forgot to count!"));
  });

  socket.on("chat message", function(data) {
    if (data.roomId === "null") data.roomId = socket.roomId;
    data.isAdmin = socket.isAdmin;
    Message.create(data)
      .then(msg => console.log("Message: " + msg.msg + " saved"))
      .catch(err => console.log("Message: " + data.roomId + " didn't save!"));
    socket.broadcast.to(data.roomId).emit("chat message", data);
  });

  socket.on("more messages", function() {
    if (socket.MsgHistoryLen > 0) {
      Message.find({ roomId: socket.roomId })
        .skip(socket.MsgHistoryLen)
        .then(messages => {
          socket.emit("more chat history", {
            history: messages
          });
        });
      socket.MsgHistoryLen -= 10;
    }
  });
});

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Server running at ${port}`));
