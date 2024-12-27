Board_task = [];
let current_Dragged_Element;
let filteredTasks = [];
let filteredTasks_Ids = [];
let onTouchScrollInterval;

/**
 * Initializes the task board by loading data and rendering elements.
 *
 * Workflow:
 * 1. Verifies the user is logged in and retrieves the token.
 * 2. Renders the header and navbar.
 * 3. Loads tasks, contacts, and categories.
 * 4. Renders the board layout and creates task cards.
 * 5. Activates the board link in the navbar.
 *
 * @async
 * @function initBoard
 */
async function initBoard() {
  token = await activeUser(); //check if user is logged in and storage token
  init(); // render header and navbar
  await loadTasks(token); // load all Tasks
  await loadContacts(token); // load all contacts
  await loadCategorys(token); // load all categorys
  BoardrenderHTML() // render html elements
  createBoardCards();
  new Div("main-card-div", "main-board-card");
  setNavBarActive("board-link");
}

/**
 * Renders the static HTML elements for the task board.
 *
 * Workflow:
 * 1. Creates containers for the search bar, board segments, and add task button.
 * 2. Adds pre-defined segments for task categories (To Do, In Progress, etc.).
 *
 * @function BoardrenderHTML
 */

function BoardrenderHTML() {
  new Div("main-board", "board-head-con"); 
  new Div("board-head-con", "search-con");
  new Divinputimg("search-con","search","text","Find Task","../assets/img/searchLupe.png","search-text-input-id","search-con-div");
  new docID("search-text-input-id").onclick = keyboardActive();
  new Button("search-con","add-task-Task","button", function () {openAddTask("to-do-con");},"Add Task");
  new Img("board-head-con", "", "", "../assets/img/cross white.png");
  new Div("main-board", "board-content-con", ""); 
  new BoardSegment("board-content-con", "to-do", "To do");
  new BoardSegment("board-content-con", "in-progress", "In progress");
  new BoardSegment("board-content-con", "await-feedback", "Await feedback");
  new BoardSegment("board-content-con", "done", "Done");
}

/**
 * Prepares all board cards for mobile drag-and-drop interaction.
 *
 * Workflow:
 * 1. Selects all task cards on the board.
 * 2. Adds event listeners for touch interactions to each card.
 *
 * @function checkMobile
 */
function checkMobile() {
    touchTasks = document.querySelectorAll(".board-card");
    touchTasks.forEach(addStart);
}

/**
 * Adds touch interaction listeners to a task card for dragging.
 *
 * Workflow:
 * 1. Clones the task card and appends it to the document body.
 * 2. Tracks touch movements to move the cloned card.
 * 3. Detects the drop area and updates the card's category on touch end.
 *
 * @async
 * @function addStart
 * @param {HTMLElement} elem - The task card element.
 */

async function addStart(elem) {
  await elem.addEventListener("touchstart", (e) => {
    let nextX;
    let nextY;
    let drop_name;
    let elemTop = elem.getBoundingClientRect().top;
    let elemLeft = elem.getBoundingClientRect().left;
    let segmentList;
    let elemID = elem.id.split("-");
    current_Dragged_Element = elemID[elemID.length - 1];
    //füge einen Clone ins Body ein
    cloneMoveTouch = elem.cloneNode(true);
    cloneMoveTouch.classList.add("taskcard-clone");
    cloneMoveTouch.style.width = `${elem.clientWidth}px`;
    cloneMoveTouch.style.top = `${elemTop}px`;
    cloneMoveTouch.style.left = `${elemLeft}px`;
    document.body.appendChild(cloneMoveTouch);
 
    elem.addEventListener("touchend", (eve) => {

      segmentList = document.querySelectorAll(".board-segments");

      for (let i = 0; i < segmentList.length; i++) {
        const segment = segmentList[i];
        let segment_pos = segment.getClientRects()[0];
        if (
          segment_pos.left < nextX && nextX < segment_pos.right && 
          segment_pos.top < nextY && nextY < segment_pos.bottom
        ) {
          drop_name = segment.id;
          console.log('segment.id :>> ', segment.id);
          drop_name = drop_name.replace("-con", "");
          moveTo(drop_name);
        }
      }

      document.querySelectorAll(".taskcard-clone").forEach((e) => e.remove());
      cloneMoveTouch.remove();
    });

    elem.addEventListener("touchmove", (eve) => {
      eve.preventDefault();
      nextX = eve.changedTouches[0].clientX;
      nextY = eve.changedTouches[0].clientY;
      cloneMoveTouch.style.left = nextX + "px";
      cloneMoveTouch.style.top = nextY + "px";
      checkAutoScroll(eve);
     });
  });
}

/**
 * Automatically scrolls the board segments during touch interactions near edges.
 *
 * @function checkAutoScroll
 * @param {TouchEvent} event - The touch event triggering the scroll check.
 */

