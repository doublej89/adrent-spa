const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  messages: [
    {
      isAdmin: { type: Boolean, required: true },
      msg: { type: String, required: true },
      userName: String
    }
  ]
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
