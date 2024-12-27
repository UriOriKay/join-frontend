let dropdownContacts = false;
let dropdownCategory = false;
let subtask = [];
let departments = [];
let associates_ids = [];


/**
 * Initializes the "Add Task" interface by setting up required data, UI components, and event handlers.
 * 
 * Workflow:
 * 1. **Authorization Check**: Verifies if the user is authorized using `activeUser`.
 *    - If unauthorized, the user is redirected to the index page.
 *    - If authorized, retrieves and returns the user token.
 * 2. **Global Initialization**: Calls `init` to set up the header and navigation bar for the site.
 * 3. **Data Loading**: Fetches the user's contacts and categories using the retrieved token.
 * 4. **UI Setup**:
 *    - Creates the main "Add Task" interface.
 *    - Adds buttons for clearing the form (`Clear Task`) and creating a task (`Create Task`).
 * 5. **Navigation Activation**: Marks the "Add Task" link in the navigation bar as active.
 *
 * @async
 * @function initAddtask
 * @returns {Promise<void>} Resolves when all components are initialized and ready for user interaction.
 */


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

/**
 * Toggles the "active" state of urgency buttons based on the provided ID.
 * 
 * Workflow:
 * 1. Defines an array of urgency button IDs (`btn-red`, `btn-orange`, `btn-green`).
 * 2. Iterates through the button IDs.
 * 3. Toggles the "active" class on the button matching the provided `id`:
 *    - If the button is not currently active, it becomes active.
 *    - If the button is already active, it remains unchanged.
 * 4. All other buttons have their "active" class removed.
 *
 * @function activeUrgency
 * @param {string} id - The ID of the urgency button to activate (e.g., `btn-red`).
 */

function activeUrgency(id) {
  btns = ["btn-red", "btn-orange", "btn-green"];
  btns.forEach((element) => {
    let eleClassList = docID(element).classList;
    eleClassList.toggle("active", id === element && !eleClassList.contains("active"));
  });
}

/**
 * Handles the opening, creation, filtering, and closing of dropdown menus for task assignment or category selection.
 */

/**
 * Toggles the dropdown menu for assigned contacts or categories.
 * 
 * - Checks whether the dropdown menu for the given `select` type ("assigned" or "category") is already open.
 * - If not open, creates the dropdown menu.
 * - If open, closes the dropdown menu.
 *
 * @function dropdownMenu
 * @param {string} imgid - The ID of the dropdown toggle icon.
 * @param {string} parent - The ID of the parent element for the dropdown.
 * @param {string} select - Determines the type of dropdown ("assigned" for contacts or "category" for categories).
 */
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

/**
 * Creates and displays the dropdown menu for task assignment or category selection.
 * 
 * - Generates the dropdown container if it doesn't already exist.
 * - Renders the list of contacts or categories within the dropdown.
 * - Updates the state to indicate the dropdown is open.
 * - Toggles the "arrow up" icon and hides the input's associated container.
 *
 * @function createDropMenu
 * @param {string} list_parent - The ID of the dropdown container.
 * @param {string} parent - The ID of the parent element for the dropdown.
 * @param {string} tasks_parent - The CSS selector for task items in the dropdown.
 * @param {string} select - Determines whether the dropdown is for "assigned" or "category".
 * @param {string} imgid - The ID of the dropdown toggle icon.
 * @param {string} list_Con - The ID of the container for the list.
 * @param {string} input_id - The ID of the input field associated with the dropdown.
 */
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

/**
 * Filters the dropdown menu items based on the user's search input.
 * 
 * - Hides items that do not match the search query.
 * - Displays items that match the search query.
 *
 * @function DropdownFilter
 * @param {string} selector - The CSS selector for the dropdown items to be filtered.
 * @param {string} input_id - The ID of the input field used for filtering.
 */
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

/**
 * Closes the dropdown menu and resets its state.
 * 
 * - Updates the state to indicate the dropdown is closed.
 * - Resets the dropdown container to a hidden state.
 * - Toggles the "arrow down" icon and restores the input's associated container.
 * - Re-renders the list of contacts or categories in the dropdown.
 *
 * @function dropUp
 * @param {string} select - Determines whether the dropdown is for "assigned" or "category".
 * @param {string} list_Parent - The ID of the dropdown container.
 * @param {string} imgid - The ID of the dropdown toggle icon.
 * @param {string} list_Con - The ID of the container for the list.
 * @param {string} input_id - The ID of the input field associated with the dropdown.
 * @param {string} tasks_Parent - The CSS selector for task items in the dropdown.
 */
