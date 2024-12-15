let dropdownContacts = false;
let dropdownCategory = false;
let subtask = [];
let task_assigned_to = [];
let task_assigned_to_nametag = [];
let task_assigned_to_color = [];
let departments = [];
let associates_ids = [];

/**
 * Initializes the "Addtask" functionality.
 *
 * @return {Promise<void>} Returns a Promise that resolves when the initialization is complete.
 */
async function initAddtask() {
    token = localStorage.getItem("token");
    await activeUser(token); 
    init();
    await loadContacts(token);
    await loadCategorys(token);
    new AddTaskBox("AddTaskMainCon", true)
    new Div("addtaskCon", "button-con", "button-con"); //Div für die Add/Clear Button
    new Button("button-con", "clear-task", "secondary-button", clearTask, "Clear Task");
    new Button("button-con", "add-task-btn", "button", function() {addTask("to-do-con")}, "Create Task");
    setNavBarActive("add_task-link");
}

/**
 * Sets the active urgency for a given id.
 *
 * @param {string} id - The id of the urgency button.
 */
function activeUrgency(id) {
    btns = ["btn-red", "btn-orange", "btn-green" ];
    btns.forEach(element => {
        if(id == element){
            if (docID(element).classList.value.includes('active')) {
                docID(element).classList.remove('active');    
            } else {
                docID(element).classList.add('active');
            }
        } else {
            docID(element).classList.remove('active')
        }
    });
}

/**
 * Generates a dropdown menu based on the provided parameters.
 *
 * @param {string} imgid - The ID of the image associated with the dropdown menu.
 * @param {string} parent - The parent element in which the dropdown menu will be created.
 * @param {string} select - The type of dropdown menu to generate ('assigned' or 'category').
 */
function dropdownMenu(imgid, parent, select) {
    let list_Parent = select == 'assigned' ? "contact-list-parent" : "category-list-parent";
    let list_Con = select == 'assigned' ? "associate-con" : "department-con";
    let input_id = select == 'assigned' ? "input-con-assigned-input-id" : "input-con-category-input-id";
    let tasks_Parent = select == 'assigned' ? ".tasks-contacts" : ".tasks-category";
    let drop_Down = select == 'assigned' ? dropdownContacts : dropdownCategory;
    if(!drop_Down) {
        createDropMenu(list_Parent, parent, tasks_Parent, select, imgid, list_Con, input_id);
    } else {
        dropUp(select, list_Parent, imgid, list_Con, input_id, tasks_Parent);
    }
}

/**
 * Create a drop-down menu.
 *
 * @param {string} list_parent - The ID of the parent element for the drop-down menu.
 * @param {string} parent - The ID of the parent element where the drop-down menu will be appended.
 * @param {string} tasks_parent - The selector for the tasks parent element.
 * @param {string} select - The type of drop-down menu to create.
 * @param {string} imgid - The ID of the image element for the drop-down menu.
 * @param {string} list_Con - The class name for the container element of the drop-down menu.
 * @param {string} input_id - The ID of the input element for the drop-down menu.
 */
function createDropMenu(list_parent, parent, tasks_parent, select, imgid, list_Con, input_id) {
    if (!docID(list_parent)) {
        // docID(parent).innerHTML += `<div id="${list_parent}"></div>`;
        new Div(parent, list_parent);
    }
    docID(list_parent).classList.remove('d-none');
    if (document.querySelectorAll(tasks_parent).length == 0) {
        select == 'assigned' ? createContactListTask() : createCategoryList();
    }
    select == 'assigned' ? dropdownContacts = true : dropdownCategory = true;  
    docID(imgid).src = "../assets/img/arrow_up.png";
    docID(list_Con).classList.add('d-none'); 
    blueBorderToggle(input_id);
}

/**
 * Filters dropdown options based on the given selector and input_id.
 *
 * @param {string} selector - The CSS selector for the elements to filter.
 * @param {string} input_id - The id of the input element to get the search value from.
 */
function DropdownFilter(selector, input_id) { 
    let matches = document.querySelectorAll(selector);
    let search = docID(input_id).value.replace(" ", "").toLowerCase();
    matches.forEach((e, index) => {
        let match_value = e.children[1].textContent.replace(" ", "").toLowerCase();
        e.classList.add('d-none');
        if (!search || match_value.includes(search)){
            e.classList.remove('d-none');
        }
    })
}

