let contacts_inputs;
let letter;
let parent_array = "contact-list";
let edit_contact;
let text;

/**
 * Initializes the contacts.
 *
 * @return {Promise<void>} Returns a promise that resolves when the contacts are initialized.
 */
async function initContacts() {
  activeUser(); //set activeUser
  init();
  updateUserValues();
  await renderContactList();
  setNavBarActive("contacts-link");
}

/**
 * Renders the contact list.
 *
 * @return {Promise} A promise that resolves when the contact list has been rendered.
 */
async function renderContactList() {
  await loadContacts(localStorage.getItem("token"));
  //Teile String in Array aus Buchstaben
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ".split("");
  docID(parent_array).textContent = "";
  //Fülle die ContactListe neu
  alphabet.forEach((ltr, i) => {
    letter = ltr; //for checkLetter
    filtered_contacts = contacts.filter(checkLetter);
    if (filtered_contacts.length > 0) {
      createLetterBox(ltr, parent_array, i);
      filtered_contacts.forEach((e) => {
        new Div(parent_array, `contact-item-${e.id}`, "contact-list-row");
        docID(`contact-item-${e.id}`).onclick = async function () { await renderFloatingContacts(e.id);};
        new ProfilBagde(`contact-item-${e.id}`, e.id, e.color, e.name_tag);
        new Div(`contact-item-${e.id}`, `contact-item-${e.id}-div`, "contact-list-coloumn");
        new Span(`contact-item-${e.id}-div`, `contact_itemName-${e.id}`, "", e.name);
        new Headline("h6", `contact-item-${e.id}-div`, `contact_itemMail-${e.id}`, "", e.email);
      });
    }
  });
}

/**
 * Checks if the first letter of the contact's name is equal to a given letter.
 *
 * @param {object} contact - The contact object.
 * @return {boolean} Returns true if the first letter of the contact's name is equal to the given letter, otherwise returns false.
 */
function checkLetter(contact) {
  firstLetter = contact.name.charAt(0).toUpperCase();
  return firstLetter == letter;
}

/**
 * Create a letter box in the parent element at the specified index.
 *
 * @param {string} letter - The letter to be displayed in the letter box.
 * @param {string} parent - The ID of the parent element where the letter box will be created.
 * @param {number} index - The index at which the letter box will be inserted in the parent element.
 */
function createLetterBox(letter, parent, index) {
  new Div(parent, `${parent}-div-${index}`, "letter-box");
  new Span(`${parent}-div-${index}`, `letter${letter}`, "letter", letter);
}

/**
 * Sets the specified contact item as active.
 *
 * @param {number} idx - The index of the contact item to be set as active.
 */
function setActive(idx) {
  resetActive();
  //set new attributes
  docID(`contact-item-${idx}`).classList.add("active-contact");
}

/**
 * Resets the active state of all contacts.
 *
 * @param {None} None - This function does not take any parameters.
 * @return {None} This function does not return a value.
 */
function resetActive() {
  matches = document.querySelectorAll(".active-contact");
  matches.forEach((e)=>{
    e.classList.remove("active-contact");
  });
}

/**
 * Sets up the layout for the contacts overlay.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function layoutContactsOverlay() {
  docID("inputs-con").textContent = "";
  input_name = new Divinputimg("inputs-con","imput-img-div", "text", "Name", "../assets/img/icon-person.png", "input-con-name-input-id","input-con-name-input-div-id");
  docID("input-con-name-input-id").required = true;
  input_email = new Divinputimg("inputs-con", "imput-img-div", "email", "Email", "../assets/img/icon-mail.png","input-con-email-input-id", "input-con-email-input-div-id");
  docID("input-con-email-input-id").required = true;
  input_phone = new Divinputimg("inputs-con", "imput-img-div", "phone", "Phone", "../assets/img/icon-call.svg", "input-con-phone-input-id", "input-con-phone-input-div-id");
  docID("input-con-phone-input-id").required = true;
  docID("input-con-phone-input-id").pattern = '[0-9]{3,}';

  docID("input-con-phone-input-id").title="Es sind nur Zahlen erlaubt. Mindestens 3 Zahlen eingeben."
}

/**
 * Creates an edit contact function.
 *
 * @param {number} id - The ID of the contact to edit.
 * @return {undefined} This function does not return a value.
 */
function createEditContact(id) {
  let idx = 0;

  contacts.forEach((e, index) => {
    if (e.id == id) {
      idx = index;
    }
  });
  renderEditContact(id);
  fillEditContact(contacts[idx]);
}

/**
 * Fills the edit contact form with the given contact information.
 *
 * @param {Object} e - The contact information to fill the form with.
 * @param {string} e.name - The name of the contact.
 * @param {string} e.mail - The email address of the contact.
 * @param {string} e.phone - The phone number of the contact.
 */