function dropUp(select, list_Parent, imgid, list_Con, input_id, tasks_Parent) {
  select == "assigned" ? (dropdownContacts = false) : (dropdownCategory = false);
  dropdownReset(list_Parent, imgid);
  docID(imgid).src = "../assets/img/arrow_drop_down.png";
  docID(list_Con).classList.remove("d-none");
  blueBorderToggle(input_id);
  listRender(list_Con, tasks_Parent);
}

/**
 * Toggles the blue border on the input field associated with the dropdown menu.
 * 
 * - Adds or removes the "blue-border" class to indicate focus.
 *
 * @function blueBorderToggle
 * @param {string} input_id - The ID of the input field to toggle the border for.
 */
function blueBorderToggle(input_id) {
  docID(input_id).parentElement.classList.toggle("blue-border");
}

/**
 * Resets the dropdown menu container to its initial hidden state.
 * 
 * - Adds the "d-none" class to hide the dropdown container.
 * - Toggles the dropdown icon to the "arrow down" state.
 *
 * @function dropdownReset
 * @param {string} parent - The ID of the dropdown container.
 * @param {string} imgid - The ID of the dropdown toggle icon.
 */
function dropdownReset(parent, imgid) {
  docID(parent)?.classList.add("d-none");
  docID(imgid).src = "../assets/img/arrow_drop_down.png";
}

/**
 * Creates and renders the contact list for the task dropdown menu.
 * 
 * Workflow:
 * 1. Sorts the `contacts` array to ensure proper order.
 * 2. Iterates over each contact in the `contacts` array and:
 *    - Creates a new container (`Div`) for the contact in the dropdown.
 *    - Adds a profile badge (`ProfilBagde`) displaying the contact's details.
 *    - Adds a span element showing the contact's name.
 *    - Adds a checkbox for selecting the contact.
 * 3. Sets up event listeners for the container and checkbox:
 *    - Clicking either toggles the "active" state of the checkbox and container.
 *
 * @function createContactListTask
 */
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

/**
 * Creates and renders the category list for the task dropdown menu.
 * 
 * Workflow:
 * 1. Retrieves the filtered category list using `filterList`.
 * 2. Iterates over each category in the filtered list and:
 *    - Creates a new container (`Div`) for the category in the dropdown.
 *    - Adds a profile badge (`ProfilBagde`) displaying the category's details.
 *    - Adds a span element showing the category's name.
 *    - Adds a checkbox for selecting the category.
 * 3. Sets up event listeners for the container and checkbox:
 *    - Clicking either toggles the "active" state of the checkbox and container.
 *
 * @function createCategoryList
 */
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

/**
 * Toggles the "active" state of a checkbox and its associated container.
 * 
 * Workflow:
 * 1. Stops event propagation to avoid unintended side effects.
 * 2. Toggles the "active-list" class on the specified container (`div_id`).
 * 3. Updates the `checked` state of the associated checkbox (`id`) based on the active state of the container.
 *
 * @function CheckboxToggle
 * @param {string} id - The ID of the checkbox to toggle.
 * @param {string} div_id - The ID of the container associated with the checkbox.
 * @param {Event} event - The click event triggering the toggle.
 */
function CheckboxToggle(id, div_id, event) {
  event.stopPropagation();
  let div = docID(div_id);
  let checkbox = docID(id);
  let isActive = div.classList.toggle("active-list");
  checkbox.checked = isActive;
}

/**
 * Filters the category list based on the user's search input.
 * 
 * Workflow:
 * 1. Retrieves the current value from the input field (`input-con-assigned-input-id`) and converts it to lowercase.
 * 2. Iterates over all categories in the `categorys` array.
 * 3. Checks if the category name includes the input value (case-insensitive).
 * 4. Adds matching categories to the output array.
 * 5. Returns the filtered list of categories.
 *
 * @function filterList
 * @returns {Array<Object>} An array of filtered category objects matching the search criteria.
 */
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

/**
 * Renders a list of contacts or categories in the specified container.
 * 
 * Workflow:
 * 1. Determines whether the list is for contacts (`associate-con`) or categories.
 * 2. Retrieves the array of active items using `activeCounter`.
 * 3. Sorts contacts if the list is for contacts.
 * 4. Clears the contents of the specified list container (`list_Con`).
 * 5. Iterates over the active items and renders up to 8 items using `itemsForEach`.
 * 6. If there are more than 8 items, displays a number badge with the count of additional items.
 *
 * @function listRender
 * @param {string} list_Con - The ID of the container where the list will be rendered.
 * @param {string} tasks_Parent - The CSS selector for the parent task items (e.g., `.tasks-contacts` or `.tasks-category`).
 */
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

