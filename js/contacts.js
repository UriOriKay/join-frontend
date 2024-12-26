let parent_array = "contact-list";


async function initContacts() {
  token = await activeUser();
  activeUser();
  init();
  updateUserValues();
  await renderContactList();
  setNavBarActive("contacts-link");
}


async function renderContactList() {
  token = await activeUser();
  await loadContacts(token);
  //Teile String in Array aus Buchstaben
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ".split("");
  docID(parent_array).textContent = "";
  fillContactList(alphabet);
}

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


function checkLetter(contact, ltr) {
  firstLetter = contact.name.charAt(0).toUpperCase();
  return firstLetter == ltr;
}


function createLetterBox(letter, parent, index) {
  new Div(parent, `${parent}-div-${index}`, "letter-box");
  new Span(`${parent}-div-${index}`, `letter${letter}`, "letter", letter);
}

function setActive(idx) {
  resetActive();
  docID(`contact-item-${idx}`).classList.add("active-contact");
}


function resetActive() {
  matches = document.querySelectorAll(".active-contact");
  matches.forEach((e) => {e.classList.remove("active-contact");});
}


function layoutContactsOverlay() {
  docID("inputs-con").textContent = "";
  createInputfieldWithPicture("text", "Name", "../assets/img/icon-person.png");
  createInputfieldWithPicture("email", "Email", "../assets/img/icon-mail.png");
  createInputfieldWithPicture("phone", "Phone", "../assets/img/icon-call.svg");
  docID("input-con-phone-input-id").pattern = "[0-9]{3,}";
  docID("input-con-phone-input-id").title =
    "Es sind nur Zahlen erlaubt. Mindestens 3 Zahlen eingeben.";
}

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



function createEditContact(id) {
  let idx = 0;
  contacts.forEach((e, index) => {e.id == id ? idx = index : null;});
  renderEditContact(id);
  fillEditContact(contacts[idx]);
}


function fillEditContact(e) {
  docID(`input-con-name-input-id`).value = e.name;
  docID(`input-con-email-input-id`).value = e.email;
  docID(`input-con-phone-input-id`).value = e.phone;
}

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

function updateContactItem(contact) {
  if (checkEmptyInputs()) {
    contact.name = docID(`input-con-name-input-id`).value;
    contact.email = docID(`input-con-email-input-id`).value;
    contact.phone = docID(`input-con-phone-input-id`).value;
    console.log('contact :>> ', contact);
    // contact.name_tag = setNameTag(contact.name);
  }
}


async function renderNewContact() {
  addNewContact();
  id = contacts.indexOf(newContact);
  // contacts[id].name_tag = setNameTag(contacts[id].name);
  await addContact(id);
}

function setNameTag(name) {
  nameArray = name.split(" ");
  return nameArray[0][0] + nameArray[1][0];
}


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


function closeButton() {
  docID("overlay-contacts").style.display = "none";
}


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


function closeContact() {
  docID("floating-contacts").style.display = "none";
  docID("floating-mobile").classList.add("d-none");
  docID("floating-contacts").textContent = "";
  docID("floating-contacts").style.zIndex = "-1";
  docID("floating-mobile").style.width = "0";
  docID("floating-mobile").style.height = "0";
  resetActive();
}
