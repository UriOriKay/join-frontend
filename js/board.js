Board_task = [];
let current_Dragged_Element;
let filteredTasks = [];
let filteredTasks_Ids = [];
let onTouchScrollInterval;

/**
 * Initializes the board by performing the following actions:
 * - Calls the `init` function
 * - Sets the active user
 * - Updates user values
 * - Loads backend
 * - Creates the head container
 * - Creates the search input field with image
 * - Adds event listener to activate the keyboard
 * - Creates the "Add Task" button
 * - Creates the close button image
 * - Creates the content container
 * - Creates the board segments
 * - Creates the board cards
 * - Creates the main board card container
 * - Sets the navigation bar active
 *
 * @return {void} This function does not return any value
 */
async function initBoard() {
  token = localStorage.getItem("token");
  activeUser(token);
  init();
  updateUserValues();
  await loadTasks(token);
  await loadContacts(token);
  await loadCategorys(token);
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
  createBoardCards();
  new Div("main-card-div", "main-board-card");
  setNavBarActive("board-link");
}

/**
 * Checks if the current device is a mobile device and performs specific tasks if it is.
 *
 * @return {void} This function does not return a value.
 */
function checkMobile() {
  // if (window.matchMedia("(max-width: 1025px)").matches) {
    touchTasks = document.querySelectorAll(".board-card");
    touchTasks.forEach(addStart);
  // }
}

/**
 * Adds a touchstart, touchend, touchmove event listener to the given element.
 *
 * @param {Element} elem - The element to add the event listener to.
 */
function addStart(elem) {
  elem.addEventListener("touchstart", (e) => {

    let startX = e.changedTouches[0].clientX;
    let startY = e.changedTouches[0].clientY;
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
 * Fuction is called by the moveTouching() function to allow for a dymanic scroll during the drag-drop on mobile devices
 * It calculates the top and bottom 30 pixels. When a touch is registered in the defined areas an interval is called that scrolls up or down.
 * Scroll speed is dynamically determined by how high/low the user touches.
 * clears interval every time an area is touched to avoid stacking intervals
 *
 * @param {event} event the event of someone touching the screen
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
 * Opens the add task functionality in the specified container.
 *
 * @param {string} container - The ID of the container element where the add task functionality will be opened.
 * @return {undefined} This function does not return a value.
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
 * Adds a task to the board container.
 *
 * @param {type} container - The container to add the task to.
 * @return {type} The close function of the added task.
 */
function boardAddTask(container) {
  let close = addTask(container);
  close ? closeCard("add-card-con", "add-card-div") : "";
}

/**
 * Adds an event listener to the search text input element and calls the filterTasks function when the 'Enter' key is pressed.
 *
 * @param {Event} e - The keydown event object.
 * @return {void} This function does not return a value.
 */
function keyboardActive() {
  docID("search-text-input-id").addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      filterTasks();
    }
  });
}

/**
 * Renders the board segments.
 *
 * @return {undefined} No return value.
 */
function renderBoardSegments() {
  resetSegments();
  Board_task = [];
  createBoardCards();
  renderNoTasks();
}

/**
 * Resets the segments of the HTML document.
 *
 * @param {void} None - This function takes no parameters.
 * @return {void} This function does not return a value.
 */
function resetSegments() {
  docID("to-do-div").innerHTML = "";
  docID("in-progress-div").innerHTML = "";
  docID("await-feedback-div").innerHTML = "";
  docID("done-div").innerHTML = "";
}

/**
 * Creates board cards based on the tasks array.
 *
 * @param {Array} tasks - The array of tasks.
 * @return {undefined} This function does not return a value.
 */
function createBoardCards() {
  tasks.forEach((e) => {
    Board_task.push(new BoardCard(e));
  });
}

/**
 * Renders the appropriate HTML elements when there are no tasks.
 *
 * @return {undefined} This function does not return a value.
 */
function renderNoTasks() {
  task_amounts = getTasksAmounts();
  for (let i = 0; i < task_amounts.length; i++) {
    task_amounts[i] == 0
      ? new Div(
          segements_array[i].con.replace("-con", "-div"),
          "noTask-div-id",
          "noTask-div",
          `No Task ${segements_array[i].headline}`
        )
      : "";
  }
}

/**
 * Opens a big card with the given ID.
 *
 * @param {number} id - The ID of the card.
 * @return {undefined} This function does not return a value.
 */
function openBigCard(id) {
  docID("main-card-div").classList.remove("d-none");
  tasks.forEach((e) => {
    if (e.id == id) {
      new BoardBigCard(e, "main-board-card");
    }
  });
}

/**
 * Closes a card and performs additional actions if an event object is provided.
 *
 * @param {string} parent - The ID of the parent element.
 * @param {string} child - The ID of the child element.
 * @param {object} e - An optional event object.
 */
function closeCard(parent, child, e) {
  if (e) {
    amount = e.subtasks.length;
    e.subtaskschecked = [];
    for (let i = 0; i < amount; i++) {
      if (docID(`main-bord-card-subtasks${i}-checkbox`).checked) {
        e.subtaskschecked.push("checked");
      } else {
        e.subtaskschecked.push("unchecked");
      }
    }
  }
  docID(child).innerHTML = "";
  docID(parent).classList.add("d-none");
  renderBoardSegments();
  subtasks = [];
}