/**
 * Iterates over the provided items and renders them in the specified container.
 * 
 * Workflow:
 * 1. Loops through the `items` array.
 * 2. Checks if the current item is active using the `active_array`.
 * 3. Renders the item as a profile badge in the specified container (`list_Con`) if:
 *    - The item is active.
 *    - The total rendered items are less than 8.
 * 4. Increments the `counter` for each active item, regardless of whether it is rendered.
 * 5. Returns the final count of active items.
 *
 * @function itemsForEach
 * @param {number} counter - The count of active items processed so far.
 * @param {string} list_Con - The ID of the container where the items are rendered.
 * @param {Array<boolean>} active_array - An array indicating the active state of each item.
 * @param {Array<Object>} items - The array of items (contacts or categories) to process.
 * @returns {number} The updated count of active items.
 */
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

/**
 * Adds a number badge to the list container to indicate additional items.
 * 
 * Workflow:
 * 1. Calculates the number of additional items (`plus_number`) by subtracting the maximum displayed amount from the total count.
 * 2. Creates a profile badge in the list container (`list_Con`) showing the `plus_number` value.
 *
 * @function numberBadge
 * @param {string} list_Con - The ID of the container where the badge will be added.
 * @param {string} item_Name - The prefix for the badge ID.
 * @param {number} counter - The total count of active items.
 * @param {number} amount - The maximum number of items to display before adding the badge.
 */
function numberBadge(list_Con, item_Name, counter, amount) {
  let plus_number = counter - amount;
  new ProfilBagde(list_Con, `${item_Name}-${plus_number}`, `--default`, `${plus_number}+`);
}

/**
 * Retrieves the active state of checkboxes in the specified container.
 * 
 * Workflow:
 * 1. Selects all elements matching the given `selector`.
 * 2. Maps the selected elements to an array of boolean values:
 *    - `true` if the third child (checkbox) is checked.
 *    - `false` otherwise.
 *
 * @function activeCounter
 * @param {string} selector - The CSS selector for the container elements to check.
 * @returns {Array<boolean>} An array indicating the checked state of each item.
 */
function activeCounter(selector) {
  return Array.from(document.querySelectorAll(selector), (e) => e.children[2].checked);
}

/**
 * Sets focus on the input field for adding subtasks and enables the subtask editing UI.
 * 
 * Workflow:
 * 1. Focuses and selects the content of the input field with the given `id`.
 * 2. Calls `subtasksFocusIn` to display editing options.
 *
 * @function submitSubtask
 * @param {string} id - The ID of the input field for subtasks.
 */
function submitSubtask(id) {
  docID(id).focus();
  docID(id).select();
  subtasksFocusIn();
}

/**
 * Handles the event to focus out from the subtask input.
 * 
 * - Stops the propagation of the event.
 * - Calls `subtasksFocusOut` to hide editing options.
 *
 * @function writeMe
 * @param {Event} event - The event triggering the focus out action.
 */
function writeMe(event) {
  event.stopPropagation();
  subtasksFocusOut();
}

/**
 * Activates the UI for subtask editing.
 * 
 * Workflow:
 * 1. Displays the "check" icon and sets its click handler to `addSubtask`.
 * 2. Changes the subtask close icon to "close" and sets its click handler to `writeMe`.
 * 3. Adds an event listener to handle the Enter key for adding subtasks.
 * 4. Highlights the subtask input container with a blue border and adds margin to the icon.
 *
 * @function subtasksFocusIn
 */
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

/**
 * Deactivates the UI for subtask editing.
 * 
 * Workflow:
 * 1. Hides the "check" icon.
 * 2. Resets the subtask icon to "add" and sets its click handler to re-focus the input field.
 * 3. Removes the blue border and additional margin from the subtask input container.
 *
 * @function subtasksFocusOut
 */
function subtasksFocusOut() {
  docID("img-check")?.classList.add("d-none");
  docID("subtask-img").src = "../assets/img/+.png";
  docID("subtask-img").onclick = () => submitSubtask("input-con-Add");
  docID("subtask-img").classList.remove("margin-10");
  docID("subtask-div").classList.remove("blue-border");
}

/**
 * Adds a new subtask to the list and updates the UI.
 * 
 * Workflow:
 * 1. Retrieves the value from the subtask input field.
 * 2. If the input field is not empty:
 *    - Adds the value to the `subtask` array.
 *    - Clears and removes focus from the input field.
 *    - Calls `subtasksFocusOut` to reset the UI.
 *    - Calls `subtaskListRender` to update the subtask list.
 *
 * @function addSubtask
 */
