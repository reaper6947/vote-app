var socket = io.connect();
var typingEl = document.getElementById("main-head-i");
var usersNo = document.getElementById("user-txt");
var toastDiv = document.getElementById("joinedToast");
//gets previous messsages from server


function getChats() {
  fetch("/votedata")
    .then((data) => {
      return data.json();
    })
    .then((json) => {
      json.map((data) => {
        const li = document.createElement("li");
        li.classList.add("list-inline-item","m-0","p-0");
        li.setAttribute(
          "id",
          `${data.name} ` + "-" + `${data.option}${data.question}`
        );
        li.textContent = data.name;
        const mainList = document.getElementById(`${data.option}${data.question}`);
      return  mainList.appendChild(li);
      });
    });
}


getChats();

//sends info about option clicked
const checkSend = function (item) {
  class questionObj {
    constructor(question, option, add) {
      this.name = typingEl.textContent,
        this.add = add,
        this.question = question;
      this.option = option;
    }
  }

  if (item.checked) {
    // console.log(item);
    if (!item.classList.contains(`${typingEl.textContent}`)) {
      let obj = new questionObj(item.name, item.value, true);
      item.classList.add(`${typingEl.textContent}`);
      socket.emit("checked", obj);
     // console.log(obj);
    }
  } else {
    if (item.classList.contains(`${typingEl.textContent}`)) {
      let obj = new questionObj(item.name, item.value, false);
      item.classList.remove(`${typingEl.textContent}`);
      socket.emit("checked", obj);
    //  console.log(obj);
    }
  }
};

const checker = function (data) {
  if (data.add === true) {
    console.log("true");
    const li = document.createElement("li");
    li.classList.add("list-inline-item","m-0","p-0");
    li.setAttribute(
      "id",
      `${data.name} ` + "-" + `${data.option}${data.question}`
    );
    li.textContent = data.name;
    const mainList = document.getElementById(`${data.option}${data.question}`);
  return  mainList.appendChild(li);
  } else {
    let item = document.getElementById(
      `${data.name} ` + "-" + `${data.option}${data.question}`
    );
  return  item.parentNode.removeChild(item);
  }
};

socket.on("checked",function (dat)  {
  checker(dat);
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
