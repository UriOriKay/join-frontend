let contact_boxes = [];
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

/**
 * The token used for remote storage authentication.
 * @type {string}
 */
// const STORAGE_TOKEN = "CA66J9VJZ010MHTW4IAFVKAPKFNFFP7F129MWRPE";

/**
 * The URL for remote storage.
 * @type {string}
 */
const BASE_URL = "https://join-5ffbe-default-rtdb.europe-west1.firebasedatabase.app/";
const BASE_URL_2 = "http://127.0.0.1:8000/api/"

/**
 * Sets a key-value pair in remote storage.
 *
 * This function sends a POST request to the remote storage URL with the provided key and value.
 *
 * @param {string} key - The key for the data.
 * @param {any} value - The value to be stored.
 * @returns {Promise<Object>} - A Promise that resolves to the response data.
 */
async function setItem(path, data) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

let HttpStatus;
async function postItem(path, data) {
    let response = await fetch(BASE_URL_2 + path +"/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  return (response)
}

//to get all Tasks
async function getItem2(path, token) {
  let response = await fetch(BASE_URL_2 + path + "/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token " + token
    },
  });
  return (response);
}

async function setItem2(path, data, token) {
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


async function getSummaryItem(path, token) {
  let response = await fetch(BASE_URL_2 + path + "/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token " + token
    },
  });
  return (responseToJson = await response.json());
}





/**
 * Retrieves an item from the storage based on the given key.
 *
 * @param {string} key - The key of the item to retrieve.
 * @return {Promise<any>} A promise that resolves to the value of the retrieved item.
 */
async function getItem(path) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  });
  return (responseToJson = await response.json());
}

/**
 * Retrieves an element from the document with the specified ID.
 *
 * @param {string} id - The ID of the element to retrieve.
 * @return {Element | null} The element with the specified ID, or null if no
 * element was found.
 */
function docID(id) {
  return document.getElementById(id);
}

/**
 * Initializes the function.
 *
 * @return {Promise<void>} Promise that resolves when the initialization is complete.
 */
async function init() {
  setHeader();
}

/**
 * Sets the header of the page.
 *
 * @return {undefined} This function does not return a value.
 */
function setHeader() {
  new Header();
  openNavMenu(); 
  if (localStorage.getItem("name") === null && sessionStorage.getItem("name") === null) {
    docID("header-name-tag").style.display = "none";
    docID("navbar-con").style.display = "none";
    docID("navbar").style.justifyContent = "flex-end";
  } else {
    docID("header-name-tag").style.display = "flex";
    if (sessionStorage.getItem("name")) {sessionUserload()}
    else if (localStorage.getItem("name")) {localUserload()}
    updateUserValues();
    docID("navbar").style.justifyContent = "space-between";
    docID("navbar-con").style.display = "flex";
  }
}

/**
 * Sets the navigation bar to active for the given container.
 *
 * @param {string} con - The container ID or class.
 * @return {void} This function does not return a value.
 */
function setNavBarActive(con) {
  docID(con).classList.add("nav-active");
}

/**
 * Opens the navigation menu by creating and appending several elements to the DOM.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
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


/**
 * Updates the user values.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function updateUserValues() {
  docID("header-name-tag").innerHTML = active_user.name_tag;
}

/**
 * Sets the innerHTML of the element with the given id to display a message indicating that the field is required.
 *
 * @param {string} id - The id of the element to update.
 * @return {void} This function does not return anything.
 */
function isRequiered(id) {
  docID(id).innerHTML = /*html*/ `
    This field is required
  `;
}

/**
 * Creates a contact box and appends it to the given parent element.
 *
 * @param {HTMLElement} parent - The parent element to append the contact box to.
 * @return {void} This function does not return a value.
 */
function createContactBox(parent) {
  let parentArray = contact_boxes; //später Parameter
  contacts.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
}

/**
 * Calculates and returns the amounts of tasks for each segment in the `segements_array`.
 *
 * @return {Array} An array containing the amounts of tasks for each segment.
 */
function getTasksAmounts() {
  task_amounts = [];
  segements_array.forEach((e) => {
    task_amounts.push(tasks.filter((obj) => obj.container == e.con).length);
  });
  return task_amounts;
}

 /**
 * Checks if the input fields for name, email, and phone are not empty.
 *
 * @return {boolean} Returns true if all input fields are not empty, otherwise false.
 */
function checkEmptyInputs() {
  return (
    input_name.value != "" &&
    input_email.value != "" &&
    !input_phone.value != ""
  );
}

/**
 * Adds a new contact to the contacts array.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
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



/**
 * Generates a random color from the 'backgroundcolors' array and returns it.
 * 
 *
 * @return {string} The randomly generated color.
 */