function addSubtask() {
  if (docID("input-con-Add").value != "") {
    subtask.push(docID("input-con-Add").value);
    docID("input-con-Add").value = "";
    // docID("input-con-Add").blur(); //nimmt den Focus von der Input
    // subtasksFocusOut();
    subtaskListRender();
  }
}

/**
 * Renders the list of subtasks in the UI.
 * 
 * Workflow:
 * 1. Clears the current subtask list container.
 * 2. Creates a new unordered list (`ul`) element.
 * 3. Iterates through the `subtask` array and creates list elements for each subtask.
 *
 * @function subtaskListRender
 */
function subtaskListRender() {
  docID("subtasks-con").innerHTML = "";
  new Elements("ul", "subtasks-con", "subtasks-list");
  subtask.forEach((e, index) => {
    new UnsortedListElement("subtasks-con", e, index);
  })
}

/**
 * Deletes a subtask from the list and updates the UI.
 * 
 * Workflow:
 * 1. Removes the subtask at the specified index from the `subtask` array.
 * 2. Calls `subtaskListRender` to update the subtask list.
 *
 * @function deleteSubtask
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtask(i) {
  subtask.splice(i, 1);
  subtaskListRender();
  return;
}

/**
 * Enables editing for a specific subtask and updates its UI.
 * 
 * Workflow:
 * 1. Iterates through all subtasks and updates their values in the `subtask` array.
 * 2. Focuses on the specified subtask input field.
 * 3. Updates the icons for the subtask:
 *    - Sets the delete icon with a click handler to remove the subtask.
 *    - Sets the "check" icon to save changes.
 * 4. Adds keyup event listeners to save changes on pressing Enter or update the value on other keys.
 *
 * @function subtaskChange
 * @param {string} value - The value of the subtask input field to change.
 * @param {number} i - The index of the subtask being edited.
 */
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

/**
 * Adds a keyup event listener to handle subtask updates.
 * 
 * Workflow:
 * 1. Saves the updated value when the Enter key is pressed.
 * 2. Updates the `subtask` array with the current value for other keys.
 *
 * @function subtaskChangeKeyup
 * @param {string} value - The value of the subtask input field.
 * @param {number} i - The index of the subtask being edited.
 */
function subtaskChangeKeyup(value, i) {
  docID(value).addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      updateSubtask(i, `${value}`);
    } else {
      subtask[i] = docID(`sub-list-${i}`).value;
    }
  });
}

/**
 * Updates the subtask icon to indicate the save state.
 * 
 * Workflow:
 * 1. Changes the subtask icon to a "check" icon.
 * 2. Adds a click handler to save the subtask updates.
 *
 * @function subtaskChangeCon2
 * @param {string} id - The ID of the subtask icon.
 * @param {number} i - The index of the subtask being edited.
 * @param {string} value - The value of the subtask input field.
 */
function subtaskChangeCon2 (id, i, value) {
  docID(id).src = "../assets/img/check.png";
  docID(id).classList.remove("sub-change-img");
  docID(id).classList.add("sub-change-img");
  docID(id).onclick = () => {updateSubtask(i, `${value}`);};
}

/**
 * Updates the value of a specific subtask or deletes it if empty.
 * 
 * Workflow:
 * 1. Retrieves the value from the input field specified by `update_id`.
 * 2. If the value is not empty:
 *    - Updates the subtask at the specified index.
 *    - Calls `subtaskListRender` to update the UI.
 * 3. If the value is empty:
 *    - Deletes the subtask using `deleteSubtask`.
 *
 * @function updateSubtask
 * @param {number} i - The index of the subtask to update.
 * @param {string} update_id - The ID of the input field for the subtask.
 */
function updateSubtask(i, upadate_id) {
  let value = docID(upadate_id).value;
  value ? (subtask[i] = value, subtaskListRender()) : deleteSubtask(i);
}

/**
 * Resets the task creation form and clears all associated data.
 * 
 * Workflow:
 * 1. Clears the values of the input fields for task title, description, due date, and subtask input.
 * 2. Resets the urgency buttons to their default inactive state by calling `activeUrgency` with "all".
 * 3. Resets the dropdown menus for contacts and categories:
 *    - Opens the dropdown menus using `dropdownMenu`.
 *    - Ensures all checkboxes in the dropdown menus are unchecked using `uncountCounter`.
 * 4. Re-renders the contact and category lists to reflect the cleared state using `listRender`.
 * 5. Clears the `subtask` array and calls `subtaskListRender` to update the subtask list UI.
 *
 * @function clearTask
 */
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