/**
 * Sets the current dragged element to the given event.
 *
 * @param {Event} e - The event object representing the drag start event.
 */
function startDragging(e) {
  current_Dragged_Element = e;
}

/**
 * A description of the entire function.
 *
 * @param {type} ev - The event object.
 * @return {undefined} This function does not return a value.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves the task to the specified category.
 *
 * @param {string} category - The category to move the task to.
 * @return {undefined} This function does not return a value.
 */
function moveTo(category) {
  let id = getTasksIdx();
  tasks[id].container = `${category}-con`;
  setItem("tasks", tasks);
  renderBoardSegments();
}

/**
 * Drag over function.
 *
 * @param {string} category - The category being dragged over.
 * @return {undefined} There is no return value.
 */
function dragOver(category) {
  allowDrop(event);
}

/**
 * Retrieves the index of a task from the tasks array based on the value of the current_Dragged_Element.
 *
 * @return {number} The index of the task in the tasks array.
 */
function getTasksIdx() {
  let task_idx;

  for (let i = 0; i < tasks.length; i++) {
    const element_idx = tasks[i].id;
    if (current_Dragged_Element == element_idx) {
      task_idx = i;
    }
  }
  return task_idx;
}

/**
 * Filters tasks based on a search word.
 *
 * @param {string} word - The search word to filter tasks.
 * @return {void} This function does not return a value.
 */
function filterTasks() {
  word = docID("search-text-input-id").value;
  if (word != "") {
    filteredTasks = [];
    filteredTasks_Ids = [];
    filteredTasks = document.querySelectorAll(".board-card");

    filteredTasks.forEach((e) => {
      e.classList.add("d-none");
    });

    tasks.forEach((e) => {
      if (isMatch(e, word)) {
        let id = e.container.replace("-con", "") + `-card-${e.id}`;
        filteredTasks_Ids.push(id);
      }
    });

    filteredTasks_Ids.forEach((e) => {
      docID(e).classList.remove("d-none");
    });
  } else {
    renderBoardSegments();
  }
}

/**
 * Checks if the given object has a match for the specified word in its title, description, or nameArray.
 *
 * @param {Object} obj - The object to check for a match.
 * @param {string} word - The word to search for.
 * @return {boolean} - True if a match is found, false otherwise.
 */
function isMatch(obj, word) {
  let title = obj.title.toLowerCase().includes(word.toLowerCase());
  let description = obj.description.toLowerCase().includes(word.toLowerCase());
  let yourNameArray = nameArray(obj, word);
  return title || description || yourNameArray;
}

/**
 * Checks if the given word is included in the array of subtasks in the given object.
 *
 * @param {Object} obj - The object containing the array of subtasks.
 * @param {string} word - The word to search for in the array of subtasks.
 * @return {boolean} Returns true if the word is found in the array of subtasks, otherwise returns false.
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
 * Deletes a card from the tasks array based on the provided index.
 *
 * @param {number} idx - The index of the card to be deleted.
 * @return {Promise<void>} - A promise that resolves once the card has been deleted.
 */
async function deleteCard(id) {
  await deleteItem("task", {"id": id}, localStorage.getItem("token"));
  closeCard("main-card-div", "main-board-card");
  await loadTasks(localStorage.getItem("token"));
  renderBoardSegments();
}

/**
 * Edits a card.
 *
 * @param {Event} e - the event triggering the function
 * @return {undefined} nothing is returned
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

/**
 * Edits the urgency of a given element.
 *
 * @param {Event} e - The event object containing the element and its priority.
 * @return {void} This function does not return a value.
 */
function editUrgency(e) {
  e.priority == "Urgent" ? activeUrgency("btn-red") : "";
  e.priority == "Medium" ? activeUrgency("btn-orange") : "";
  e.priority == "Low" ? activeUrgency("btn-green") : "";
}

/**
 * Checks the corresponding checkboxes for each associate.
 *
 * @param {object} e - The event object.
 */
function checkTheBox(e) {
  e.associates.forEach((ele) => {
    docID(`check-${ele}`).checked = true;
  });
}

/**
 * Checks the category of an event and updates the corresponding category checkboxes.
 *
 * @param {Object} e - The event object.
 */
function checkTheCategory(e) {
  categorys.forEach((element) => {
    if (e.category.includes(element.id)) {
      docID(`category-check-${element.name}`).checked = true;
    }
  });
}

/**
 * Adds or edits subtasks based on the given event.
 *
 * @param {object} e - The event object containing subtasks.
 * @return {undefined} No return value.
 */
function addEditSubtasks(e) {
  subtask = [];
  e.subtasks.forEach((ele) => {
    subtask.push(ele);
  });
  subtaskListRender();
}

/**
 * Updates the tasks with the provided information.
 *
 * @param {Event} e - The event object.
 * @return {void}
 */
async function updateTasks(e) {
  console.log('ele :>> ', e);
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
  delete e.associates
  delete e.assignedTo
  delete e.assignedToNameTag;
  delete e.assignedToColor;
  delete e.subtaskschecked,
  // console.log('e :>> ', e);
  await updateItem("task", e, localStorage.getItem("token"));
  await loadTasks(localStorage.getItem("token"));
  subtask = [];
  closeCard("main-card-div", "main-board-card");
}

/**
 * Edits the checked status of subtasks.
 *
 * @param {object} e - The event object containing the subtaskschecked array.
 * @return {array} The updated array of checked subtasks.
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
