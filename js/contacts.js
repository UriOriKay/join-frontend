let parent_array = "contact-list";

/**
 * Initializes the contacts page by setting up the environment and rendering the contact list.
 *
 * Workflow:
 * 1. Checks if the user is logged in and retrieves the token.
 * 2. Initializes the header and navbar.
 * 3. Updates the user name in the header.
 * 4. Renders the contact list.
 * 5. Sets the "Contacts" link as active in the navbar.
 *
 * @async
 * @function initContacts
 */
async function initContacts() {
  token = await activeUser();
  activeUser();
  init();
  updateUserValues();
  await renderContactList();
  setNavBarActive("contacts-link");
}

/**
 * Renders the contact list with alphabetical grouping.
 *
 * Workflow:
 * 1. Retrieves the token and loads all contacts.
 * 2. Clears the contact list container.
 * 3. Populates the contact list using alphabetical filtering.
 *
 * @async
 * @function renderContactList
 */
async function renderContactList() {
  token = await activeUser();
  await loadContacts(token);
  //Teile String in Array aus Buchstaben
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ".split("");
  docID(parent_array).textContent = "";
  fillContactList(alphabet);
}

/**
 * Fills the contact list with contacts grouped by the alphabet.
 *
 * Workflow:
 * 1. Iterates through the alphabet.
 * 2. Filters contacts that start with the current letter.
 * 3. Creates a letter box for each group and populates it with matching contacts.
 *
 * @function fillContactList
 * @param {Array<string>} alphabet - An array of letters for grouping contacts.
 */
function fillContactList(alphabet) {
  alphabet.forEach((letter, i) => {
    filtered_contacts = contacts.filter(contact => checkLetter(contact, letter));
    if (filtered_contacts.length > 0) {
      createLetterBox(letter, parent_array, i);
      filtered_contacts.forEach((e) => {
        new Div(parent_array, `contact-item-${e.id}`, "contact-list-row");
        docID(`contact-item-${e.id}`).onclick = async function () {
          await renderFloatingContacts(e.id);
        };
        new ProfilBagde(`contact-item-${e.id}`, e.id, e.color, e.name_tag);
        new Div(`contact-item-${e.id}`, `contact-item-${e.id}-div`, "contact-list-coloumn");
        new Span(`contact-item-${e.id}-div`, `contact_itemName-${e.id}`, "", e.name);
        new Headline("h6", `contact-item-${e.id}-div`, `contact_itemMail-${e.id}`, "", e.email);
      });
    }
  })
}

/**
 * Checks if a contact's name starts with the specified letter.
 *
 * @function checkLetter
 * @param {Object} contact - The contact object to check.
 * @param {string} ltr - The letter to match against the contact's name.
 * @returns {boolean} `true` if the contact's name starts with the letter; otherwise, `false`.
 */

function checkLetter(contact, ltr) {
  firstLetter = contact.name.charAt(0).toUpperCase();
  return firstLetter == ltr;
}

/**
 * Creates a letter box for grouping contacts.
 *
 * @function createLetterBox
 * @param {string} letter - The letter to display in the letter box.
 * @param {string} parent - The parent container ID for the letter box.
 * @param {number} index - The index of the letter in the alphabet.
 */

function createLetterBox(letter, parent, index) {
  new Div(parent, `${parent}-div-${index}`, "letter-box");
  new Span(`${parent}-div-${index}`, `letter${letter}`, "letter", letter);
}

/**
 * Marks a contact as active in the UI.
 *
 * @function setActive
 * @param {number} idx - The ID of the contact to mark as active.
 */
function setActive(idx) {
  resetActive();
  docID(`contact-item-${idx}`).classList.add("active-contact");
}

/**
 * Resets all active contacts in the UI.
 *
 * @function resetActive
 */
function resetActive() {
  matches = document.querySelectorAll(".active-contact");
  matches.forEach((e) => {e.classList.remove("active-contact");});
}

/**
 * Prepares the layout for the contact overlay by creating input fields.
 *
 * Workflow:
 * 1. Clears the input container.
 * 2. Creates input fields for name, email, and phone.
 * 3. Sets validation rules for the phone input field.
 *
 * @function layoutContactsOverlay
 */
