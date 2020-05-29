const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var path = require("path");
//const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const name = require("./username");
//connecting the mongo database
const connect = require("./dbConnect");
//const connect = dbConnect(process.env.DBURL);
//new schema instance
const Chat = require("./model/chatschema");

//this is for auto https upgrades for production
const checkHttps = require("./route/httpsUpgrade");
//app.all('*', checkHttps)

// Specify a directory to serve static files
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.render(`${path.join(__dirname + "/public")}`);
});

app.set("view engine", "ejs");

var usersArr = [];
io.sockets.on("connection", function (socket) {
  socket.on("username", function (username) {
    //validating username
    socket.username = name.validUser(username);
    if (!usersArr.includes(socket.username)) {
      usersArr.push(socket.username);
    }
    io.emit(
      "is_online",
      " <i class='mx-auto'>" + socket.username + " has joined the chat..</i>"
    );
    io.emit("users", usersArr);
  });

  socket.on("disconnect", function (username) {
    usersArr.splice(usersArr.indexOf(socket.username), 1);
    io.emit(
      "is_online",
      " <i class='mx-auto'>" + socket.username + " has left the chat..</i>"
    );
    io.emit("users", usersArr);
  });

  /*
  //sends messages and saves them
  socket.on("chat_message", function (message) {
    io.emit("chat_message", "" + socket.username + ": " + message);
    connect.then((db) => {
      let chatMessage = new Chat({
        message: message,
        username: socket.username,
      });
      chatMessage.save();
    });
  });

  */
  /*
//sends the previous messages to client
  app.get("/chat", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    connect.then((db) => {
      Chat.find({}).then((chat) => {
        res.json(chat);
      });
    });
    
  });
*/
socket.on("checked", function (data) {
  io.emit("checked", data);
});
  
  
  
  app.get("/set/user", function (req, res) {
    res.status(200).sendFile(path.join(__dirname, "public", "user.html"));
  });
});
const port = 3000 || process.env.PORT;
const server = http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