function fillEditContact(e) {
  docID(input_name.input_id).value = e.name;
  docID(input_email.input_id).value = e.email;
  docID(input_phone.input_id).value = e.phone;
}

/**
 * Saves a contact by updating the contact item, setting the updated contacts in local storage,
 * rendering the updated contact list, rendering the floating contacts, and closing the button.
 *
 * @param {number} idx - The index of the contact to save.
 * @return {undefined} There is no return value.
 */
// async function saveContact(id) {
//   edit_contact = contacts.filter((e) => e.id == id)[0];
//   updateContactItem(edit_contact);
//   console.log(edit_contact);

// }
async function addContact(id) {
  edit_contact = contacts[id];
  updateContactItem(edit_contact);
  edit_contact.contact = true;
  await postItem("contact/new", edit_contact);
  console.log(edit_contact);
  await loadContacts(localStorage.getItem("token"));
  await renderContactList();
  new Confirmation("contact-main", "Contact succesfully created", false);
  edit_contact_id = contacts.filter((e) => e.email == edit_contact.email)[0].id;
  await renderFloatingContacts(edit_contact_id);
  closeButton()
}

async function updateContact(contact) {
  updateContactItem(contact);
  contact.password = "test"
  token = localStorage.getItem("token");
  console.log('token :>> ', token);
  await fetch(BASE_URL_2 + "contact/",  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token " + token
    },
    body: JSON.stringify(contact),
  })
  await loadContacts(localStorage.getItem("token"));
  await renderContactList();
  new Confirmation("contact-main", "Contact succesfully updated", false);
  await renderFloatingContacts(contact.id);
  closeButton()
}

/**
 * Update the contact item with the provided information.
 *
 * @param {Object} contact - The contact object to be updated.
 * @return {undefined} This function does not return a value.
 */
function updateContactItem(contact) {
  if (checkEmptyInputs()) {
    contact.name = docID(input_name.input_id).value;
    contact.email = docID(input_email.input_id).value;
    contact.phone = docID(input_phone.input_id).value;
    contact.name_tag = setNameTag(contact.name);
  }
}

/**
 * Renders a new contact by adding it to the contacts list, setting the name tag,
 * and saving it.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
async function renderNewContact() {
  addNewContact();
  idx = contacts.indexOf(newContact);
  contacts[idx].name_tag = setNameTag(contacts[idx].name);
  await addContact(idx);
}

/**
 * Renders the floating contacts based on the given index.
 *
 * @param {number} idx - The index to filter the contacts.
 * @return {void} This function does not return any value.
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
 * Deletes a contact from the contacts array by its index.
 *
 * @param {number} idx - The index of the contact to be deleted.
 * @return {Promise<void>} - A promise that resolves when the contact is deleted.
 */
async function deleteContact(id) {
  console.log('id :>> ', id);
  contact = contacts.filter((contact) => contact['id'] == id)[0];
  console.log('contact :>> ', contact);
  await deleteItem("contact", contact, localStorage.getItem("token"));
  await loadContacts(localStorage.getItem("token"));
  await renderContactList();
  docID("floating-contacts").textContent = "";
  closeContact();
  closeButton();
}

/**
 * Closes the overlay contacts by setting its display style to "none".
 *
 * @param {type} - No parameters.
 * @return {undefined} - No return value.
 */
function closeButton() {
  docID("overlay-contacts").style.display = "none";
}

/**
 * Renders the edit contact overlay for a specific contact.
 *
 * @param {string} id - The ID of the contact to edit.
 */
function renderEditContact(id) {
  contact = contacts.filter((contact) => contact['id'] == id)[0];
  layoutContactsOverlay();
  docID("edit-contact-con-overlay").textContent = "";
  new ProfilBagde("edit-contact-con-overlay", id, contact.color, contact.name_tag);
  //change Values
  docID("edit-contact-overlay-headline").textContent = "Edit contact";
  docID("edit-contact-button-group").textContent = "";
  new Button("edit-contact-button-group", "overlay-secondary-btn", "secondary-button font-t5", () => {deleteContact(`${id}`);}, "Delete" );
  docID("overlay-secondary-btn").type = "button";
  new Button("edit-contact-button-group", "overlay-primary-btn", "button font-t5", "",);
  docID("edit-contacts-con").onsubmit =  function () {updateContact(contact); return false;};
  new Span("overlay-primary-btn", "", "", "Save");
  new Img("overlay-primary-btn", "", "", "../assets/img/check.svg");
  //change Style
  docID("overlay-contacts").style.display = "flex";
  docID("edit-contact-overlay").style.left = "0";
  docID("edit-contact-overlay").style.animationName = "fadingLeft";
  docID("contact-overlay-subtitle").style.display = "none";
}