function layoutContactsOverlay() {
  docID("inputs-con").textContent = "";
  createInputfieldWithPicture("text", "Name", "../assets/img/icon-person.png");
  createInputfieldWithPicture("email", "Email", "../assets/img/icon-mail.png");
  createInputfieldWithPicture("phone", "Phone", "../assets/img/icon-call.svg");
  docID("input-con-phone-input-id").pattern = "[0-9]{3,}";
  docID("input-con-phone-input-id").title =
    "Es sind nur Zahlen erlaubt. Mindestens 3 Zahlen eingeben.";
}

/**
 * Creates an input field with an associated label and icon.
 *
 * @function createInputfieldWithPicture
 * @param {string} kind - The input type (e.g., "text", "email").
 * @param {string} placeholder - The placeholder text for the input field.
 * @param {string} imgsrc - The URL of the icon to display next to the input field.
 */
function createInputfieldWithPicture(kind, placeholder, imgsrc) {
  new Divinputimg(
    "inputs-con", 
    "imput-img-div", 
    kind, 
    placeholder, 
    imgsrc, 
    `input-con-${placeholder.toLowerCase()}-input-id`,
    `input-con-${placeholder.toLowerCase()}-input-div-id`,
  )
  docID(`input-con-${placeholder.toLowerCase()}-input-id`).required = true;
}

/**
 * Initializes the edit contact process.
 *
 * Workflow:
 * 1. Finds the contact by ID.
 * 2. Renders the edit contact layout.
 * 3. Fills the edit form with the contact's details.
 *
 * @function createEditContact
 * @param {number} id - The ID of the contact to edit.
 */
function createEditContact(id) {
  let idx = 0;
  contacts.forEach((e, index) => {e.id == id ? idx = index : null;});
  renderEditContact(id);
  fillEditContact(contacts[idx]);
}

/**
 * Fills the edit contact form with the contact's details.
 *
 * @function fillEditContact
 * @param {Object} e - The contact object with details to populate.
 */
function fillEditContact(e) {
  docID(`input-con-name-input-id`).value = e.name;
  docID(`input-con-email-input-id`).value = e.email;
  docID(`input-con-phone-input-id`).value = e.phone;
}

/**
 * Adds a new contact to the database and updates the UI.
 *
 * Workflow:
 * 1. Updates the contact object with input values.
 * 2. Sends the contact data to the server.
 * 3. Reloads the contact list and displays a success message.
 * 4. Renders the newly added contact in the floating view.
 *
 * @async
 * @function addContact
 * @param {number} id - The ID of the contact to add.
 */

async function addContact(id) {
  let edit_contact = contacts[id];
  updateContactItem(edit_contact);
  edit_contact.contact = true;
  token = await activeUser();
  await postItem("contact/new", edit_contact, token);
  await loadContacts(token);
  await renderContactList();
  new Confirmation("contact-main", "Contact succesfully created", false);
  edit_contact_id = contacts.filter((e) => e.email == edit_contact.email)[0].id;
  await renderFloatingContacts(edit_contact_id);
  closeButton();
}

/**
 * Updates an existing contact in the database and updates the UI.
 *
 * Workflow:
 * 1. Updates the contact object with input values.
 * 2. Sends the updated contact data to the server.
 * 3. Reloads the contact list and displays a success message.
 * 4. Renders the updated contact in the floating view.
 *
 * @async
 * @function updateContact
 * @param {Object} contact - The contact object to update.
 */
async function updateContact(contact) {
  updateContactItem(contact);
  contact.password = "test";
  token = await activeUser();
  await updateItem("contact", contact, token);
  await loadContacts(token);
  await renderContactList();
  new Confirmation("contact-main", "Contact succesfully updated", false);
  await renderFloatingContacts(contact.id);
  closeButton();
}

/**
 * Updates the contact object with values from the input fields.
 *
 * Workflow:
 * 1. Checks if all required input fields are filled.
 * 2. Updates the contact object with the input values.
 *
 * @function updateContactItem
 * @param {Object} contact - The contact object to update.
 */
