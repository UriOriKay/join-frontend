let dropdownContacts = false;
let dropdownCategory = false;
let subtask = [];
let departments = [];
let associates_ids = [];

// init the add task page
async function initAddtask() {
  token = await activeUser();
  init();
  await loadContacts(token);
  await loadCategorys(token);
  new AddTaskBox("AddTaskMainCon", true);
  new Div("addtaskCon", "button-con", "button-con"); //Div für die Add/Clear Button
  new Button("button-con","clear-task", "secondary-button", clearTask,"Clear Task");
  new Button("button-con","add-task-btn", "button",function () {addTask("to-do-con");},"Create Task");
  setNavBarActive("add_task-link");
}

// set the urgency Button active
function activeUrgency(id) {
  btns = ["btn-red", "btn-orange", "btn-green"];
  btns.forEach((element) => {
    let eleClassList = docID(element).classList;
    eleClassList.toggle("active", id === element && !eleClassList.contains("active"));
  });
}

// open dropdown menu
function dropdownMenu(imgid, parent, select) {
  is_assigned = select == "assigned";
  let list_Parent = is_assigned ? "contact-list-parent" : "category-list-parent";
  let list_Con = is_assigned ? "associate-con" : "department-con";
  let input_id = is_assigned ? "input-con-assigned-input-id" : "input-con-category-input-id";
  let tasks_Parent = is_assigned ? ".tasks-contacts" : ".tasks-category";
  let drop_Down = is_assigned ? dropdownContacts : dropdownCategory;
  if (!drop_Down) {
    createDropMenu(list_Parent, parent, tasks_Parent, select, imgid, list_Con, input_id);
  } else {
    dropUp(select, list_Parent, imgid, list_Con, input_id, tasks_Parent);
  }
}

//create the dropdown menu
function createDropMenu(list_parent, parent, tasks_parent, select, imgid, list_Con, input_id) {
  !docID(list_parent) ? new Div(parent, list_parent) : "";
  docID(list_parent).classList.remove("d-none");
  if (document.querySelectorAll(tasks_parent).length == 0) {
    select == "assigned" ? createContactListTask() : createCategoryList();
  }
  select == "assigned" ? (dropdownContacts = true) : (dropdownCategory = true);
  docID(imgid).src = "../assets/img/arrow_up.png";
  docID(list_Con).classList.add("d-none");
  blueBorderToggle(input_id);
}

//filter the dropdown menu with the search input
function DropdownFilter(selector, input_id) {
  let matches = document.querySelectorAll(selector);
  let search = docID(input_id).value.replace(" ", "").toLowerCase();
  matches.forEach((e) => {
    let match_value = e.children[1].textContent.replace(" ", "").toLowerCase();
    e.classList.add("d-none");
    if (!search || match_value.includes(search)) {
      e.classList.remove("d-none");
    }
  });
}

//close the dropdown menu
function dropUp(select, list_Parent, imgid, list_Con, input_id, tasks_Parent) {
  select == "assigned" ? (dropdownContacts = false) : (dropdownCategory = false);
  dropdownReset(list_Parent, imgid);
  docID(imgid).src = "../assets/img/arrow_drop_down.png";
  docID(list_Con).classList.remove("d-none");
  blueBorderToggle(input_id);
  listRender(list_Con, tasks_Parent);
}

// toggle the blue border of the input filed
function blueBorderToggle(input_id) {
  docID(input_id).parentElement.classList.toggle("blue-border");
}

// set the container back.
function dropdownReset(parent, imgid) {
  docID(parent)?.classList.add("d-none");
  docID(imgid).src = "../assets/img/arrow_drop_down.png";
}

// create the contact list
function createContactListTask() {
  sortContacts();

  contacts.forEach((e) => {
    let div_id = `contact-list-parent-div-${e.id}`;
    new Div("contact-list-parent", div_id, "tasks-contacts");
    new ProfilBagde(div_id, e.id, e.color, e.name_tag);
    new Span(div_id, `span-${e.id}`, "", e.name);
    new Checkbox(div_id, `check-${e.id}`, "checkbox");

    let toggleCheckbox = () => CheckboxToggle(`check-${e.id}`, div_id, event);
    docID(div_id).onclick = toggleCheckbox;
    docID(`check-${e.id}`).onclick = toggleCheckbox;
  });
}

//create the category list
function createCategoryList() {
  let filtered_Contact = filterList();
  filtered_Contact.forEach((e) => {
    let div_id = `tasks-category-${e.name}`;
    new Div("category-list-parent", div_id, "tasks-category");
    new ProfilBagde(div_id, e.name, e.color, e.name_tag);
    new Span(div_id, `category-span-${e.id}`, "", e.name);
    new Checkbox(div_id, `category-check-${e.name}`, "checkbox");
    
    let toggleCheckbox = () => CheckboxToggle(`category-check-${e.name}`, div_id, event);
    docID(div_id).onclick = toggleCheckbox;
    docID(`category-check-${e.name}`).onclick = toggleCheckbox;
  });
}

