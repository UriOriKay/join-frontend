Board_task = [];
let current_Dragged_Element;
let filteredTasks = [];
let filteredTasks_Ids = [];
let onTouchScrollInterval;

// initial the board
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

// render board html elements
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

// get all elements for move mobile Cards
function checkMobile() {
    touchTasks = document.querySelectorAll(".board-card");
    touchTasks.forEach(addStart);
}

// the function for move the cards by clone
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

// check is Scroll necessary
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

// open the menu for ass Task
function openAddTask(container) {
  docID("add-card-con").classList.remove("d-none");
  new Img("add-card-div", "add-card-close", "card-close", "../assets/img/close.png");
  docID("add-card-close").onclick = () => {closeCard("add-card-con", "add-card-div");};
  new AddTaskBox("add-card-div");
  new Div("addtaskCon", "button-con", "button-con"); //Div für die Add/Clear Button
  new Button("button-con", "add-task-btn", "button",  () => {boardAddTask(container);}, "Create Task");
}

// add the new task and close the menu
function boardAddTask(container) {
  let close = addTask(container);
  close ? closeCard("add-card-con", "add-card-div") : "";
}

// filter function for the board
function keyboardActive() {
  docID("search-text-input-id").addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      filterTasks();
    }
  });
}

// rerender the Board Elements
function renderBoardSegments() {
  resetSegments();
  Board_task = [];
  createBoardCards();
  renderNoTasks();
}

// empty the Container for the Segments
function resetSegments() {
  ["to-do-div", "in-progress-div", "await-feedback-div", "done-div"].forEach((e) => {
    docID(e).innerHTML = "";
  })
}

// render the Board Cards
function createBoardCards() {
  tasks.forEach((e) => {
    Board_task.push(new BoardCard(e));
  });
}

// loop to all segments and check if there are no tasks
function renderNoTasks() {
  task_amounts = getTasksAmounts();
  for (let i = 0; i < task_amounts.length; i++) {
    task_amounts[i] == 0 ? noTaskDiv(i): "";
  }
}

// render the Div if there are no tasks
function noTaskDiv(i) {
  new Div(
    segements_array[i].con.replace("-con", "-div"),
    "noTask-div-id",
    "noTask-div",
    `No Task ${segements_array[i].headline}`
  )
}

// Open the bis Board Task Card
function openBigCard(id) {
  docID("main-card-div").classList.remove("d-none");
  tasks.forEach((e) => {
    e.id == id ? new BoardBigCard(e, "main-board-card") : "";
  });
}

// close the Big Board Card
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

// storage the Dragged Element
function startDragging(e) {
  current_Dragged_Element = e;
}

// allow the drop
function allowDrop(ev) {
  ev.preventDefault();
}

// Update the task after move to a Board category
async function moveTo(category) {
  move_Task = tasks.filter((e) => e.id == current_Dragged_Element)[0];
  move_Task.container = category + "-con";
  console.log('move_Task :>> ', move_Task);
  await updateItem("task", move_Task, localStorage.getItem("token"));
  await loadContacts(localStorage.getItem("token"));
  renderBoardSegments();
}

//allow the drop when drag over
function dragOver(category) {
  allowDrop(event);
}

// filter the tasks by type in the search bar
function filterTasks() {
  word = docID("search-text-input-id").value;
  if (word != "") {
    filteredTasks = [];
    filteredTasks_Ids = [];
    filteredTasks = document.querySelectorAll(".board-card");
    filteredTasks.forEach((e) => {e.classList.add("d-none");});
    fillFilteredTasksIds(e, word)

    filteredTasks_Ids.forEach((e) => {
      docID(e).classList.remove("d-none");
    });
  } else {
    renderBoardSegments();
  }
}

// get the Ids of the filtered tasks
function fillFilteredTasksIds(e, word) {
  tasks.forEach((e) => {
    if (isMatch(e, word)) {
      let id = e.container.replace("-con", "") + `-card-${e.id}`;
      filteredTasks_Ids.push(id);
    }
  });
}

// check if the task match the search word in title, description and subtasks
function isMatch(obj, word) {
  let title = obj.title.toLowerCase().includes(word.toLowerCase());
  let description = obj.description.toLowerCase().includes(word.toLowerCase());
  let yourNameArray = nameArray(obj, word);
  return title || description || yourNameArray;
}

// check if subtask match the search word
function nameArray(obj, word) {
  output = false;
  obj.subtasks.forEach((e) => {
    if (e.toLowerCase().includes(word.toLowerCase())) {
      output = true;
    }
  });
  return output;
}

// delete the task and close the card
async function deleteCard(id) {
  token = await activeUser()
  await deleteItem("task", {"id": id}, token);
  closeCard("main-card-div", "main-board-card");
  await loadTasks(token);
  renderBoardSegments();
}

// render the Edit Card
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

// select the contacts in the menu
function checkTheBox(e) {
  e.associates.forEach((ele) => {
    docID(`check-${ele}`).checked = true;
    docID(`contact-list-parent-div-${ele}`).classList.add("active-list");
  });
}

// select the category in the menu
function checkTheCategory(e) {
  categorys.forEach((element) => {
    if (e.category.includes(element.id)) {
      docID(`category-check-${element.name}`).checked = true;
      docID(`tasks-category-${element.name}`).classList.add("active-list");
    }
  });
}

// render the subtasks
function addEditSubtasks(e) {
  subtask = [];
  e.subtasks.forEach((ele) => {
    subtask.push(ele);
  });
  subtaskListRender();
}

// update the task by the values
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

//delete unnecessary parameters
function deleteTasksParameters(e) {
  delete e.associates;
  delete e.assignedTo;
  delete e.assignedToNameTag;
  delete e.assignedToColor;
  delete e.subtaskschecked;
}

// select the checked subtasks
function editSubtaskchecked(e) {
  checked = e.subtaskschecked;
  if (subtask.length > checked.length) {
    for (let i = checked.length; i < subtask.length; i++) {
      checked.push("unchecked");
    }
  }
  return checked;
}

// update the subtasks
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
