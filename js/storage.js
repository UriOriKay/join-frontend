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

/**
 * Retrieves a DOM element by its ID.
 *
 * @function docID
 * @param {string} id - The ID of the DOM element to retrieve.
 * @returns {HTMLElement} The DOM element with the specified ID.
 */
function docID(id) {
  return document.getElementById(id);
}

/**
 * Sends a GET request to the specified API endpoint.
 *
 * @async
 * @function getItem
 * @param {string} path - The API endpoint path.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<Response>} The response from the API.
 */
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

/**
 * Sends a POST request to the specified API endpoint with the given data.
 *
 * @async
 * @function postItem
 * @param {string} path - The API endpoint path.
 * @param {Object} data - The data to include in the POST request body.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<Response>} The response from the API.
 */
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

/**
 * Sends a login request to the API.
 *
 * @async
 * @function loginItem
 * @param {string} path - The API endpoint path.
 * @param {Object} data - The login credentials to include in the POST request body.
 * @returns {Promise<Response>} The response from the API.
 */
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

/**
 * Sends a PUT request to the specified API endpoint with the given data.
 *
 * @async
 * @function updateItem
 * @param {string} path - The API endpoint path.
 * @param {Object} data - The data to include in the PUT request body.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<Response>} The response from the API.
 */

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

/**
 * Sends a DELETE request to the specified API endpoint with the given data.
 *
 * @async
 * @function deleteItem
 * @param {string} path - The API endpoint path.
 * @param {Object} data - The data to include in the DELETE request body.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<Response>} The response from the API.
 */
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

/**
 * Initializes the application by setting the header and navbar.
 *
 * @async
 * @function init
 */
async function init() {
  setHeader();
}

/**
 * Renders the header and determines whether to display the guest or user version.
 *
 * @function setHeader
 */
function setHeader() {
  new Header();
  openNavMenu(); 
  if (localStorage.getItem("name") === null && sessionStorage.getItem("name") === null) {
    HeaderWithoutUser()
  } else {
    HeaderWithUser()
  }
}

/**
 * Configures the header for a guest user by hiding user-specific elements.
 *
 * @function HeaderWithoutUser
 */
function HeaderWithoutUser() {
  docID("header-name-tag").style.display = "none";
  docID("navbar-con").style.display = "none";
  docID("navbar").style.justifyContent = "flex-end";
}

/**
 * Configures the header for a logged-in user by displaying user-specific elements and loading user data.
 *
 * @function HeaderWithUser
 */

function HeaderWithUser() {
  docID("header-name-tag").style.display = "flex";
  if (sessionStorage.getItem("name")) {allDataLoad("sessionStorage")}
  else if (localStorage.getItem("name")) {allDataLoad("localStorage")}
  updateUserValues();
  docID("navbar").style.justifyContent = "space-between";
  docID("navbar-con").style.display = "flex";
}

/**
 * Activates a specific navigation link in the navbar.
 *
 * @function setNavBarActive
 * @param {string} con - The ID of the navigation link to activate.
 */
function setNavBarActive(con) {
  docID(con).classList.add("nav-active");
}

/**
 * Renders the navigation menu with links and legal notices.
 *
 * @function openNavMenu
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
 * Updates the user's name tag in the header with the current active user.
 *
 * @function updateUserValues
 */
function updateUserValues() {
  docID("header-name-tag").innerHTML = active_user.name_tag;
}

/**
 * Displays a "This field is required" message for the specified element.
 *
 * @function isRequiered
 * @param {string} id - The ID of the element where the message will be displayed.
 */

function isRequiered(id) {
  docID(id).innerHTML = /*html*/ `
    This field is required
  `;
}

/**
 * Sorts the global `contacts` array alphabetically by name.
 *
 * @function sortContacts
 */

function sortContacts() {
  contacts.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
}

/**
 * Calculates the number of tasks in each segment of the task board.
 *
 * @function getTasksAmounts
 * @returns {Array<number>} An array of task counts for each segment.
 */

