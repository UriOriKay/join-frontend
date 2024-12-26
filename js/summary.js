let screen_size = 1023; //screenWidth of Window, needed for summary Boxes
let item_amount = 6; //changeable nummber of boxes
let summary_boxes = []; //array of summary boxes

let descriptions = [
  "Tasks urgent",
  "Tasks in Board",
  "Tasks To-do",
  "Tasks in Progress",
  "Awaiting Feedback",
  "Tasks done",
  "Tasks done",
];

let images = [
  "../assets/img/urgent_summary.png",
  "../assets/img/board_summary.png",
  "../assets/img/to_do_summary.png",
  "../assets/img/in_progress_summary.png",
  "../assets/img/await_feedback_summary.png",
  "../assets/img/done_summary.png",
  "../assets/img/urgent_summary.png",
];

// initiation of the summary site
async function initSummary() {
  let token = await activeUser(); //check if user is logged in
  init(); //rencer Header and Navbar
  await generateGreetingMessage(); //generate greeting message
  response = await getItem("task/summary", token); //get task amounts
  task_amounts = await response.json() //turn the tasks amounts in a JSON
  createSummaryBoxes(); //create the summary boxes
  setNavBarActive("summary-link"); // set summary in the navbar active
}

// render the greeting message
function generateGreetingMessage() {
  let greeting = getGreeting(); // get the appropriate greeting by time
  new Div("greetings", "greetings-span", "font-t1", `${greeting}${active_user.name === "Guest" ? "" : ","}`);
  new Div("greetings", "greeting-name", "", active_user.name === "Guest" ? "" : active_user.name);
}

// get the appropriate greeting by time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Good Morning"; //good morning between 6 & 12
  if (hour >= 12 && hour < 18) return "Good Afternoon"; // good afternoon between 12 & 18
  if (hour >= 18 && hour < 21) return "Good Evening"; // good evening between 18 & 21
  return "Good Night"; // good night between 21 & 6
}


function createSummaryBoxes() {
  let summaryBox_div_id = "summary-box"; // storage the id of Container of the summary boxes
  docID(summaryBox_div_id).innerHTML = ""; // clear the container
  // create the summary boxes and push them in the summary_boxes array
  for (let i = 0; i < item_amount; i++) { 
    new Div(summaryBox_div_id, `${summaryBox_div_id}-${i}`);
    summary_boxes.push(new SummaryBox(summaryBox_div_id, i));
  }
  summary_boxes[0].createFirstBox(summaryBox_div_id);
}

// relocate to the Board
function navToBoard() {
  window.location = "../html/board.html";
}

// change the paaramter of the summary boxes by the window size
window.addEventListener("resize", function () {
  changeScreenView();
});


function changeScreenView() {
  for (let index = 0; index < summary_boxes.length; index++) {
    const element = summary_boxes[index]; // get the current element
    element.checkScreenView(index); // change the size of the summary boxes by the window size
    element.renderPosition(index); // change the position of the summary boxes by the window size
  }
}