/**
 * Drops up the select element and performs some actions.
 *
 * @param {string} select - The value of the select element.
 * @param {string} list_Parent - The ID of the parent list element.
 * @param {string} imgid - The ID of the image element.
 * @param {string} list_Con - The ID of the list container element.
 * @param {string} input_id - The ID of the input element.
 * @param {string} tasks_Parent - The ID of the parent tasks element.
 */
function dropUp(select, list_Parent, imgid, list_Con, input_id, tasks_Parent) {
    select == 'assigned' ? dropdownContacts = false : dropdownCategory = false;
    dropdownReset(list_Parent, imgid);
    docID(imgid).src = "../assets/img/arrow_drop_down.png";
    docID(list_Con).classList.remove('d-none');
    blueBorderToggle(input_id);
    listRender(list_Con, tasks_Parent);
}

/**
 * Toggles the blue border class on the parent element of the input with the specified ID.
 *
 * @param {string} input_id - The ID of the input element.
 * @return {undefined} This function does not return a value.
 */
function blueBorderToggle(input_id) {
    className = "blue-border";
    if ((docID(input_id).parentElement.classList.contains(className))) {
        docID(input_id).parentElement.classList.remove(className);
    } else {
        docID(input_id).parentElement.classList.add(className);
    }
}

/**
 * Resets the dropdown by hiding the parent element and resetting the image source.
 *
 * @param {string} parent - The ID of the parent element.
 * @param {string} imgid - The ID of the image element.
 */
function dropdownReset(parent, imgid) {
    if (docID(parent)) {
        docID(parent).classList.add('d-none');
    }
    docID(imgid).src = "../assets/img/arrow_drop_down.png";
}

/**
 * Create a contact list task.
 *
 * @return {undefined} This function does not return a value.
 */
function createContactListTask() {
    createContactBox("contact-list-parent");
    let div_id;
    contacts.forEach((e) => {
        div_id = `contact-list-parent-div-${e.id}`;
        new Div("contact-list-parent", div_id, "tasks-contacts");
        new ProfilBagde(div_id, e.id, e.color, e.name_tag);
        new Span(div_id, `span-${e.id}`,"", e.name)
        new Checkbox(div_id,`check-${e.id}`, "checkbox");
        docID(div_id).onclick = function() {CheckboxToggle(`check-${e.id}`, `contact-list-parent-div-${e.id}`, event)};
        docID(`check-${e.id}`).onclick = function() {CheckboxToggle(`check-${e.id}`, `contact-list-parent-div-${e.id}`, event)};
    })
}

/**
 * Toggles the checkbox and adds/removes a class to a div based on the checkbox state.
 *
 * @param {string} id - The ID of the checkbox element.
 * @param {string} div_id - The ID of the div element.
 * @return {undefined} This function does not return a value.
 */
function CheckboxToggle(id, div_id, event) {
    event.stopPropagation();
    if(!docID(div_id).classList.contains("active-list")) {
        docID(id).checked = true;
        docID(div_id).classList.add("active-list");
    }else {
        docID(id).checked = false;
        docID(div_id).classList.remove("active-list");
    }  
}

/**
 * Creates a category list based on the filtered contact list.
 *
 * @return {undefined} The function does not return a value.
 */
function createCategoryList() {
    let div_id;
    let filtered_Contact = filterList();
    filtered_Contact.forEach( (e) => {
        div_id = `tasks-category-${e.name}`;
        new Div("category-list-parent",div_id, "tasks-category");
        new ProfilBagde(div_id, e.name, e.color, e.name_tag);
        new Span(div_id, `category-span-${e.id}`,"", e.name)
        new Checkbox(div_id, `category-check-${e.name}`, "checkbox");
        docID(div_id).onclick = function() {
            CheckboxToggle(`category-check-${e.name}`, `tasks-category-${e.name}`, event)
            };
        docID(`category-check-${e.name}`).onclick = function() {CheckboxToggle(`check-${e.name}`, `contact-list-parent-div-${e.name}`, event)};
    })
}

/**
 * Filters a list based on a given input value.
 *
 * @return {Array} The filtered list.
 */
function filterList() {
    let output = [];
    let input_value = docID('input-con-assigned-input-id').value.toLowerCase();
    categorys.forEach((e) => {
        let check = e.name.toLowerCase();
        if(check.includes(input_value)){
            output.push(e);
        }
    })
    return output;
}