// toggle the active of the checkboxes
function CheckboxToggle(id, div_id, event) {
  event.stopPropagation();
  let div = docID(div_id);
  let checkbox = docID(id);
  let isActive = div.classList.toggle("active-list");
  checkbox.checked = isActive;
}

// get the filtered list
function filterList() {
  let output = [];
  let input_value = docID("input-con-assigned-input-id").value.toLowerCase();
  categorys.forEach((e) => {
    let check = e.name.toLowerCase();
    if (check.includes(input_value)) {
      output.push(e);
    }
  });
  return output;
}

//render the list under the menu
function listRender(list_Con, tasks_Parent) {
  let counter = 0;
  let is_contact = list_Con == "associate-con";
  let active_array = activeCounter(tasks_Parent);
  is_contact ? sortContacts() : "";

  let items = is_contact ? contacts : categorys;
  let item_Name = is_contact ? "contact_itemNameTag" : "category_itemNameTag";
  docID(list_Con).innerHTML = "";
  counter = itemsForEach(counter, list_Con, active_array, items);
  if (counter >= 8) {numberBadge(list_Con, item_Name, counter, 7);}
}

// render every Profilbagde
function itemsForEach(counter, list_Con, active_array, items) {
  items.forEach((e, index) => {
    if (active_array[index]) {
      if (counter < 8) {
        let target = list_Con === "associate-con" ? e.id : e.name;
        new ProfilBagde(list_Con, target, e.color, e.name_tag);
      }
      counter++; 
    }
  });
  return counter;
}

// create the number badge
function numberBadge(list_Con, item_Name, counter, amount) {
  let plus_number = counter - amount;
  new ProfilBagde(list_Con, `${item_Name}-${plus_number}`, `--default`, `${plus_number}+`);
}

// get all active checkboxes
function activeCounter(selector) {
  return Array.from(document.querySelectorAll(selector), (e) => e.children[2].checked);
}

// focus on Subtask
function submitSubtask(id) {
  docID(id).focus();
  docID(id).select();
  subtasksFocusIn();
}

//helper function to focus out
function writeMe(event) {
  event.stopPropagation();
  subtasksFocusOut();
}

// focus on subtask optionen
function subtasksFocusIn() {
  let imgCheck = docID("img-check") || new Img("subtask-div", "img-check", "", "../assets/img/check.png");
  imgCheck.classList?.remove("d-none");
  docID("img-check").onclick = addSubtask;

  docID("subtask-img").src = "../assets/img/close.png";
  docID("subtask-img").onclick = writeMe;

  docID("input-con-Add").addEventListener("keydown", (e) => e.key == "Enter" && addSubtask());
  docID("subtask-div").classList.add("blue-border");
  docID("subtask-img").classList.add("margin-10");
}

// Subtasks Focus out optionen
function subtasksFocusOut() {
  docID("img-check")?.classList.add("d-none");
  docID("subtask-img").src = "../assets/img/+.png";
  docID("subtask-img").onclick = () => submitSubtask("input-con-Add");
  docID("subtask-img").classList.remove("margin-10");
  docID("subtask-div").classList.remove("blue-border");
}

// Function that add the subtask 
function addSubtask() {
  if (docID("input-con-Add").value != "") {
    subtask.push(docID("input-con-Add").value);
    docID("input-con-Add").value = "";
    docID("input-con-Add").blur(); //nimmt den Focus von der Input
    subtasksFocusOut();
    subtaskListRender();
  }
}

//render the Subtasks-List
function subtaskListRender() {
  docID("subtasks-con").innerHTML = "";
  new Elements("ul", "subtasks-con", "subtasks-list");
  subtask.forEach((e, index) => {
    new UnsortedListElement("subtasks-con", e, index);
  })
}

// function to delete a Subtasks
function deleteSubtask(i) {
  subtask.splice(i, 1);
  subtaskListRender();
  return;
}

// function to change the Subtasks
function subtaskChange(value, i) {
  subtask.forEach((e, index) => {
    e = docID(`sub-list-${index}`).value;
    updateSubtask(index, `sub-list-${index}`);
  });

  let img_id_1 = value.replace("sub-", "") + `-img-1`;
  let img_id_2 = value.replace("sub-", "") + `-img-2`;
  docID(value).focus();
  docID(img_id_1).src = "../assets/img/delete.png";
  docID(img_id_1).onclick = () => {deleteSubtask(i);};

  subtaskChangeCon2(img_id_2, i, value);
  subtaskChangeKeyup(value, i);
}

// Subtask change on user input
function subtaskChangeKeyup(value, i) {
  docID(value).addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      updateSubtask(i, `${value}`);
    } else {
      subtask[i] = docID(`sub-list-${i}`).value;
    }
  });
}

// Change the picture while Change
function subtaskChangeCon2 (id, i, value) {
  docID(id).src = "../assets/img/check.png";
  docID(id).classList.remove("sub-change-img");
  docID(id).classList.add("sub-change-img");
  docID(id).onclick = () => {updateSubtask(i, `${value}`);};
}

