const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    question: Number,
    a: [String],
    b: [String],
    c: [String],
    d: [String],
  },
  {
    timestamps: true,
  }
);
let Chat = mongoose.model("voteData", chatSchema);

module.exports = Chat;