/**
 * Renders a list based on the given list container and tasks parent.
 *
 * @param {string} list_Con - The list container.
 * @param {Element} tasks_Parent - The tasks parent element.
 */
function listRender(list_Con, tasks_Parent) {
    let counter = 0;
    let active_array = activeCounter(tasks_Parent);
    if (list_Con == "associate-con") {createContactBox(list_Con)}
    let items = list_Con === "associate-con" ? contacts : categorys;
    let item_Name = list_Con === "associate-con" ? 'contact_itemNameTag' : 'category_itemNameTag';
    docID(list_Con).innerHTML = "";
    counter = itemsForEach(counter, list_Con, active_array, items)
    if (counter >= 8) {numberBadge(list_Con, item_Name, counter, 7)}
}

/**
 * Iterates over each item in the `items` array and performs certain actions based on conditions.
 *
 * @param {number} counter - The current value of the counter.
 * @param {string} list_Con - The value of the `list_Con` variable.
 * @param {boolean[]} active_array - An array indicating which items are active.
 * @param {any[]} items - An array of items to iterate over.
 * @return {number} - The updated value of the counter.
 */
function itemsForEach(counter, list_Con, active_array, items) {
    items.forEach((e, index) => {
        if (active_array[index] == true && counter < 8) {
            if (list_Con === "associate-con") {
                new ProfilBagde("associate-con", e.id, e.color, e.name_tag);
            } else {
                new ProfilBagde("department-con", e.name, e.color, e.name_tag);
            }
        }
        if (active_array[index] == true) {
            counter++;
        }
  })
  return counter;
}

/**
 * Generates a number badge for a given list container, item name, counter, and amount.
 *
 * @param {string} list_Con - The list container to generate the number badge for.
 * @param {string} item_Name - The name of the item to generate the number badge for.
 * @param {number} counter - The counter value.
 * @param {number} amount - The amount value.
 * @return {void} This function does not return a value.
 */
function numberBadge(list_Con, item_Name, counter, amount) {
    let plus_number = counter - amount;
    new ProfilBagde(list_Con, `${item_Name}-${plus_number}`, `--default`, `${plus_number}+`)
}

/**
 * Returns an array indicating whether the checkbox is checked for each element
 * that matches the given selector.
 *
 * @param {string} selector - The CSS selector used to identify the elements.
 * @return {Array} - An array of boolean values indicating whether the checkbox
 * is checked for each matched element.
 */
function activeCounter(selector) {
    let matches = document.querySelectorAll(selector);
    let array = [];
    for (let i = 0; i < matches.length; i++) {
        array.push(matches[i].children[2].checked);
    }
    return array
}

/**
 * Submits the help function.
 *
 * @param {string} id - The ID of the input.
 * @return {undefined} No return value.
 */
function submitHelpFunction() {
    let id = 'input-con-Add';
    submitSubtask(id);
}

/**
 * Submits a subtask by focusing on the input element with the specified id,
 * selecting its contents, and triggering the focusIn event for subtasks.
 *
 * @param {string} id - The id of the input element to submit.
 */
function submitSubtask(id) {
    docID(id).focus();
    docID(id).select();
    subtasksFocusIn();
}

/**
 * Executes the writeMe function.
 *
 * @param {Event} event - The event object.
 * @return {undefined} This function does not return a value.
 */
function writeMe(event) {
    event.stopPropagation();
    subtasksFocusOut();
}

/**
 * Handles the focus event for the subtasks.
 *
 * @return {undefined} No return value.
 */
function subtasksFocusIn() {
    if (!docID('img-check')) {
        new Img('subtask-div', 'img-check',"", "../assets/img/check.png");
        docID('img-check').onclick = addSubtask;
    } else {
        docID('img-check').classList.remove('d-none');
    }
    docID('subtask-img').src = '../assets/img/close.png';
    docID('subtask-img').onclick = writeMe;
    docID('input-con-Add').addEventListener("keydown", (e) => {
        if(e.key == 'Enter') {
            addSubtask();
        }
    })
    docID('subtask-div').classList.add('blue-border');
    docID('subtask-img').classList.add('margin-10');
}


/**
 * Handles the focus out event for the subtasks.
 *
 * @return {undefined} This function does not return a value.
 */
function subtasksFocusOut() {
    if (docID('img-check')) {
        docID('img-check').classList.add('d-none');
    }
    docID('subtask-img').src = '../assets/img/+.png';
    docID('subtask-img').onclick = submitHelpFunction;
    docID('subtask-div').classList.remove('blue-border');
    docID('subtask-img').classList.remove('margin-10');
}

