let filtered_contacts = [];
let users = [];
let contacts = [];
let categorys = [];
let tasks = [];
let task_amounts = [];
let input_name;
let input_email;
let input_phone;
let input_password;
let input_confirm_password;
let newContact;
let active_user;
let isShown = false;

let segements_array = [
  {
    con: "to-do-con",
    headline: "To do",
  },
  {
    con: "in-progress-con",
    headline: "In progress",
  },
  {
    con: "await-feedback-con",
    headline: "Await feedback",
  },
  {
    con: "done-con",
    headline: "Done",
  },
];

const BASE_URL_2 = "http://127.0.0.1:8000/api/"

// function to shorten document.getElementById
function docID(id) {
  return document.getElementById(id);
}

// API Call for get
async function getItem(path, token) {
  try{
    let response = await fetch(BASE_URL_2 + path + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Token " + token
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (response);
  }
  catch (error) {
    console.log("Error during fetch:", error);
  }
}

// API Call for post
async function postItem(path, data, token) {
  let response = await fetch(BASE_URL_2 + path + "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token " + token
    },
    body: JSON.stringify(data),
  });
  return (response);
}

async function loginItem(path, data) {
  let response = await fetch(BASE_URL_2 + path + "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (response);
}

//API Call for put
async function updateItem(path, data, token) {
  let response = await fetch(BASE_URL_2 + path + "/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token " + token
    },
    body: JSON.stringify(data),
  });
  return (response);
}

// API Call for delete
async function deleteItem(path, data, token) {
  let response = await fetch(BASE_URL_2 + path + "/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token " + token
    },
    body: JSON.stringify(data),
  });
  return (response);
}

// init function to set Header and navbar
async function init() {
  setHeader();
}

// render Header and start Navbar
function setHeader() {
  new Header();
  openNavMenu(); 
  if (localStorage.getItem("name") === null && sessionStorage.getItem("name") === null) {
    HeaderWithoutUser()
  } else {
    HeaderWithUser()
  }
}

// Header with Guest user
function HeaderWithoutUser() {
  docID("header-name-tag").style.display = "none";
  docID("navbar-con").style.display = "none";
  docID("navbar").style.justifyContent = "flex-end";
}

// Header with User
function HeaderWithUser() {
  docID("header-name-tag").style.display = "flex";
  if (sessionStorage.getItem("name")) {allDataLoad("sessionStorage")}
  else if (localStorage.getItem("name")) {allDataLoad("localStorage")}
  updateUserValues();
  docID("navbar").style.justifyContent = "space-between";
  docID("navbar-con").style.display = "flex";
}

// set Categotry active at navbar
function setNavBarActive(con) {
  docID(con).classList.add("nav-active");
}

// render the navbar
function openNavMenu() {
  new Div("navbar", "navbar-con");
  new MenuLink("navbar-con", "summary");
  new MenuLink("navbar-con", "add_task");
  new MenuLink("navbar-con", "board");
  new MenuLink("navbar-con", "contacts");
  new Div("navbar", "navbar-bottom");
  new Anchor("navbar-bottom","nav-privacy","", "../html/PrivacyPolicy.html", "Privacy Policy");
  new Anchor("navbar-bottom","nav-legal","","../html/LegalNotice.html","Legal Notice");
}

// set name Tag in Header
function updateUserValues() {
  docID("header-name-tag").innerHTML = active_user.name_tag;
}

// the the requiered message
function isRequiered(id) {
  docID(id).innerHTML = /*html*/ `
    This field is required
  `;
}

//sort contacts by name
function sortContacts() {
  contacts.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
}

// get the amount of tasks in each segement
function getTasksAmounts() {
  task_amounts = [];
  segements_array.forEach((e) => {
    task_amounts.push(tasks.filter((obj) => obj.container == e.con).length);
  });
  return task_amounts;
}

// check if all inputs are filled
function checkEmptyInputs() {
  return (
    docID(`input-con-name-input-id`).value != "" &&
    docID(`input-con-email-input-id`).value != "" &&
    docID(`input-con-phone-input-id`).value != ""
  );
}


// Template for new Contact
function addNewContact() {
  newContact = {
    name: "",
    color: setRandomColor(),
    email: "",
    phone: "",
    name_tag: "??",
  };

  contacts.push(newContact);
}

// set Random Color for a new Contact
function setRandomColor() {
  let randomNumber = Math.floor(Math.random() * backgroundcolors.length);
  let color = backgroundcolors[randomNumber];
  return color;
}


// load all contacts
async function loadContacts(token) {
  contacts = await getItem("contact", token);
  contacts = await contacts.json();
}

// load all tasks and clear Subtacks if there are none
async function loadTasks(token) {
  response = await getItem("task", token);
  tasks = await response.json();
  tasks.forEach((t)=>{
    if(!t.subtasks ){
      t.subtasks = [];
      t.subtaskschecked = [];
    }
  })
}

// load all Categorys
async function loadCategorys(token) {
  categorys = await getItem("category", token);
  categorys = await categorys.json();
}

// check if there is active user and return the token or redirect to index.html
async function activeUser() {
  if (localStorage.getItem("token") === null) {
    if (sessionStorage.getItem("token") === null) {
      window.location.href = "../html/index.html";
    } else {
      let token = sessionStorage.getItem("token");
      await activeCheck(sessionStorage.getItem("token")) ? allDataLoad("sessionStorage") : window.location.href = "../html/index.html";
      return token;
    }
  } else {
    let token = localStorage.getItem("token");
    await activeCheck(localStorage.getItem("token")) ? allDataLoad("localStorage") : window.location.href = "../html/index.html";
    return token;
  }
}

// check the user with the API
async function activeCheck(token) {
  try{ 
    response = await getItem("user/active", token);
    if (response.status === 200) {
      return true;
    }
  }
  catch (error) {
    return;
  }
}

// save the user data in session or local storage
function allDataSave(data, storage) {
  eval(storage).setItem("token", data.token);
  eval(storage).setItem("name", data.name);
  eval(storage).setItem("name_tag", data.name_tag);
}

// load the user data from session or local storage
function allDataLoad(storage) {
  active_user = {
    name: eval(storage).getItem("name"),
    name_tag: eval(storage).getItem("name_tag"),
    token: eval(storage).getItem("token"),
  }
}


function showHeaderDropdown() {
  docID("dropdown-menu").classList.toggle("show");
  isShown = !isShown;
}


function logout() {
  localStorage.removeItem("activeuser");
  sessionStorage.removeItem("activeuser");
  window.location.href = "./index.html";
}