function updateContactItem(contact) {
  if (checkEmptyInputs()) {
    contact.name = docID(`input-con-name-input-id`).value;
    contact.email = docID(`input-con-email-input-id`).value;
    contact.phone = docID(`input-con-phone-input-id`).value;
    console.log('contact :>> ', contact);
    // contact.name_tag = setNameTag(contact.name);
  }
}

/**
 * Adds and renders a new contact.
 *
 * Workflow:
 * 1. Creates a new contact template.
 * 2. Adds the new contact to the database.
 * 3. Renders the new contact in the list and floating view.
 *
 * @async
 * @function renderNewContact
 */
async function renderNewContact() {
  addNewContact();
  id = contacts.indexOf(newContact);
  // contacts[id].name_tag = setNameTag(contacts[id].name);
  await addContact(id);
}

/**
 * Generates a name tag from the contact's name.
 *
 * @function setNameTag
 * @param {string} name - The contact's full name.
 * @returns {string} The generated name tag.
 */
function setNameTag(name) {
  nameArray = name.split(" ");
  return nameArray[0][0] + nameArray[1][0];
}

/**
 * Renders the floating contact view for the specified contact.
 *
 * Workflow:
 * 1. Finds the contact by ID.
 * 2. Creates the floating view layout with the contact's details.
 * 3. Displays the floating contact view.
 *
 * @async
 * @function renderFloatingContacts
 * @param {number} id - The ID of the contact to display.
 */
async function renderFloatingContacts(id) {
  contacts.forEach(async (e, index) => {
    if (id == e.id) {
      contact = contacts[index];
      await createFloatingContacts(contact);
      setActive(e.id);
    }
  });

  docID("floating-contacts").style.display = "flex";
  docID("floating-mobile").classList.remove("d-none");
  docID("floating-contacts").style.zIndex = "1";
  docID("floating-mobile").style.width = "100%";
  docID("floating-mobile").style.height = "80%";
}

/**
 * Deletes a contact and updates the UI.
 *
 * Workflow:
 * 1. Sends a delete request for the contact to the server.
 * 2. Reloads the contact list.
 * 3. Closes the floating contact view.
 *
 * @async
 * @function deleteContact
 * @param {number} id - The ID of the contact to delete.
 */
async function deleteContact(id) {
  contact = contacts.filter((contact) => contact["id"] == id)[0];
  token = await activeUser();
  await deleteItem("contact", contact, token);
  await loadContacts(token);
  await renderContactList();
  docID("floating-contacts").textContent = "";
  closeContact();
  closeButton();
}

/**
 * Closes the contact overlay.
 *
 * @function closeButton
 */
function closeButton() {
  docID("overlay-contacts").style.display = "none";
}

/**
 * Renders the layout and form for editing a contact.
 *
 * Workflow:
 * 1. Prepares the overlay layout.
 * 2. Populates the form with the contact's details.
 * 3. Adds buttons for deleting or saving the contact.
 *
 * @function renderEditContact
 * @param {number} id - The ID of the contact to edit.
 */
function renderEditContact(id) {
  contact = contacts.filter((contact) => contact["id"] == id)[0];
  layoutContactsOverlay();
  docID("edit-contact-con-overlay").textContent = "";
  new ProfilBagde("edit-contact-con-overlay", id, contact.color, contact.name_tag);
  docID("edit-contact-overlay-headline").textContent = "Edit contact";
  docID("edit-contact-button-group").textContent = "";
  new Button("edit-contact-button-group", "overlay-secondary-btn", "secondary-button font-t5", () => {deleteContact(`${id}`);},"Delete");
  docID("overlay-secondary-btn").type = "button";
  new Button("edit-contact-button-group", "overlay-primary-btn", "button font-t5", "");
  docID("edit-contacts-con").onsubmit = function () {updateContact(contact); return false;};
  new Span("overlay-primary-btn", "", "", "Save");
  new Img("overlay-primary-btn", "", "", "../assets/img/check.svg");
  docID("overlay-contacts").style.display = "flex";
  docID("edit-contact-overlay").style.left = "0";
  docID("edit-contact-overlay").style.animationName = "fadingLeft";
  docID("contact-overlay-subtitle").style.display = "none";
}