function getTasksAmounts() {
  task_amounts = [];
  segements_array.forEach((e) => {
    task_amounts.push(tasks.filter((obj) => obj.container == e.con).length);
  });
  return task_amounts;
}

/**
 * Checks whether all required contact input fields are filled.
 *
 * @function checkEmptyInputs
 * @returns {boolean} `true` if all required fields are filled; otherwise, `false`.
 */
function checkEmptyInputs() {
  return (
    docID(`input-con-name-input-id`).value != "" &&
    docID(`input-con-email-input-id`).value != "" &&
    docID(`input-con-phone-input-id`).value != ""
  );
}


/**
 * Creates a template for a new contact and adds it to the global `contacts` array.
 *
 * @function addNewContact
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
 * Generates a random background color from the available colors for a new contact.
 *
 * @function setRandomColor
 * @returns {string} A randomly selected color.
 */

function setRandomColor() {
  let randomNumber = Math.floor(Math.random() * backgroundcolors.length);
  let color = backgroundcolors[randomNumber];
  return color;
}


/**
 * Loads all contacts from the API and updates the global `contacts` array.
 *
 * @async
 * @function loadContacts
 * @param {string} token - The authorization token for the API request.
 */

async function loadContacts(token) {
  contacts = await getItem("contact", token);
  contacts = await contacts.json();
}

/**
 * Loads all tasks from the API and updates the global `tasks` array.
 * 
 * Ensures that tasks without subtasks have empty arrays for subtasks and subtaskschecked.
 *
 * @async
 * @function loadTasks
 * @param {string} token - The authorization token for the API request.
 */
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

/**
 * Loads all categories from the API and updates the global `categorys` array.
 *
 * @async
 * @function loadCategorys
 * @param {string} token - The authorization token for the API request.
 */
// load all Categorys
async function loadCategorys(token) {
  categorys = await getItem("category", token);
  categorys = await categorys.json();
}

/**
 * Checks if a user is logged in and redirects to the login page if not.
 *
 * Workflow:
 * 1. Checks for a token in `localStorage` or `sessionStorage`.
 * 2. Validates the token with the API using `activeCheck`.
 * 3. If valid, loads user data; otherwise, redirects to the login page.
 *
 * @async
 * @function activeUser
 * @returns {string} The user's token if authentication is successful.
 */

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

/**
 * Validates the user's token with the API.
 *
 * @async
 * @function activeCheck
 * @param {string} token - The user's token.
 * @returns {boolean} `true` if the token is valid; otherwise, `false`.
 */

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

/**
 * Saves user data (token, name, and name tag) to the specified storage.
 *
 * @function allDataSave
 * @param {Object} data - The user data to save.
 * @param {string} storage - The storage type ("localStorage" or "sessionStorage").
 */

function allDataSave(data, storage) {
  eval(storage).setItem("token", data.token);
  eval(storage).setItem("name", data.name);
  eval(storage).setItem("name_tag", data.name_tag);
}

/**
 * Loads user data (token, name, and name tag) from the specified storage.
 *
 * @function allDataLoad
 * @param {string} storage - The storage type ("localStorage" or "sessionStorage").
 */

function allDataLoad(storage) {
  active_user = {
    name: eval(storage).getItem("name"),
    name_tag: eval(storage).getItem("name_tag"),
    token: eval(storage).getItem("token"),
  }
}

/**
 * Toggles the visibility of the header dropdown menu.
 *
 * @function showHeaderDropdown
 */

function showHeaderDropdown() {
  docID("dropdown-menu").classList.toggle("show");
  isShown = !isShown;
}

/**
 * Logs out the user by clearing their data from local and session storage and redirects to the login page.
 *
 * @function logout
 */

function logout() {
  localStorage.removeItem("name");
  localStorage.removeItem("name_tag");
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("name_tag");
  sessionStorage.removeItem("name");
  window.location.href = "./index.html";
}
