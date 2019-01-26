const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  roomId: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  msg: { type: String, required: true },
  userName: String
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
