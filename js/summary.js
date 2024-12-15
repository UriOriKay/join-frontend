let screen_size = 1023; //screenWidth of Window
let item_amount = 6;
let summaryBox_div_id = "summary-box";
let summary_boxes = [];
let new_number;
let sum;

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

/**
 * Initializes the summary.
 *
 * @return {Promise} A promise that resolves when the summary has been initialized.
 */
async function initSummary() {
  await activeUser();
  init();
  await generateGreetingMessage();
  task_amounts = await getSummaryItem("task/summary", active_user.token);
  createSummaryBoxes();
  setNavBarActive("summary-link");
}

/**
 * Generates a greeting message based on the current hour and displays it on the webpage.
 *
 * @return {void} This function does not return anything.
 */
function generateGreetingMessage() {
  let greeting = getGreeting();
  if (active_user.name == "Guest") {
    new Div("greetings", "greetings-span", "font-t1", greeting);
    new Div("greetings", "greeting-name", "", "");
  } else {
    new Div("greetings", "greetings-span", "font-t1", `${greeting},`);
    new Div("greetings", "greeting-name", "", active_user.name);
  }
}

/**
 * Generate a greeting based on the current hour.
 *
 * @return {string} The appropriate greeting based on the current hour.
 */
function getGreeting() {
  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour >= 6 && currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 18 && currentHour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }
  return greeting;
}

/**
 * Creates summary boxes.
 *
 */
function createSummaryBoxes() {
  docID(summaryBox_div_id).innerHTML = "";

  for (let i = 0; i < item_amount; i++) {
    new Div(summaryBox_div_id, `${summaryBox_div_id}-${i}`);
    summary_boxes.push(new SummaryBox(summaryBox_div_id, i));
  }
  summary_boxes[0].createFirstBox();
}

/**
 * Navigates to the board.html page.
 *
 * @return {undefined} No return value.
 */
function navToBoard() {
  window.location = "../html/board.html";
}
window.addEventListener("resize", function () {
  changeScreenView();
});

/**
 * Change the screen view by checking and rendering the position of each summary box.
 *
 * @param {Array} summary_boxes - An array of summary boxes.
 * @return {undefined} This function does not return a value.
 */
function changeScreenView() {
  for (let index = 0; index < summary_boxes.length; index++) {
    const element = summary_boxes[index];
    element.checkScreenView(index);
    element.renderPosition(index);
  }
}
