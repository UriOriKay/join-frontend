let istogglePassword = false;
let emails = [];

/**
 * Initializes the login process by loading users, setting up the back button for signup,
 * and rendering the login elements.
 *
 * @return {Promise<void>} A promise that resolves when the login process is complete.
 */
async function initLogin() {
  // await loadUsers();
  renderLoginElements("Login");
}

/**
 * Renders the login elements based on the given boolean value.
 *
 * @param {boolean} bool - Determines whether to render login elements for "Login" or "Sign up".
 * @return {undefined} This function does not return a value.
 */
function renderLoginElements(action) {
  clearContent();
  setLoginFormSubmitBehaviour(action);
  createInputs(action);
  createButtons(action);
  setLoginHeadline(action);
  changeStyle(action);
}

function clearContent() {
  docID("inputs-con").textContent = "";
  docID("login-form-button-group").textContent = "";
  docID("signup-back-btn") ? docID("signup-back-btn").remove() : "";
}

function setLoginFormSubmitBehaviour(action) {
  if (action === "Sign up") {
    docID("login-form").onsubmit = function () {
      return false;
    };
  }
}

function createInputs(action) {
  if (action === "Login") {
    createInput("inputs-con", "imput-img-div", "email", "Email", "../assets/img/icon-mail.png", "input-con-email-input-id");
    createInput("inputs-con", "imput-img-div", "password", "Password", "../assets/img/icon-lock-closed.png", "input-con-password-input-id");
    new CustomCheckbox("inputs-con", "checkbox-remember-me", "Remember Me");
  } else if (action === "Sign up") {
    createInput("inputs-con", "imput-img-div", "text", "Name", "../assets/img/icon-person.png", "input-con-name-input-id");
    createInput("inputs-con", "imput-img-div", "email", "Email", "../assets/img/icon-mail.png", "input-con-email-input-id");
    createInput("inputs-con", "imput-img-div", "password", "Password", "../assets/img/icon-lock-closed.png", "input-con-password-input-id");
    createInput("inputs-con", "imput-img-div", "password", "Confirm Password", "../assets/img/icon-lock-closed.png", "input-con-confirm-password-input-id");
    docID("inputs-con-img").onclick = togglePassword;

    createPrivacyCheckbox();
  }
}

function createInput(containerId, divClass, inputType, labalText, imgSrc, inputId) {
  new Divinputimg(containerId, divClass, inputType, labalText, imgSrc, inputId, `${inputId}-div-id`);
  docID(inputId).required = true;
}

function createPrivacyCheckbox() {
  let custom_checkbox_accept_privacy = new CustomCheckbox("inputs-con", "checkbox-accept-privacy", "");
  docID("checkbox-accept-privacy").required = true;
  custom_checkbox_accept_privacy.text =
    new Span("labelcheckbox-accept-privacy", "", "", "I accept the") +
    new Anchor("labelcheckbox-accept-privacy", "", "", "../html/PrivacyPolicy.html", " Privacy Policy");
  docID("labelcheckbox-accept-privacy").onclick = checkAcception;
}

function createButtons(action) {
  if (action === "Login") {
    createButton("login-form-button-group", "login-button", "button font-t5",() => loginUser("Login"), "Log in");
    createButton("login-form-button-group", "guest-login-button", "secondary-button font-t5",() => loginUser("Guest"), "Guest Log in");
} else if (action === "Sign up") {
    createButton("login-form-button-group", "signup-form-btn", "button font-t5", saveInputValues, "Sign up");
    if (!docID("signup-back-btn")) {
      new BackBtn("login-item", "signup", function () {renderLoginElements("Login")});
    }
  }
}

function createButton(containerId, buttonId, buttonClass, onClickHandler, buttonText) {
  new Button(containerId, buttonId, buttonClass, onClickHandler, buttonText);
}

function setLoginHeadline(action) {
  docID("login-headline").textContent = action;
}


/**
 * Change the style of the page based on the given boolean value.
 *
 * @param {boolean} bool - The boolean value that determines the style change.
 * @return {void} This function does not return a value.
 */
function changeStyle(bool) {
  if (bool === "Sign up") {
    changeStyleSignup()
  } else {
    changeStyleLogin();
  }
}

function changeStyleSignup() {
  docID("button-group").style.display = "none";
  docID("logo-login").src = "../assets/img/Logo-middle_white.png";
  docID("login-main").style.backgroundColor = "var(--primary)";
  docID("inputs-con-div").style.justifyContent = "center";
  docID("login-form-button-group").style.justifyContent = "center";
  docID("signup-back-btn").style.display = "flex";
  docID("login-link-group").innerHTML = "";
  addLinks("link-group-a");
}

function changeStyleLogin() {
  docID("button-group").style.display = "flex";
  docID("login-main").style.backgroundColor = "var(--white)";
  docID("logo-login").src = "../assets/img/Logo-middle_blue.png";
  docID("login-link-group").innerHTML = "";
  addLinks();
}

function addLinks(className) {
  new Anchor("login-link-group", "", "className", "../html/PrivacyPolicy.html", "Private Policy");
  new Anchor("login-link-group", "", "className", "../html/LegalNotice.html", "Legal Notice");
}