/**
 * Unchecks all checkboxes within the elements matching the specified selector.
 * 
 * Workflow:
 * 1. Selects all elements matching the given CSS `selector`.
 * 2. Iterates over the selected elements and sets the `checked` property of the third child element (assumed to be a checkbox) to `false`.
 *
 * @function uncountCounter
 * @param {string} selector - The CSS selector for the elements containing checkboxes to uncheck.
 */
function uncountCounter(selector) {
  document.querySelectorAll(selector).forEach(e => e.children[2].checked = false);
}

/**
 * Adds a new task to the task board.
 * 
 * Workflow:
 * 1. Validates that the task title and due date are provided.
 *    - Displays a required field message if missing.
 * 2. Retrieves the urgency, selected contacts, categories, and subtasks.
 * 3. Creates a new task object using `newTaskTemplate`.
 * 4. Sends the new task to the database using `AddTaskResponse`.
 *
 * @async
 * @function addTask
 * @param {string} [department] - The ID of the task container (e.g., "to-do-con").
 */

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

/**
 * Sends the new task to the database and handles the server response.
 * 
 * Workflow:
 * 1. Retrieves the user token using `activeUser`.
 * 2. Sends the task to the database using `postItem`.
 * 3. Displays a success or error message based on the server response:
 *    - On success: Redirects to the task board after a delay.
 *    - On failure: Displays an error message from the server response.
 *
 * @async
 * @function AddTaskResponse
 * @param {Object} newTask - The task object to be sent to the database.
 */

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

/**
 * Creates a template object for a new task.
 * 
 * Workflow:
 * 1. Processes subtasks into an array of objects with `name` and `checked` properties.
 * 2. Constructs a task object with the provided details:
 *    - Container, category, title, description, due date, priority, and associated users.
 * 3. Includes the generated subtask array in the task object.
 *
 * @function newTaskTemplate
 * @param {string} container - The ID of the task container (e.g., "to-do-con").
 * @param {string} title - The title of the task.
 * @param {string} date - The due date for the task.
 * @param {Array} urgency - An array containing the urgency label and associated image path.
 * @param {Array} subtasks - An array of subtask strings.
 * @returns {Object} The formatted task object.
 */

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

/**
 * Checks if a required field is filled and displays a message if not.
 * 
 * Workflow:
 * 1. Returns `true` if the field is filled.
 * 2. If the field is empty, displays the "This field is required" message in the specified element.
 *
 * @function requiered
 * @param {string} title - The value of the field to validate.
 * @param {string} id - The ID of the element where the message will be displayed.
 * @returns {boolean} `true` if the field is filled; otherwise, `false`.
 */
function requiered(title, id) {
  return title ? true : (docID(id).textContent = "This field is requiered", false);
}

/**
 * Determines the selected urgency level for the task.
 * 
 * Workflow:
 * 1. Iterates through predefined urgency button IDs.
 * 2. Checks if any button has the "active" class.
 * 3. If active, retrieves the urgency label and image path.
 * 4. Returns an array containing the urgency label and image path.
 * 5. Returns an empty array if no urgency is selected.
 *
 * @function theUrgency
 * @returns {Array} An array containing the urgency label and image path, or an empty array.
 */

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

/**
 * Retrieves the selected contacts or categories from the dropdown.
 * 
 * Workflow:
 * 1. Selects all elements matching the given `selector`.
 * 2. Initializes arrays for storing selected contact IDs or department IDs.
 * 3. Iterates over the selected elements and:
 *    - Extracts the ID of the selected item.
 *    - Adds the ID to the appropriate array (`associates_ids` or `departments`).
 *
 * @function theSelectors
 * @param {string} selector - The CSS selector for the items to retrieve (e.g., ".tasks-contacts").
 */

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

/**
 * Generates an array representing the checked status of subtasks.
 * 
 * Workflow:
 * 1. Iterates over the `subtask` array.
 * 2. Adds "unchecked" to the result array for each subtask.
 *
 * @function Subtaskschecked
 * @returns {Array<string>} An array of "unchecked" strings for each subtask.
 */
function Subtaskschecked() {
  checked = [];
  subtask.forEach(() => {
    checked.push("unchecked");
  });
  return checked;
}

/**
 * Closes dropdown menus when clicking outside of them.
 * 
 * Workflow:
 * 1. Checks if the dropdown for contacts or categories is open.
 * 2. If the click occurs outside the dropdown, closes the dropdown using `dropdownMenu`.
 *
 * @event window.onmousedown
 * @param {Event} e - The mouse down event.
 */
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


