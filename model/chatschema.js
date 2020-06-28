const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    question: Number,
    name: String,
    option: String
  },
  {
    timestamps: true,
  }
);
let Chat = mongoose.model("voteData", chatSchema);

module.exports = Chat;