/**
 * Navigates to the summary page by changing the window location.
 *
 * @param {type} No parameters are required for this function.
 * @return {type} No return value.
 */
function navToSummary() {
  window.location = "../html/summary.html";
}

/**
 * Save the input values from the signup form.
 *
 * @return {Promise<void>} The Promise that resolves when the input values are saved.
 */
async function saveInputValues() {
  let input_name_value = docID("input-con-name-input-id").value;
  let input_email_value = docID("input-con-email-input-id").value;
  let input_password_value = docID("input-con-password-input-id").value;
  let input_confirm_password_value = docID("input-con-confirm-password-input-id").value;
  let isCheckedBox = docID("checkbox-accept-privacy").checked

  if (isCheckSignupForm(input_name_value, input_email_value, input_password_value, input_confirm_password_value, isCheckedBox) 
    && isSamePassword(input_password_value, input_confirm_password_value)
  ) {
      response = await addNewUser(input_name_value, input_email_value, input_password_value, input_confirm_password_value);
      if (response.status === 201) {
        renderLoginElements("Login");
        new Confirmation("login-main", "You Signed Up successfully", false);
      }
      else {
      responseToJson = await response.json();
      docID("input-con-email-input-id").value = "";
      new Confirmation("login-main", responseToJson.email, false);
    }
  }
}

/**
 * Checks if the signup form is complete.
 *
 * @return {boolean} True if the signup form is complete, false otherwise.
 */
function isCheckSignupForm(input_name_value, input_email_value, input_password_value, input_confirm_password_value, isCheckedBox) {
  return (
    input_name_value != "" &&
    input_email_value != "" &&
    input_password_value != "" &&
    input_confirm_password_value != "" &&
    isCheckedBox
  );
}

/**
 * Checks if the password and confirm password values are the same.
 *
 * @return {boolean} true if the password and confirm password values are the same, false otherwise.
 */
function isSamePassword(input_password_value, input_confirm_password_value) {
  return input_password_value == input_confirm_password_value;
}

/**
 * Adds a new user to the system.
 *
 * @param {Object} newUser - The user object containing the following properties:
 *   - name (string): The name of the user.
 *   - mail (string): The email of the user.
 *   - nameTag (string): The generated name tag for the user.
 *   - password (string): The password of the user.
 * @return {Promise} - A promise that resolves once the new user has been added.
 */
async function addNewUser(input_name_value, input_email_value, input_password_value, input_confirm_password_value) {
  let newUser = {
    "name": input_name_value,
    "email": input_email_value,
    "password": input_password_value,
    "repeated_password": input_confirm_password_value
  };
    response = await postItem("user/register", newUser);
    return response;
}

/**
 * Checks if the given email is contained in the array of emails.
 *
 * @return {boolean} - Returns true if the email is contained in the array, false otherwise.
 */
function isContainedMails(input_email_value) {
  let emails = [];
  users.forEach((user) => {
    emails.push(user.mail);
  });
  return emails.includes(input_email_value) ? (bool = true) : (bool = false);
}


function loginUser(action) {
  active_user = "";
  let input_email_value = docID("input-con-email-input-id").value;
  let input_password_value = docID("input-con-password-input-id").value;

  action === "Login" ? handleLogin(input_email_value, input_password_value) : handleGuest();
}

async function handleLogin(input_email_value, input_password_value) {
  response = await postItem("user/login", {"username": input_email_value, "password": input_password_value});
  if (response.status === 200) {
    let response_user = await response.json();
    storage = docID("checkbox-remember-me").checked ? "localStorage" : "sessionStorage";
    allDataSave(response_user, storage);
    navToSummary();
  }
}



function handleGuest() {
  active_user = users[0];
  saveUser(active_user, false);
  navToSummary();
}


function saveUser(user, remember) {
  active_user = JSON.stringify(user);
  remember ? localUsersave(active_user) : sessionUsersave(active_user);
}

function showError(elementId, message, resetBoth = false) {
  docId(elementId).value = "";
  resetBoth ? (docId("input-con-password-input-id").value = "") : alert(message);
}


/**
 * Checks if the privacy checkbox is checked and enables or disables the signup form button accordingly.
 *
 * @param {type} docID - a function that takes an ID as a parameter and returns the corresponding element
 * @return {type} undefined - there is no return value for this function
 */
function checkAcception() {
  if (docID("checkbox-accept-privacy").checked) {
    docID("signup-form-btn").disabled = false;
  } else {
    docID("signup-form-btn").disabled = true;
  }
}

/**
 * Toggles the visibility of a password input field and updates the corresponding image.
 *
 * @param {string} id - The ID of the password input field.
 * @return {undefined} This function does not return a value.
 */
function togglePassword(id) {
  let img_id = id + "-img";
  if (istogglePassword) {
    docID(id).type = "text";
    docID(img_id).src = "../assets/img/showpassword.png";
    istogglePassword = false;
  } else {
    docID(id).type = "password";
    docID(img_id).src = "../assets/img/icon-lock-closed.png";
    istogglePassword = true;
  }
}