/**
 * Adds a subtask to the list of subtasks.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function addSubtask() {
    if (docID('input-con-Add').value != "") {
        subtask.push(docID('input-con-Add').value)
        docID('input-con-Add').value = "";
        docID('input-con-Add').blur(); //nimmt den Focus von der Input
        subtasksFocusOut();
        subtaskListRender();
    }
}

/**
 * Renders the subtask list on the webpage.
 *
 * @param {type} None - This function does not take any parameters.
 * @return {type} None - This function does not return anything.
 */
function subtaskListRender() {
    docID("subtasks-con").innerHTML = "";
    new Elements("ul",'subtasks-con',"subtasks-list");
    for (let i = 0; i < subtask.length; i++) {
        new UnsortedListElement("subtasks-con", subtask[i], i);
    }
}

/**
 * Edit a subtask.
 *
 * @param {type} id - The ID of the subtask to edit.
 * @return {type} - The result of the subtask edit operation.
 */
function editSubtask(id){
    submitSubtask(id);
}

function deleteSubtask(i) {
    subtask.splice(i, 1);
    subtaskListRender();
    return
}

/**
 * Deletes a subtask from the subtask list at the specified index.
 *
 * @param {number} i - The index of the subtask to delete.
 * @return {undefined} - No return value.
 */
function subtaskChange(value, i) {
    subtask.forEach((e,index) => {
        e = docID(`sub-list-${index}`).value;
        updateSubtask(index,`sub-list-${index}`)
    })
    let img_id_1 = value.replace("sub-", "") + `-img-1`;
    let img_id_2 = value.replace("sub-", "") + `-img-2`;
    docID(value).focus();
    docID(img_id_1).src = "../assets/img/delete.png";
    docID(img_id_1).onclick = function () {deleteSubtask(i)};
    docID(img_id_2).src = "../assets/img/check.png";
    docID(img_id_2).classList.remove('sub-change-img');
    docID(img_id_2).classList.add('sub-change-img');
    docID(img_id_2).onclick = function () {updateSubtask(i,`${value}`)};
    docID(value).addEventListener("keyup", (e) => {
        if(e.key == 'Enter') {
            updateSubtask(i,`${value}`);
        } else {
            subtask[i] = docID(`sub-list-${i}`).value;
        }
    })
}

/**
 * Updates a subtask based on its index and the ID of the updated subtask.
 *
 * @param {number} i - The index of the subtask to be updated.
 * @param {string} upadate_id - The ID of the updated subtask.
 * @return {undefined} This function does not return anything.
 */
function updateSubtask(i, upadate_id) {
    if(!docID(upadate_id).value) {
        deleteSubtask(i);
    } else {
        subtask[i] = docID(upadate_id).value;
        subtaskListRender();
    }
}

/**
 * Clears the task form by resetting all input fields and variables.
 *
 * @return {void} This function does not return a value.
 */
function clearTask() {
    docID('task-title').value = "";
    docID('desc-input').value = "";
    docID('date-input').value = "";
    activeUrgency('all');
    dropdownContacts = true;
    dropdownCategory = true;
    dropdownMenu('assigned-img', 'assigned', 'assigned');
    dropdownMenu('category-img', 'category', 'category');
    uncountCounter(".tasks-contacts");
    uncountCounter(".tasks-category");
    listRender('associate-con', ".tasks-contacts");
    listRender('department-con', ".tasks-category");
    docID('input-con-Add').value = "";
    subtask = [];
    subtaskListRender();
}

/**
 * Sets the 'checked' property of all the third child elements of the elements
 * matched by the given selector to false.
 *
 * @param {string} selector - The CSS selector used to match the elements.
 */
function uncountCounter(selector) {
    let matches = document.querySelectorAll(selector);
    for (let i = 0; i < matches.length; i++) {
        matches[i].children[2].checked = false;
    }
}

/**
 * Adds a task to the specified department or to the default "to-do-con" container.
 *
 * @param {string} department - The department to add the task to (optional).
 * @return {Promise<void>} - A promise that resolves when the task is added.
 */