// Update the Subtask
function updateSubtask(i, upadate_id) {
  let value = docID(upadate_id).value;
  value ? (subtask[i] = value, subtaskListRender()) : deleteSubtask(i);
}

//clear the values in the form
function clearTask() {
  ["task-title", "desc-input", "date-input", "input-con-Add"].forEach(id => docID(id).value = "");
  activeUrgency("all");
  dropdownContacts = dropdownCategory = true;
  ["assigned", "category"].forEach(type => dropdownMenu(`${type}-img`, type, type));
  [".tasks-contacts", ".tasks-category"].forEach(selector => uncountCounter(selector));
  ["associate-con", "department-con"].forEach((con, i) => listRender(con, [".tasks-contacts", ".tasks-category"][i]));
  subtask = [];
  subtaskListRender();
}

// uncheck the checkboxes of the dropdown menüs
function uncountCounter(selector) {
  document.querySelectorAll(selector).forEach(e => e.children[2].checked = false);
}

// Add a new task to the database
async function addTask(department) {
  let container = department || "to-do-con";
  let title = docID("task-title").value;
  let date = docID("date-input").value;
  if (!title || !date ) {
    docID(!title ? "taskName-requiered" : "due-date-requiered").textContent = "This field is requiered";
    return;
  }
  let urgency = theUrgency();
  theSelectors(".tasks-contacts");
  theSelectors(".tasks-category");
  let subtasks = subtask;
  console.log('subtasks :>> ', subtasks);
  let newTask = newTaskTemplate(container, title, date, urgency, subtasks)
  console.log('newTask :>> ', newTask);
  await AddTaskResponse(newTask);
}

// send the new task to the database
async function AddTaskResponse(newTask) {
  let token = await activeUser();
  let response = await postItem("task", newTask, token);
  let variable = document.getElementsByTagName("main")[0].id;

  if (response.status == 201) {
    new Confirmation(variable, "Task added to board", true);
    setTimeout(() => {window.location.href = "../html/board.html"}, 2000);
  } else {
    let jsonResponse = await response.json();
    new Confirmation(variable, jsonResponse.message, false);
  }
}

// template for a new task
function newTaskTemplate(container, title, date, urgency,subtasks) {
  let all_subtasks = [];
  subtasks?.forEach(e => all_subtasks.push({name: e, checked: false}));
  console.log('all_subtasks :>> ', all_subtasks);
  return {
    container: container,
    category: departments,
    title: title,
    description: docID("desc-input").value,
    due_date: date,
    priority: urgency[0],
    priorityImg: urgency[1],
    user: associates_ids,
    subtasks: all_subtasks,
  }
}

// show that field is requiered, if it not filled
function requiered(title, id) {
  return title ? true : (docID(id).textContent = "This field is requiered", false);
}

// get the urgency for a new Tasks
function theUrgency() {
  let btns = ["btn-red", "btn-orange", "btn-green"];
  let priorities = { "btn-red": "Urgent", "btn-orange": "Medium", "btn-green": "Low" };

  for (let btn of btns) {
    if (docID(btn).classList.contains("active")) {
      const text = docID(btn).children[1].src.split("/");
      const imgPath = `../${text.slice(-3).join("/")}`;
      return [priorities[btn], imgPath];
    }
  }
  return [];
}

// get all active checkboxes
function theSelectors(selector) {
  let matches = document.querySelectorAll(selector);
  let work;
  let id = [];
  selector == ".tasks-contacts" ? (associates_id = []) : (departments = []);

  for (let i = 0; i < matches.length; i++) {
    if (matches[i].children[2].checked) {
      work = matches[i].children[1].id;
      id.push(work.match(/\d+/)[0]);
      if (selector == ".tasks-contacts") {
        associates_ids.push(parseInt(id[id.length - 1]));
      } else {
        departments.push(categorys[parseInt(id[id.length - 1])-1].id);
      }
    }
  }
}

// till the checked status of the subtasks for new Tasks
function Subtaskschecked() {
  checked = [];
  subtask.forEach(() => {
    checked.push("unchecked");
  });
  return checked;
}
// close the dropdown menus by click outside
window.onmousedown = function (e) {
  if (docID("contact-list-parent")) {
    cont_1 = docID("contact-list-parent").classList.contains("d-none");
    cont_2 = docID("contact-list-parent").contains(e.target);
    cont_3 = docID("input-con-assigned-input-id") == e.target;
    if (!cont_1 && !cont_2 && !cont_3) {
      dropdownMenu(`assigned-img`, "assigned", "assigned");
    }
  }
  if (docID("category-list-parent")) {
    cont_1 = docID("category-list-parent").classList.contains("d-none");
    cont_2 = docID("category-list-parent").contains(e.target);
    cont_3 = docID("input-con-category-input-id") == e.target;
    if (!cont_1 && !cont_2 && !cont_3) {
      dropdownMenu(`category-img`, "category", "category");
    }
  }
};


