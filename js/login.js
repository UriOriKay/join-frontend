let isPasswordShown = false;

// Start the render process by define as login site
async function initLogin() {
  // await activeCheck(sessionStorage.getItem("token")) || await activeCheck(localStorage.getItem("token")) ? navToSummary() : null;
  renderLoginElements("Login");
}

// Render the login elements
function renderLoginElements(action) {
  clearContent(); // empty the HTML container for render and rerender process
  setLoginFormSubmitBehaviour(action); // set onsubmit for the Login form
  createInputs(action); // create the input fields for the forms
  createButtons(action); // create buttons for Login and Sign up
  setLoginHeadline(action); // set the headline for the forms
  changeStyle(action); // individual style for the forms
}

// empty the HTML container for render and rerender process
function clearContent() {
  docID("inputs-con").textContent = "";
  docID("login-form-button-group").textContent = "";
  docID("signup-back-btn") ? docID("signup-back-btn").remove() : "";
}

// set onsubmit for the Login form
function setLoginFormSubmitBehaviour(action) {
  action === "Sign up" ? docID("login-form").onsubmit = () => {return false} : null;
}

// create the input fields for the forms
function createInputs(action) {
  if (action === "Login") {
    createInput("email", "Email", "../assets/img/icon-mail.png", "input-con-email-input-id");
    createInput("password", "Password", "../assets/img/icon-lock-closed.png", "input-con-password-input-id");
    new CustomCheckbox("inputs-con", "checkbox-remember-me", "Remember Me");
  } else if (action === "Sign up") {
    createInput("text", "Name", "../assets/img/icon-person.png", "input-con-name-input-id");
    createInput("email", "Email", "../assets/img/icon-mail.png", "input-con-email-input-id");
    createInput("password", "Password", "../assets/img/icon-lock-closed.png", "input-con-password-input-id");
    createInput("password", "Confirm Password", "../assets/img/icon-lock-closed.png", "input-con-confirm-password-input-id");
    docID("inputs-con-img").onclick = togglePassword; 

    createPrivacyCheckbox(); // // create checkbox for privacy accept in Sign up
  }
}

// create input fields with image with help of Divinputimg class
function createInput(inputType, labalText, imgSrc, inputId) {
  new Divinputimg("inputs-con", "imput-img-div", inputType, labalText, imgSrc, inputId, `${inputId}-div-id`);
  docID(inputId).required = true;
}

// create checkbox for privacy accept in Sign up
function createPrivacyCheckbox() {
  let custom_checkbox_accept_privacy = new CustomCheckbox("inputs-con", "checkbox-accept-privacy", "");
  docID("checkbox-accept-privacy").required = true;
  custom_checkbox_accept_privacy.text =
    new Span("labelcheckbox-accept-privacy", "", "", "I accept the") +
    new Anchor("labelcheckbox-accept-privacy", "", "", "../html/PrivacyPolicy.html", " Privacy Policy");
  docID("labelcheckbox-accept-privacy").onclick = checkAcception;  // make form sendable
}

// create buttons for Login and Sign up
function createButtons(action) {
  if (action === "Login") {
    createButton("login-button", "button font-t5",() => loginUser("Login"), "Log in");
    createButton("guest-login-button", "secondary-button font-t5",() => loginUser("Guest"), "Guest Log in");
} else if (action === "Sign up") {
    createButton("signup-form-btn", "button font-t5", saveInputValues, "Sign up");
    if (!docID("signup-back-btn")) {
      new BackBtn("login-item", "signup", function () {renderLoginElements("Login")});
    }
  }
}

// create buttons with help of Button class
function createButton(buttonId, buttonClass, onClickHandler, buttonText) {
  new Button("login-form-button-group", buttonId, buttonClass, onClickHandler, buttonText);
}

// set the headline for the forms
function setLoginHeadline(action) {
  docID("login-headline").textContent = action;
}

// individual style for the forms
function changeStyle(action) {
  action === "Sign up" ? changeStyleSignup() :  changeStyleLogin();
}