async function addTask(department) {
    let container = !department ? "to-do-con": department;
    let title = docID('task-title').value;
    let date = docID('date-input').value;
    if (!title) {
        docID('taskName-requiered').textContent = 'This field is requiered';
        return
    }
    if (!date) {
        docID('due-date-requiered').textContent = 'This field is requiered';
        return
    }
    let description = docID('desc-input').value;
    let urgency = theUrgency();
    theSelectors('.tasks-contacts');
    theSelectors('.tasks-category');
    let subtasks = subtask;

    let newTask = {
        container: container,
        category: departments,
        title: title,
        description: description,
        due_date: date,
        priority: urgency[0],
        priorityImg: urgency[1],
        user: associates_ids,
        assignedTo: task_assigned_to,
        subtasks: {"name": subtasks, "checked": false},
    }
    // console.log('newTask :>> ', newTask);
    respsonse = await setItem2("task", newTask, active_user.token);

    if (respsonse.status == 201) {
        let variable = document.getElementsByTagName('main')[0].id;
        new Confirmation(variable, "Task added to board", true)
        task_assigned_to = [];
        setTimeout(() => {
            window.location.href = "../html/board.html";
        }, 2000)
    } else {
        jsonResponse = await respsonse.json();
        let variable = document.getElementsByTagName('main')[0].id;
        new Confirmation(variable, jsonResponse.message, false)
    }
}

/**
 * Checks if the title is required and displays an error message if it is empty.
 *
 * @param {string} title - The title to check.
 * @param {number} id - The ID of the document.
 * @return {boolean} Returns true if the title is not empty, false otherwise.
 */
function requiered(title, id) {
    if (!title) {
        docID(id).textContent = 'This field is requiered';
        return false;
    } else {
        return true;
    }
}

/**
 * Returns an array with the urgency levels and corresponding image sources of the active buttons.
 *
 * @return {Array} An array containing the urgency levels and image sources.
 */
function theUrgency() {
    let btns = ["btn-red", "btn-orange", "btn-green" ];
    let output =[];
    btns.forEach((element) => {
        if (docID(element).classList.value.includes('active')) {
            element == "btn-red" ? output.push('Urgent') : "";
            element == "btn-orange" ? output.push('Medium'): "";
            element == "btn-green" ? output.push('Low'): "";
            let text = docID(element).children[1].src.split('/');
            let string = `../${text[text.length-3]}/${text[text.length-2]}/${text[text.length-1]}` 
            output.push(string);
            }
        })
    return output;
}


/**
 * Generates a function comment for the given function body.
 *
 * @param {string} selector - The CSS selector used to query the DOM.
 */
function theSelectors(selector){
    let matches = document.querySelectorAll(selector);
    let work;
    let id = [];
    if (selector == '.tasks-contacts') {
        task_assigned_to = [];
        task_assigned_to_nametag = [];
        task_assigned_to_color = [];
        associates_ids= [];
    } else {
        departments = [];
    }


    for (let i = 0; i < matches.length; i++) {
        if (matches[i].children[2].checked) {
            work = matches[i].children[1].id;
            id.push(work.match(/\d+/)[0]);
            if (selector == '.tasks-contacts') {
                contacts.forEach((e) => {
                    if(e.id ==id[id.length-1]) {
                        task_assigned_to.push(e.name);
                        task_assigned_to_nametag.push(e.nameTag);
                        task_assigned_to_color.push(e.color);
                    }
                })
                associates_ids.push(parseInt(id[id.length-1]));
            } else {
                departments.push(categorys[parseInt(id)-1].id);
            }
        }
    }

}

/**
 * Generates a function comment for the given function body.
 *
 * @return {Array} The list of checked items.
 */
function Subtaskschecked() {
    checked = [];
    subtask.forEach(() => {
        checked.push('unchecked');
    })
    return checked
}


window.onmousedown = function(e) {
    if (docID('contact-list-parent')) {
        cont_1 = docID('contact-list-parent').classList.contains('d-none');
        cont_2 = docID('contact-list-parent').contains(e.target);
        cont_3 = docID('input-con-assigned-input-id') == e.target;
        if (!cont_1 && !cont_2 && !cont_3 ) {
            dropdownMenu(`assigned-img`, 'assigned', 'assigned');
    }
    }
    if(docID('category-list-parent')) {
        cont_1 = docID('category-list-parent').classList.contains('d-none');
        cont_2 = docID('category-list-parent').contains(e.target);
        cont_3 = docID('input-con-category-input-id') == e.target;
        if (!cont_1 && !cont_2 && !cont_3 ) {
            dropdownMenu(`category-img`, 'category', 'category');
    }
    }
    
}