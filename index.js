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

// Specify a directory to serve static files and rendering using ejs
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/public"));
app.get("/", function (req, res) {
  res.render("index");
});

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

  //sends the previous messages to client
  app.get("/votedata", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    connect.then((db) => {
      Chat.find({}).then((chat) => {
        res.json(chat);
      });
    });
  });

  //saves or deletes data objects
  const dbsave = async function (obj) {
    

    if (obj.add === true) {


      connect.then((db) => {
        Chat.exists({
          question: obj.question,
          name: obj.name,
          option: obj.option,
        }).then((exists) => {
        //  console.log("exists");
          if (!exists) {
            let voteObj = new Chat({
              question: obj.question,
              name: obj.name,
              option: obj.option,
            });
           // console.log("saved");
            voteObj.save();
          }
        });
      });
      /*
      connect.then((db) => {
        let voteObj = new Chat({
          question: obj.question,
          name: obj.name,
          option: obj.option,
        });
        voteObj.save();
        //  console.log("saved");
      });
      */
    } else {
      Chat.deleteOne(
        { question: obj.question, name: obj.name, option: obj.option },
        function (err) {
          if (err) return console.log(err);
          // deleted at most one tank document
        }
      );
      // console.log("deleted");
    }
  };

  socket.on("checked", function (data) {
    //  const mongoDat = await Chat.find({ question: data.question });
    dbsave(data);
    socket.broadcast.emit("checked", data);
  });

  app.get("/set/user", function (req, res) {
    res.status(200).sendFile(path.join(__dirname, "public", "user.html"));
  });
});
const port = 3000 || process.env.PORT;
const server = http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