function checkAutoScroll(event) {
  let segmentsDiv = document.querySelector("#board-content-con");
  let rect = segmentsDiv.getBoundingClientRect();
  let touchY = event.touches[0].clientY;
  let topLimit = rect.top + 30;
  let bottomLimit = rect.bottom - 30;
  if (touchY <= topLimit) {
    clearInterval(onTouchScrollInterval);
    onTouchScrollInterval = setInterval(() => {
      segmentsDiv.scrollTop -= 10 + (topLimit - touchY);
    }, 50);
  } else if (touchY >= bottomLimit) {
    clearInterval(onTouchScrollInterval);
    onTouchScrollInterval = setInterval(() => {
      segmentsDiv.scrollTop += 10 - (bottomLimit - touchY); // Scroll down a bit
    }, 50);
  } else {
    clearInterval(onTouchScrollInterval);
  }
}

/**
 * Opens the add task menu.
 *
 * Workflow:
 * 1. Displays the add task modal.
 * 2. Sets up the add task form and a button to save the new task.
 *
 * @function openAddTask
 * @param {string} container - The container ID where the task will be added.
 */

function openAddTask(container) {
  docID("add-card-con").classList.remove("d-none");
  new Img("add-card-div", "add-card-close", "card-close", "../assets/img/close.png");
  docID("add-card-close").onclick = () => {closeCard("add-card-con", "add-card-div");};
  new AddTaskBox("add-card-div");
  new Div("addtaskCon", "button-con", "button-con"); //Div für die Add/Clear Button
  new Button("button-con", "add-task-btn", "button",  () => {boardAddTask(container);}, "Create Task");
}


/**
 * Adds a new task and closes the add task menu.
 *
 * @function boardAddTask
 * @param {string} container - The container ID where the task will be added.
 */

function boardAddTask(container) {
  let close = addTask(container);
  close ? closeCard("add-card-con", "add-card-div") : "";
}

/**
 * Activates the keyboard listener for the search input field.
 *
 * Workflow:
 * 1. Attaches a `keydown` event listener to the search input field.
 * 2. Calls `filterTasks` on every key press to dynamically filter tasks on the board.
 *
 * @function keyboardActive
 */

function keyboardActive() {
  docID("search-text-input-id").addEventListener("keydown", (e) => {
    // if (e.key == "Enter") {
    //   filterTasks();
    // }
      filterTasks();
  });
}

/**
 * Rerenders all board segments and their task cards.
 *
 * Workflow:
 * 1. Resets segment containers.
 * 2. Creates task cards for each segment.
 * 3. Displays a "No Task" message if a segment is empty.
 *
 * @function renderBoardSegments
 */

function renderBoardSegments() {
  resetSegments();
  Board_task = [];
  createBoardCards();
  renderNoTasks();
}

/**
 * Clears all task containers in the board segments.
 *
 * @function resetSegments
 */

function resetSegments() {
  ["to-do-div", "in-progress-div", "await-feedback-div", "done-div"].forEach((e) => {
    docID(e).innerHTML = "";
  })
}

/**
 * Creates task cards for each task on the board.
 *
 * @function createBoardCards
 */
function createBoardCards() {
  tasks.forEach((e) => {
    Board_task.push(new BoardCard(e));
  });
}


/**
 * Adds "No Task" messages to segments with no tasks.
 *
 * @function renderNoTasks
 */
function renderNoTasks() {
  task_amounts = getTasksAmounts();
  for (let i = 0; i < task_amounts.length; i++) {
    task_amounts[i] == 0 ? noTaskDiv(i): "";
  }
}

/**
 * Renders a "No Task" message in the specified segment.
 *
 * @function noTaskDiv
 * @param {number} i - The index of the segment to update.
 */
function noTaskDiv(i) {
  new Div(
    segements_array[i].con.replace("-con", "-div"),
    "noTask-div-id",
    "noTask-div",
    `No Task ${segements_array[i].headline}`
  )
}

/**
 * Opens a detailed view of a task card.
 *
 * @function openBigCard
 * @param {number} id - The ID of the task to display.
 */
function openBigCard(id) {
  docID("main-card-div").classList.remove("d-none");
  tasks.forEach((e) => {
    e.id == id ? new BoardBigCard(e, "main-board-card") : "";
  });
}

/**
 * Closes the detailed view of a task card and rerenders the board.
 *
 * @function closeCard
 * @param {string} parent - The ID of the parent container.
 * @param {string} child - The ID of the child container.
 * @param {Object} [e] - The task object to update (if applicable).
 */
function closeCard(parent, child, e) {
  if (e) {
    e.subtaskschecked = e.subtasks.map((_,i) => 
      docID(`main-bord-card-subtasks${i}-checkbox`).checked ? "checked" : "unchecked"
    );
  }
  docID(child).innerHTML = "";
  docID(parent).classList.add("d-none");
  renderBoardSegments();
  subtasks = [];
}