/**
 * Renders the add contact functionality.
 *
 * @param {type} - No parameters needed.
 * @return {type} - No return value.
 */
function renderAddContact() {
  layoutContactsOverlay();
  docID("edit-contact-con-overlay").textContent = "";
  docID("edit-contact-button-group").textContent = "";
  docID("edit-contact-overlay-headline").textContent = "Add Contact";
  new Img("edit-contact-con-overlay","edit-contact-overlay-img", "", "../assets/img/person-white.svg");
  new Button("edit-contact-button-group", "overlay-secondary-btn", "secondary-button font-t5",() => {closeButton();}, "Cancel");
  docID("overlay-secondary-btn").type = "button";
  new Button("edit-contact-button-group", "overlay-primary-btn", "button font-t5", "", "Create contact");
  docID("edit-contacts-con").onsubmit =  function () {renderNewContact(); return false;};
  //change Style values
  docID("edit-contact-overlay").style.left = "unset";
  docID("edit-contact-overlay").style.animationName = "fadingRight";
  docID("overlay-contacts").style.display = "flex";
  docID("contact-overlay-subtitle").style.display = "flex";
  docID("overlay-secondary-btn").style.width = "unset";
}

/**
 * Creates floating contacts.
 *
 * @param {object} e - The event object.
 * @return {Promise} Returns a promise.
 */
async function createFloatingContacts(e) {
  let parent = "floating-contacts";
  let con_id = `floating-con${e.id}`;
  let con_class = "floating-con";
  let hl_id = `floating-headline${e.id}`;
  let hl_class = "floating-headline";
  let profile_con = "floating-profile-badge";
  let hl_txt_con_id = `floating-headline-text-con${e.id}`;
  let hl_txt_con_class = "floating-headline-text-con";
  let hl_lnk_con_id = `floating-headline-links-con${e.id}`;
  let hl_lnk_con_class = `floating-headline-links-con`;
  let hl_lnk_id = `floating-headline-link${e.id}`;
  let hl_lnk_class = "floating-headline-link";
  let hl_lnk_span_id = `floating-headline-link${e.id}-span`;
  let hl_lnk_2_id = `floating-headline-link-2-${e.id}`;
  let div_22_id = `${con_id}-22`;
  let div_15_id_1 = `${con_id}-15-1`;
  let div_15_id_1_span_id = "floating-contacts-mail-value-1";
  let div_15_id_1_span_class = "color-primary";
  let div_15_id_2 = `${con_id}-15-2`;
  let div_15_id_2_span_id = "floating-contactsPhoneValue-2";

  docID("floating-contacts").textContent = "";
  new Div(parent, con_id, con_class);
  new Div(con_id, hl_id, hl_class);
  new Div(hl_id, profile_con);
  new ProfilBagde(profile_con, e.id, e.color, e.name_tag);
  new Div(hl_id, hl_txt_con_id, hl_txt_con_class);
  new Headline("h1", hl_txt_con_id, "", "", e.name);
  new Div(hl_txt_con_id, hl_lnk_con_id, hl_lnk_con_class);
  new Div(hl_lnk_con_id, hl_lnk_id, hl_lnk_class);
  new Img(hl_lnk_id, "", "", "../assets/img/edit.png");
  new Span(hl_lnk_id, hl_lnk_span_id, "", "Edit");

  /**
   * Sets an onclick event for the element with the specified ID.
   *
   * @param {string} hl_lnk_span_id - The ID of the element.
   * @return {undefined} This function does not return a value.
   */
  docID(hl_lnk_span_id).onclick = function () {
    createEditContact(e.id);
  };
  new Div(hl_lnk_con_id, hl_lnk_2_id, "floating-headline-link");

  /**
   * Executes the `deleteContact` function when the `onclick` event is triggered on the `docID(hl_lnk_2_id)` element.
   *
   * @param {type} e.idx - the index of the contact to be deleted
   * @return {type} - does not return anything
   */
  docID(hl_lnk_2_id).onclick = () => {deleteContact(e.id);};
  new Img(hl_lnk_2_id, "", "", "../assets/img/delete.png");
  new Span(hl_lnk_2_id, "", "", "Delete");
  new Headline("h2", con_id, "", "", "Contact Information");
  new Div(con_id, div_22_id, "gap-22");
  new Div(div_22_id, div_15_id_1, "gap-15");
  new Headline("h6", div_15_id_1, "", "", "Email");
  new Span(div_15_id_1, div_15_id_1_span_id, div_15_id_1_span_class, e.email);
  new Div(div_22_id, div_15_id_2, "gap-15");
  new Headline("h6", div_15_id_2, "", "", "Phone");
  new Span(div_15_id_2, div_15_id_2_span_id, "", e.phone);
}

/**
 * Closes the contact panel and resets its state.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
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
