let isPasswordShown = false;

/**
 * Initializes the login process by rendering the login page elements.
 *
 * @async
 * @function initLogin
 */

async function initLogin() {
  // await activeCheck(sessionStorage.getItem("token")) || await activeCheck(localStorage.getItem("token")) ? navToSummary() : null;
  renderLoginElements("Login");
}

/**
 * Renders the login or sign-up elements based on the specified action.
 *
 * Workflow:
 * 1. Clears existing content using `clearContent`.
 * 2. Sets the form submission behavior based on the action.
 * 3. Creates input fields and buttons for the form.
 * 4. Sets the headline and applies specific styles for the action.
 *
 * @function renderLoginElements
 * @param {string} action - Specifies whether to render for "Login" or "Sign up".
 */
function renderLoginElements(action) {
  clearContent(); // empty the HTML container for render and rerender process
  setLoginFormSubmitBehaviour(action); // set onsubmit for the Login form
  createInputs(action); // create the input fields for the forms
  createButtons(action); // create buttons for Login and Sign up
  setLoginHeadline(action); // set the headline for the forms
  changeStyle(action); // individual style for the forms
}

/**
 * Clears the HTML container for rendering or re-rendering login elements.
 *
 * @function clearContent
 */

function clearContent() {
  docID("inputs-con").textContent = "";
  docID("login-form-button-group").textContent = "";
  docID("signup-back-btn") ? docID("signup-back-btn").remove() : "";
}

/**
 * Sets the form submission behavior for the login form.
 *
 * - Disables the default form submission for the "Sign up" action.
 *
 * @function setLoginFormSubmitBehaviour
 * @param {string} action - Specifies whether the form is for "Login" or "Sign up".
 */

function setLoginFormSubmitBehaviour(action) {
  action === "Sign up" ? docID("login-form").onsubmit = () => {return false} : null;
}

/**
 * Creates the input fields for the login or sign-up form based on the action.
 *
 * Workflow:
 * 1. For "Login": Creates email and password input fields and a "Remember Me" checkbox.
 * 2. For "Sign up": Creates input fields for name, email, password, confirm password, and a privacy checkbox.
 *
 * @function createInputs
 * @param {string} action - Specifies whether to create inputs for "Login" or "Sign up".
 */

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

/**
 * Creates an input field with an associated label and icon.
 *
 * @function createInput
 * @param {string} inputType - The type of the input field (e.g., "text", "email", "password").
 * @param {string} labalText - The label text for the input field.
 * @param {string} imgSrc - The path to the icon image for the input field.
 * @param {string} inputId - The ID for the input field.
 */

function createInput(inputType, labalText, imgSrc, inputId) {
  new Divinputimg("inputs-con", "imput-img-div", inputType, labalText, imgSrc, inputId, `${inputId}-div-id`);
  docID(inputId).required = true;
}

/**
 * Creates a checkbox for privacy policy acceptance during sign-up.
 *
 * Workflow:
 * 1. Adds a required checkbox for privacy acceptance.
 * 2. Appends a link to the privacy policy.
 * 3. Adds an event listener to enable the form submission button when checked.
 *
 * @function createPrivacyCheckbox
 */

function createPrivacyCheckbox() {
  let custom_checkbox_accept_privacy = new CustomCheckbox("inputs-con", "checkbox-accept-privacy", "");
  docID("checkbox-accept-privacy").required = true;
  custom_checkbox_accept_privacy.text =
    new Span("labelcheckbox-accept-privacy", "", "", "I accept the") +
    new Anchor("labelcheckbox-accept-privacy", "", "", "../html/PrivacyPolicy.html", " Privacy Policy");
  docID("labelcheckbox-accept-privacy").onclick = checkAcception;  // make form sendable
}

/**
 * Creates the action buttons for the login or sign-up form.
 *
 * Workflow:
 * 1. For "Login": Creates login and guest login buttons.
 * 2. For "Sign up": Creates a sign-up button and a back button to return to the login form.
 *
 * @function createButtons
 * @param {string} action - Specifies whether to create buttons for "Login" or "Sign up".
 */

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

/**
 * Creates a button using the `Button` class.
 *
 * @function createButton
 * @param {string} buttonId - The ID of the button.
 * @param {string} buttonClass - The CSS classes for the button.
 * @param {Function} onClickHandler - The function to execute on button click.
 * @param {string} buttonText - The text to display on the button.
 */

function createButton(buttonId, buttonClass, onClickHandler, buttonText) {
  new Button("login-form-button-group", buttonId, buttonClass, onClickHandler, buttonText);
}

/**
 * Sets the headline text for the login or sign-up form.
 *
 * @function setLoginHeadline
 * @param {string} action - The text to set as the headline (e.g., "Login" or "Sign up").
 */

function setLoginHeadline(action) {
  docID("login-headline").textContent = action;
}

/**
 * Applies specific styles to the form based on the action ("Login" or "Sign up").
 *
 * @function changeStyle
 * @param {string} action - Specifies whether the styles are for "Login" or "Sign up".
 */

function changeStyle(action) {
  action === "Sign up" ? changeStyleSignup() :  changeStyleLogin();
}

/**
 * Applies specific styles to the sign-up form.
 *
 * Workflow:
 * 1. Hides the login button group.
 * 2. Updates the logo, background color, and input container alignment.
 * 3. Adds links for the privacy policy and legal notice.
 *
 * @function changeStyleSignup
 */

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