/**
 * Sets the current element being dragged.
 *
 * @function startDragging
 * @param {any} e - The element or data associated with the drag operation.
 */
function startDragging(e) {
  current_Dragged_Element = e;
}

/**
 * Allows an element to be dropped by preventing the default behavior.
 *
 * @function allowDrop
 * @param {Event} ev - The drag event triggering the action.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Updates a task's category after it is moved to a different segment.
 *
 * Workflow:
 * 1. Updates the task's container property.
 * 2. Sends the updated task to the server.
 * 3. Reloads contacts and rerenders the board.
 *
 * @async
 * @function moveTo
 * @param {string} category - The new category for the task.
 */
async function moveTo(category) {
  move_Task = tasks.filter((e) => e.id == current_Dragged_Element)[0];
  move_Task.container = category + "-con";
  token = await activeUser();
  await updateItem("task", move_Task, token);
  await loadContacts(token);
  renderBoardSegments();
}

/**
 * Allows the drag-over event for a specific category segment.
 *
 * Workflow:
 * 1. Calls `allowDrop` to prevent the default behavior and allow the drag-over action.
 *
 * @function dragOver
 * @param {string} category - The category segment where the drag-over is occurring.
 */
function dragOver(category) {
  allowDrop(event);
}

/**
 * Filters tasks on the board based on the search bar input.
 *
 * Workflow:
 * 1. Hides all tasks.
 * 2. Displays tasks that match the search query.
 * 3. If the search bar is empty, rerenders the board.
 *
 * @function filterTasks
 */
function filterTasks() {
  word = docID("search-text-input-id").value;
  if (word != "") {
    filteredTasks = [];
    filteredTasks_Ids = [];
    filteredTasks = document.querySelectorAll(".board-card");
    filteredTasks.forEach((e) => {e.classList.add("d-none");});
    fillFilteredTasksIds(word)

    filteredTasks_Ids.forEach((e) => {
      docID(e).classList.remove("d-none");
    });
  } else {
    renderBoardSegments();
  }
}

/**
 * Collects IDs of tasks that match the search query.
 *
 * @function fillFilteredTasksIds
 * @param {string} word - The search query.
 */
function fillFilteredTasksIds(word) {
  tasks.forEach((e) => {
    if (isMatch(e, word)) {
      let id = e.container.replace("-con", "") + `-card-${e.id}`;
      filteredTasks_Ids.push(id);
    }
  });
}

/**
 * Checks if a task matches the search query in its title, description, or subtasks.
 *
 * @function isMatch
 * @param {Object} obj - The task object.
 * @param {string} word - The search query.
 * @returns {boolean} `true` if the task matches; otherwise, `false`.
 */
function isMatch(obj, word) {
  let title = obj.title.toLowerCase().includes(word.toLowerCase());
  let description = obj.description.toLowerCase().includes(word.toLowerCase());
  let yourNameArray = nameArray(obj, word);
  return title || description || yourNameArray;
}

/**
 * Checks if any subtask of a task matches the search query.
 *
 * @function nameArray
 * @param {Object} obj - The task object.
 * @param {string} word - The search query.
 * @returns {boolean} `true` if a subtask matches; otherwise, `false`.
 */
function nameArray(obj, word) {
  output = false;
  obj.subtasks.forEach((e) => {
    if (e.toLowerCase().includes(word.toLowerCase())) {
      output = true;
    }
  });
  return output;
}

/**
 * Deletes a task and updates the board.
 *
 * Workflow:
 * 1. Sends a delete request to the server for the specified task.
 * 2. Closes the task card view and reloads the board.
 *
 * @async
 * @function deleteCard
 * @param {number} id - The ID of the task to delete.
 */
async function deleteCard(id) {
  token = await activeUser()
  await deleteItem("task", {"id": id}, token);
  closeCard("main-card-div", "main-board-card");
  await loadTasks(token);
  renderBoardSegments();
}

/**
 * Opens a task card in edit mode.
 *
 * Workflow:
 * 1. Prefills the edit form with task details.
 * 2. Allows the user to modify the task.
 *
 * @function editCard
 * @param {Object} e - The task object to edit.
 */
function editCard(e) {
  docID("main-board-card").innerHTML = "";
  new Img("main-board-card", "card-close", "card-close", "../assets/img/close.png");
  docID("card-close").onclick =  () => {
    closeCard("main-card-div", "main-board-card");
  };
  new AddTaskBox("main-board-card", false, "Edit Task");
  docID("task-title").value = e.title;
  docID("desc-input").value = e.description;
  docID("date-input").value = e.date;
  editUrgency(e);
  dropdownMenu("assigned-img", "assigned", "assigned");
  checkTheBox(e);
  dropdownMenu("assigned-img", "assigned", "assigned");
  dropdownMenu("category-img", "category", "category");
  checkTheCategory(e);
  dropdownMenu("category-img", "category", "category");
  addEditSubtasks(e);
  new Div("addtaskCon", "button-con", "button-con"); //Div für die Add/Clear Button
  new Button("button-con","add-task-btn", "button", () => {updateTasks(e);}, "Ok");
}