/**
 * Renders the layout and form for adding a new contact.
 *
 * Workflow:
 * 1. Prepares the overlay layout.
 * 2. Sets up the form with input fields.
 * 3. Adds buttons for canceling or creating the contact.
 *
 * @function renderAddContact
 */
function renderAddContact() {
  layoutContactsOverlay();
  docID("edit-contact-con-overlay").textContent = "";
  docID("edit-contact-button-group").textContent = "";
  docID("edit-contact-overlay-headline").textContent = "Add Contact";
  new Img("edit-contact-con-overlay", "edit-contact-overlay-img", "", "../assets/img/person-white.svg");
  new Button("edit-contact-button-group", "overlay-secondary-btn", "secondary-button font-t5", () => {closeButton();}, "Cancel");
  docID("overlay-secondary-btn").type = "button";
  new Button("edit-contact-button-group", "overlay-primary-btn", "button font-t5", "", "Create contact" );
  docID("edit-contacts-con").onsubmit = function () { renderNewContact();return false;};
  docID("edit-contact-overlay").style.left = "unset";
  docID("edit-contact-overlay").style.animationName = "fadingRight";
  docID("overlay-contacts").style.display = "flex";
  docID("contact-overlay-subtitle").style.display = "flex";
  docID("overlay-secondary-btn").style.width = "unset";
}

/**
 * Creates and displays the floating contact view for the specified contact.
 *
 * @function createFloatingContacts
 * @param {Object} e - The contact object to display.
 */
async function createFloatingContacts(e) {
  docID("floating-contacts").textContent = "";
  new Div("floating-contacts", `floating-con${e.id}`, "floating-con");
  new Div(`floating-con${e.id}`, `floating-headline${e.id}`, "floating-headline");
  new Div(`floating-headline${e.id}`, "floating-profile-badge");
  new ProfilBagde("floating-profile-badge", e.id, e.color, e.name_tag);
  new Div(`floating-headline${e.id}`, `floating-headline-text-con${e.id}`, "floating-headline-text-con");
  new Headline("h1", `floating-headline-text-con${e.id}`, "", "", e.name);
  new Div(`floating-headline-text-con${e.id}`, `floating-headline-links-con${e.id}`, `floating-headline-links-con`);
  new Div(`floating-headline-links-con${e.id}`, `floating-headline-link${e.id}`, "floating-headline-link");
  new Img(`floating-headline-link${e.id}`, "", "", "../assets/img/edit.png");
  new Span(`floating-headline-link${e.id}`, `floating-headline-link${e.id}-span`, "", "Edit");

  docID(`floating-headline-link${e.id}-span`).onclick = function () {
    createEditContact(e.id);
  };
  new Div(`floating-headline-links-con${e.id}`, `floating-headline-link-2-${e.id}`, "floating-headline-link");

  docID(`floating-headline-link-2-${e.id}`).onclick = () => {deleteContact(e.id);};
  new Img(`floating-headline-link-2-${e.id}`, "", "", "../assets/img/delete.png");
  new Span(`floating-headline-link-2-${e.id}`, "", "", "Delete");
  new Headline("h2", `floating-con${e.id}`, "", "", "Contact Information");
  new Div(`floating-con${e.id}`, `floating-con${e.id}-22`, "gap-22");
  new Div(`floating-con${e.id}-22`, `floating-con${e.id}-15-1`, "gap-15");
  new Headline("h6", `floating-con${e.id}-15-1`, "", "", "Email");
  new Span(`floating-con${e.id}-15-1`, "floating-contacts-mail-value-1", "color-primary", e.email);
  new Div(`floating-con${e.id}-22`, `floating-con${e.id}-15-2`, "gap-15");
  new Headline("h6", `floating-con${e.id}-15-2`, "", "", "Phone");
  new Span(`floating-con${e.id}-15-2`, "floating-contactsPhoneValue-2", "", e.phone);
}

/**
 * Closes the floating contact view and resets its state.
 *
 * @function closeContact
 */
function closeContact() {
  docID("floating-contacts").style.display = "none";
  docID("floating-mobile").classList.add("d-none");
  docID("floating-contacts").textContent = "";
  docID("floating-contacts").style.zIndex = "-1";
  docID("floating-mobile").style.width = "0";
  docID("floating-mobile").style.height = "0";
  resetActive();
}
