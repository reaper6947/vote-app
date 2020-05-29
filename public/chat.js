var socket = io.connect("localhost:3000");
var formEl = document.getElementById("chatForm");
var textInputEl = document.getElementById("txt");
var messagesEl = document.getElementById("messages-ul");
var typingEl = document.getElementById("main-head-i");
var usersNo = document.getElementById("user-txt");
var submitBtn = document.getElementById("btn-submit");
var toastDiv = document.getElementById("joinedToast");
//gets previous messsages from server

/*
function getChats() {
  fetch("/chat")
    .then((data) => {
      return data.json();
    })
    .then((json) => {
      json.map((data) => {
        child = document.createElement("li");
        //console.log(data);
        child.classList.add(
          "list-group-item",
          "list-group-item-dark",
          "overflow-auto",
          "d-flex",
          "border-0",
          "message-cl"
        );
        child.innerHTML = `${data.username}:${data.message}`;
        messagesEl.appendChild(child);
      });
    });
}
*/

//getChats();


/*
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  var sendMsg = textInputEl.value.trim();
  if (sendMsg != 0 && sendMsg.length < 100) {
    socket.emit("chat_message", textInputEl.value);
    socket.emit("typing", "");
    textInputEl.value = "";
    submitBtn.classList.add("inv");
    console.log(typeof sendMsg);
    return false;
  }
  else {
    alert("error: text too big");
    textInputEl.value = "";
  }
});
*/

/*
// append the chat text message
socket.on("chat_message", function (msg) {
  let child = document.createElement("li");
  child.classList.add(
    "list-group-item",
    "list-group-item-dark",
    "overflow-auto",
    "d-flex",
    "border-0",
    "message-cl"
  );
  child.innerHTML = msg;
  messagesEl.appendChild(child);

  //scroll down
  window.scrollTo(0, document.body.clientHeight);
});
*/

// append text if someone is online
socket.on("is_online", function (username) {
 toastDiv.innerHTML = `${username}`;
  $('.toast').toast('show');
});


//sends usrsinfo
socket.emit("users", "");
//receives info about users
socket.on("users", function (data) {
 // console.log(data);
  usersNo.innerText = `${data.length}`;
});



const validUser = function (userInfo) {
  let userId = userInfo.trim();
  if (
    userId === "" ||
    userId === null ||
    userId === undefined ||
    userId === "undefined" ||
    userId.length > 10
  ) {
    let mat = Math.floor(Math.random() * 10) + 1;
    let str = Math.random().toString(36).substr(2, 3);
    return `user-${mat}${str}`;
  } else {
    return userInfo;
  }
};
// ask username
if (typeof localStorage.getItem("user-name") !== "undefined" && localStorage.getItem("user-name") !== null) {
  var username = localStorage.getItem("user-name");
//  textInputEl.setAttribute("placeholder", `type as ${username}`);
  socket.emit("username", username);
} else {
  var userPrompt = prompt("Please tell me your name");
  var username = validUser(userPrompt);
  localStorage.setItem("user-name", username);
//  textInputEl.setAttribute("placeholder", `type as ${username}`);
  socket.emit("username", username);
}