// render the Urgency by the button
function editUrgency(e) {
  e.priority == "Urgent" ? activeUrgency("btn-red") : "";
  e.priority == "Medium" ? activeUrgency("btn-orange") : "";
  e.priority == "Low" ? activeUrgency("btn-green") : "";
}

/**
 * Marks the associated contacts as selected in the menu.
 *
 * Workflow:
 * 1. Iterates through the `associates` array in the task object.
 * 2. Sets the associated checkboxes to checked and adds the "active-list" class to their containers.
 *
 * @function checkTheBox
 * @param {Object} e - The task object containing the associated contacts.
 */
function checkTheBox(e) {
  e.associates.forEach((ele) => {
    docID(`check-${ele}`).checked = true;
    docID(`contact-list-parent-div-${ele}`).classList.add("active-list");
  });
}

/**
 * Marks the associated categories as selected in the menu.
 *
 * Workflow:
 * 1. Iterates through the global `categorys` array.
 * 2. Checks if each category ID is included in the task's `category` array.
 * 3. Sets the corresponding checkboxes to checked and adds the "active-list" class to their containers.
 *
 * @function checkTheCategory
 * @param {Object} e - The task object containing the associated categories.
 */
function checkTheCategory(e) {
  categorys.forEach((element) => {
    if (e.category.includes(element.id)) {
      docID(`category-check-${element.name}`).checked = true;
      docID(`tasks-category-${element.name}`).classList.add("active-list");
    }
  });
}

/**
 * Renders the subtasks for editing.
 *
 * Workflow:
 * 1. Clears the `subtask` array.
 * 2. Copies the subtasks from the task object into the `subtask` array.
 * 3. Calls `subtaskListRender` to display the updated subtasks in the UI.
 *
 * @function addEditSubtasks
 * @param {Object} e - The task object containing the subtasks to render.
 */
function addEditSubtasks(e) {
  subtask = [];
  e.subtasks.forEach((ele) => {
    subtask.push(ele);
  });
  subtaskListRender();
}

/**
 * Updates a task with new values from the edit form.
 *
 * Workflow:
 * 1. Updates the task properties with form values.
 * 2. Sends the updated task to the server.
 * 3. Reloads tasks and rerenders the board.
 *
 * @async
 * @function updateTasks
 * @param {Object} e - The task object to update.
 */
async function updateTasks(e) {
  let urgency = theUrgency();
  theSelectors(".tasks-contacts");
  theSelectors(".tasks-category");
  e.title = docID("task-title").value;
  e.category = departments;
  e.description = docID("desc-input").value;
  e.date = docID("date-input").value;
  e.priority = urgency[0];
  e.priorityImg = urgency[1];
  e.subtasks = SubtaskUpdate(subtask, e);
  e.user = associates_ids
  deleteTasksParameters(e)
  token = await activeUser()
  await updateItem("task", e, token);
  await loadTasks(token);
  subtask = [];
  closeCard("main-card-div", "main-board-card");
}

/**
 * Removes unnecessary properties from a task object before updating it.
 *
 * @function deleteTasksParameters
 * @param {Object} e - The task object to clean up.
 */
function deleteTasksParameters(e) {
  delete e.associates;
  delete e.assignedTo;
  delete e.assignedToNameTag;
  delete e.assignedToColor;
  delete e.subtaskschecked;
}

/**
 * Updates the checked state of subtasks in the task object.
 *
 * @function editSubtaskchecked
 * @param {Object} e - The task object to update.
 * @returns {Array<string>} The updated checked state of the subtasks.
 */
function editSubtaskchecked(e) {
  checked = e.subtaskschecked;
  if (subtask.length > checked.length) {
    for (let i = checked.length; i < subtask.length; i++) {
      checked.push("unchecked");
    }
  }
  return checked;
}

/**
 * Updates the subtasks with their titles and checked states.
 *
 * @function SubtaskUpdate
 * @param {Array<string>} subtask - The updated subtask titles.
 * @param {Object} e - The task object containing the original subtasks.
 * @returns {Array<Object>} The updated subtasks.
 */
function SubtaskUpdate(subtask, e) {
  let news = []; 
  console.log('e.subtaskschecked :>> ', e.subtaskschecked);
  for (let i = 0; i < subtask.length; i++) {
    news[i] = {
      title: subtask[i],
      checked: e.subtaskschecked[i] == "checked" ? true : false
    }
  }
  return news
}
