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

//sends info about option clicked
const checkRad = function (item) {
  class question {
    constructor(number) {
      this.number = number;
      (this.a = []), (this.b = []), (this.c = []), (this.d = []);
    }
  }

  if (item.checked) {
    // console.log(`${item.getAttribute("option")} of question ${item.name}  is checked by ${typingEl.textContent}`);
    const obj = new question(item.name);
    if (item.getAttribute("option") === "a") {
      obj.a.push(typingEl.textContent);
      socket.emit("checked", obj);
    } else if (item.getAttribute("option") === "b") {
      obj.b.push(typingEl.textContent);
      socket.emit("checked", obj);
    } else if (item.getAttribute("option") === "c") {
      obj.c.push(typingEl.textContent);
      socket.emit("checked", obj);
    } else {
      obj.d.push(typingEl.textContent);
      socket.emit("checked", obj);
    }
  }
};

socket.on("checked", (data) => {
  console.log(data);
});

// append text if someone is online
socket.on("is_online", function (username) {
  toastDiv.innerHTML = `${username}`;
  $(".toast").toast("show");
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
if (
  typeof localStorage.getItem("user-name") !== "undefined" &&
  localStorage.getItem("user-name") !== null
) {
  var username = localStorage.getItem("user-name");
  //  textInputEl.setAttribute("placeholder", `type as ${username}`);
  typingEl.textContent = username;
  socket.emit("username", username);
} else {
  var userPrompt = prompt("Please tell me your name");
  var username = validUser(userPrompt);
  localStorage.setItem("user-name", username);
  typingEl.textContent = username;
  //  textInputEl.setAttribute("placeholder", `type as ${username}`);
  socket.emit("username", username);
}