// individual style for the Sign up form
function changeStyleSignup() {
  docID("button-group").style.display = "none";
  docID("logo-login").src = "../assets/img/Logo-middle_white.png";
  docID("login-main").style.backgroundColor = "var(--primary)";
  docID("inputs-con-div").style.justifyContent = "center";
  docID("login-form-button-group").style.justifyContent = "center";
  docID("signup-back-btn").style.display = "flex";
  docID("login-link-group").innerHTML = "";
  addLinks("a"); // create the links for privacy policy and legal notice
}

// individual style for the Login form
function changeStyleLogin() {
  docID("button-group").style.display = "flex";
  docID("login-main").style.backgroundColor = "var(--white)";
  docID("logo-login").src = "../assets/img/Logo-middle_blue.png";
  docID("login-link-group").innerHTML = "";
  addLinks("b");// create the links for privacy policy and legal notice
}

// create the links for privacy policy and legal notice
function addLinks(a) {
  new Anchor("login-link-group", "", `link-group-${a}`, "../html/PrivacyPolicy.html", "Private Policy");
  new Anchor("login-link-group", "", `link-group-${a}`, "../html/LegalNotice.html", "Legal Notice");
}

// send the user to the summary page
function navToSummary() {
  window.location = "../html/summary.html";
}

// store the input values and start the register process
async function saveInputValues() {
  let input_name_value = docID("input-con-name-input-id").value;
  let input_email_value = docID("input-con-email-input-id").value;
  let input_password_value = docID("input-con-password-input-id").value;
  let input_confirm_password_value = docID("input-con-confirm-password-input-id").value;
  let isCheckedBox = docID("checkbox-accept-privacy").checked
  InputValuesToUser(input_name_value, input_email_value, input_password_value, input_confirm_password_value, isCheckedBox)
  
}

// start the register process, by checking the input values and register by Api call
async function InputValuesToUser(input_name_value, input_email_value, input_password_value, input_confirm_password_value, isCheckedBox) {
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

// check if the necessary input values are valid
function isCheckSignupForm(input_name_value, input_email_value, input_password_value, input_confirm_password_value, isCheckedBox) {
  return (
    input_name_value != "" &&
    input_email_value != "" &&
    input_password_value != "" &&
    input_confirm_password_value != "" &&
    isCheckedBox
  );
}

// check is the password and confirm password are the same
function isSamePassword(input_password_value, input_confirm_password_value) {
  return input_password_value == input_confirm_password_value;
}

// create the Json for the API call to register a new user and start Api Call
async function addNewUser(input_name_value, input_email_value, input_password_value, input_confirm_password_value) {
  let newUser = {
    "name": input_name_value,
    "email": input_email_value,
    "password": input_password_value,
    "repeated_password": input_confirm_password_value
  };
    response = await postItem("user/register", newUser); // start Api Call
    return response;
}

// init the login process, by store the input values and start the login process by checking is Guest Login
function loginUser(action) {
  active_user = "";
  let input_email_value = docID("input-con-email-input-id").value;
  let input_password_value = docID("input-con-password-input-id").value;

  action === "Login" ? handleLogin(input_email_value, input_password_value) : handleGuest();
}

// API Clall for login
async function handleLogin(input_email_value, input_password_value) {
  console.log('handle login :>> ');
  response = await loginItem("user/login", {"email": input_email_value, "password": input_password_value});
  console.log('response :>> ', response);
  if (response.status === 200) {
    let response_user = await response.json();
    storage = docID("checkbox-remember-me").checked ? "localStorage" : "sessionStorage";
    allDataSave(response_user, storage);
    navToSummary();
  } else {
    let response_user = await response.json();
    message = response_user.error;
    new Confirmation("login-main", message, false);
  }
}

// set the Parameter for Guest Login
function handleGuest() {
  handleLogin("guest@guest.de", "guest");
}

//make form sendable
function checkAcception() {
  docID("signup-form-btn").disabled = !docID("checkbox-accept-privacy").checked;
}

//toogle password visiblity
function togglePassword(id) {
  let img_id = id + "-img";
  docID(id).type = isPasswordShown ? "text" : "password";
  docID(img_id).src = isPasswordShown ? "../assets/img/showpassword.png" : "../assets/img/icon-lock-closed.png";
  isPasswordShown = !isPasswordShown;
}