function setRandomColor() {
  let randomNumber = Math.floor(Math.random() * backgroundcolors.length);
  let color = backgroundcolors[randomNumber];
  return color;
}

/**
 * Generates a name tag based on the given name.
 * 
 * @param {string} name - The name to generate the name tag from.
 * @return {string} The generated name tag.
 */
function setNameTag(name) {
  let currentName = name;
  let nameArray = currentName.split(" ");
  let nameTag = nameArray[0].charAt(0);
  nameTag += nameArray[nameArray.length - 1].charAt(0);
  nameTag = nameTag.toUpperCase();
  return nameTag;
}

/**
 * Loads users from storage and parses them into an object.
 *
 * @return {Promise<void>} A promise that resolves when the users are loaded and parsed.
 */
async function loadUsers() {
  users = await getItem("users");
}

/**
 * Loads the contacts by parsing the JSON data retrieved from the "contacts" item.
 *
 * @return {Promise<void>} A Promise that resolves once the contacts are loaded.
 */
async function loadContacts(token) {
  contacts = await getItem2("contact", token);
  contacts = await contacts.json();
}

/**
 * Loads tasks from storage and returns them.
 *
 * @return {Promise<Array>} The tasks retrieved from storage.
 */
async function loadTasks(token) {
  response = await getItem2("task", token);
  tasks = await response.json();
  console.log(tasks);
  tasks.forEach((t)=>{
    if(!t.subtasks ){
      t.subtasks = [];
      t.subtaskschecked = [];
    }
  })
}



/**
 * Loads the categorys asynchronously.
 *
 * @return {Promise<void>} A Promise that resolves with no value.
 */
async function loadCategorys(token) {
  categorys = await getItem2("category", token);
  categorys = await categorys.json();
}

/**
 * Checks if there is an active user.
 *
 * @return {boolean} Returns true if there is an active user, otherwise returns false.
 */
async function activeUser() {
  if (localStorage.getItem("token") === null) {
    if (sessionStorage.getItem("token") === null) {
      window.location.href = "../html/index.html";
    } else {
      await activeCheck(sessionStorage.getItem("token")) ? sessionUserload() : window.location.href = "../html/index.html";
    }
  } else {
    await activeCheck(localStorage.getItem("token")) ? localUserload() : window.location.href = "../html/index.html";
  }
}

async function activeCheck(token) {
  response = await getItem2("user/active", token);
  if (response.status === 200) {
    return true;
  }
  return false
}



/**
 * Saves the active user to the local storage.
 *
 * @param {string} user - The user to be saved.
 */
function localUsersave(user) {
  localStorage.setItem("activeuser", user);
}


// function localDataSave(data) {
//   localStorage.setItem("token", data.token);
//   localStorage.setItem("name", data.name);
//   localStorage.setItem("name_tag", data.nametag);
// }

// function sessionDataSave(data) {
//   sessionStorage.setItem("token", data.token);
//   sessionStorage.setItem("name", data.name);
//   sessionStorage.setItem("name_tag", data.nametag);
// }

function allDataSave(data, storage) {
  eval(storage).setItem("token", data.token);
  eval(storage).setItem("name", data.name);
  eval(storage).setItem("name_tag", data.name_tag);
}



/**
 * Saves the active user to the session storage.
 *
 * @param {string} user - The user to be saved.
 */
function sessionUsersave(user) {
  sessionStorage.setItem("activeuser", user);
}

/**
 * Loads the active user from local storage.
 *
 * @return {undefined} There is no return value.
 */
function localUserload() {
  active_user = {
    name: localStorage.getItem("name"),
    name_tag: localStorage.getItem("name_tag"),
    token: localStorage.getItem("token"),
  }
}

/**
 * Load the active user from session storage.
 *
 * @return {undefined} The function does not return a value.
 */
function sessionUserload() {
  active_user = {
    name: sessionStorage.getItem("name"),
    name_tag: sessionStorage.getItem("name_tag"),
    token: sessionStorage.getItem("token"),
  }
}

/**
 * Toggles the visibility of the header dropdown menu.
 *
 * @param {boolean} isShown - Indicates whether the dropdown menu is currently shown.
 * @return {void} No return value.
 */
function showHeaderDropdown() {
  if (!isShown) {
    docID("dropdown-menu").classList.add("show");
  } else {
    docID("dropdown-menu").classList.remove("show");
  }
  isShown = !isShown;
}

/**
 * Logs out the user by removing the "activeuser" item from the local storage
 * and session storage. Then redirects the user to the index.html page.
 *
 * @return {undefined} No return value.
 */
function logout() {
  if (localStorage.getItem("activeuser") != null) {
    localStorage.removeItem("activeuser");
  }
  if (sessionStorage.getItem("activeuser") != null) {
    sessionStorage.removeItem("activeuser");
  }

  window.location.href = "./index.html";
}