/**
 * Applies specific styles to the login form.
 *
 * Workflow:
 * 1. Displays the login button group.
 * 2. Updates the logo, background color, and adds links for the privacy policy and legal notice.
 *
 * @function changeStyleLogin
 */

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

/**
 * Collects input values from the sign-up form and initiates the registration process.
 *
 * @async
 * @function saveInputValues
 */

async function saveInputValues() {
  let input_name_value = docID("input-con-name-input-id").value;
  let input_email_value = docID("input-con-email-input-id").value;
  let input_password_value = docID("input-con-password-input-id").value;
  let input_confirm_password_value = docID("input-con-confirm-password-input-id").value;
  let isCheckedBox = docID("checkbox-accept-privacy").checked
  InputValuesToUser(input_name_value, input_email_value, input_password_value, input_confirm_password_value, isCheckedBox)
  
}

/**
 * Processes input values and registers a new user if validation passes.
 *
 * Workflow:
 * 1. Validates the input values and password confirmation.
 * 2. Sends a registration request to the API.
 * 3. If successful: Renders the login form and displays a confirmation message.
 * 4. If unsuccessful: Displays an error message.
 *
 * @async
 * @function InputValuesToUser
 * @param {string} input_name_value - The user's name.
 * @param {string} input_email_value - The user's email address.
 * @param {string} input_password_value - The user's password.
 * @param {string} input_confirm_password_value - The user's confirmed password.
 * @param {boolean} isCheckedBox - Whether the privacy checkbox is checked.
 */

async function InputValuesToUser(input_name_value, input_email_value, input_password_value, input_confirm_password_value, isCheckedBox) {
  if (isCheckSignupForm(input_name_value, input_email_value, input_password_value, input_confirm_password_value, isCheckedBox) 
    && isSamePassword(input_password_value, input_confirm_password_value)
  ) {
      response = await addNewUser(input_name_value, input_email_value, input_password_value, input_confirm_password_value);
      if (response.status === 201) {
        renderLoginElements("Login");
        console.log('response :>> ', response);
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
 * Validates the required fields in the sign-up form.
 *
 * @function isCheckSignupForm
 * @param {string} input_name_value - The user's name.
 * @param {string} input_email_value - The user's email address.
 * @param {string} input_password_value - The user's password.
 * @param {string} input_confirm_password_value - The user's confirmed password.
 * @param {boolean} isCheckedBox - Whether the privacy checkbox is checked.
 * @returns {boolean} `true` if all fields are valid; otherwise, `false`.
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
 * Checks whether the password and confirm password fields match.
 *
 * @function isSamePassword
 * @param {string} input_password_value - The user's password.
 * @param {string} input_confirm_password_value - The user's confirmed password.
 * @returns {boolean} `true` if the passwords match; otherwise, `false`.
 */

function isSamePassword(input_password_value, input_confirm_password_value) {
  return input_password_value == input_confirm_password_value;
}

/**
 * Registers a new user by sending a JSON payload to the API.
 *
 * @async
 * @function addNewUser
 * @param {string} input_name_value - The user's name.
 * @param {string} input_email_value - The user's email address.
 * @param {string} input_password_value - The user's password.
 * @param {string} input_confirm_password_value - The user's confirmed password.
 * @returns {Promise<Response>} The response from the API.
 */
async function addNewUser(input_name_value, input_email_value, input_password_value, input_confirm_password_value) {
  let newUser = {
    "name": input_name_value,
    "email": input_email_value,
    "password": input_password_value,
    "repeated_password": input_confirm_password_value
  };
    response = await loginItem("user/register", newUser); // start Api Call
    return response;
}

/**
 * Initiates the login process based on the action ("Login" or "Guest").
 *
 * @function loginUser
 * @param {string} action - The login type ("Login" or "Guest").
 */

function loginUser(action) {
  active_user = "";
  let input_email_value = docID("input-con-email-input-id").value.toLowerCase();
  let input_password_value = docID("input-con-password-input-id").value;

  action === "Login" ? handleLogin(input_email_value, input_password_value) : handleGuest();
}

/**
 * Sends a login request to the API and handles the response.
 *
 * Workflow:
 * 1. Sends a login request with the provided email and password.
 * 2. If successful:
 *    - Saves the user data to local or session storage.
 *    - Redirects to the summary page.
 * 3. If unsuccessful: Displays an error message.
 *
 * @async
 * @function handleLogin
 * @param {string} input_email_value - The user's email address.
 * @param {string} input_password_value - The user's password.
 */
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
    docID('confirmation-id-div') ? docID('confirmation-id-div').remove() : "";
    new Confirmation("login-main", message, false);
  }
}

/**
 * Initiates a guest login process with predefined credentials.
 *
 * @function handleGuest
 */
function handleGuest() {
  handleLogin("guest@guest.de", "guest");
}

/**
 * Enables or disables the sign-up button based on the privacy checkbox state.
 *
 * @function checkAcception
 */
function checkAcception() {
  docID("signup-form-btn").disabled = !docID("checkbox-accept-privacy").checked;
}

/**
 * Toggles the visibility of a password input field.
 *
 * @function togglePassword
 * @param {string} id - The ID of the password input field.
 */

function togglePassword(id) {
  let img_id = id + "-img";
  docID(id).type = isPasswordShown ? "text" : "password";
  docID(img_id).src = isPasswordShown ? "../assets/img/showpassword.png" : "../assets/img/icon-lock-closed.png";
  isPasswordShown = !isPasswordShown;
}
