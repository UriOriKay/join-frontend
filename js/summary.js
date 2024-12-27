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

/**
 * Initializes the summary page by loading data and rendering elements.
 *
 * Workflow:
 * 1. Checks if the user is logged in and retrieves the token.
 * 2. Renders the header and navbar.
 * 3. Generates a greeting message for the user.
 * 4. Fetches the task summary data from the server.
 * 5. Creates the summary boxes to display task statistics.
 * 6. Marks the "Summary" link as active in the navbar.
 *
 * @async
 * @function initSummary
 */
async function initSummary() {
  let token = await activeUser(); //check if user is logged in
  init(); //rencer Header and Navbar
  await generateGreetingMessage(); //generate greeting message
  response = await getItem("task/summary", token); //get task amounts
  task_amounts = await response.json() //turn the tasks amounts in a JSON
  createSummaryBoxes(); //create the summary boxes
  setNavBarActive("summary-link"); // set summary in the navbar active
}

/**
 * Renders a personalized greeting message for the user.
 *
 * Workflow:
 * 1. Determines the appropriate greeting based on the current time using `getGreeting`.
 * 2. Displays the greeting and the user's name, unless the user is a guest.
 *
 * @function generateGreetingMessage
 */
function generateGreetingMessage() {
  let greeting = getGreeting(); // get the appropriate greeting by time
  new Div("greetings", "greetings-span", "font-t1", `${greeting}${active_user.name === "Guest" ? "" : ","}`);
  new Div("greetings", "greeting-name", "", active_user.name === "Guest" ? "" : active_user.name);
}

/**
 * Returns a greeting message based on the current time of day.
 *
 * Workflow:
 * - "Good Morning" for 6:00–11:59
 * - "Good Afternoon" for 12:00–17:59
 * - "Good Evening" for 18:00–20:59
 * - "Good Night" for 21:00–5:59
 *
 * @function getGreeting
 * @returns {string} The appropriate greeting message.
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Good Morning"; //good morning between 6 & 12
  if (hour >= 12 && hour < 18) return "Good Afternoon"; // good afternoon between 12 & 18
  if (hour >= 18 && hour < 21) return "Good Evening"; // good evening between 18 & 21
  return "Good Night"; // good night between 21 & 6
}

/**
 * Creates summary boxes to display task statistics.
 *
 * Workflow:
 * 1. Clears the container for the summary boxes.
 * 2. Iterates over the predefined number of items (`item_amount`).
 * 3. Creates a new summary box for each item and adds it to the `summary_boxes` array.
 * 4. Initializes the first summary box with specific content.
 *
 * @function createSummaryBoxes
 */
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

/**
 * Redirects the user to the board page.
 *
 * @function navToBoard
 */
function navToBoard() {
  window.location = "../html/board.html";
}

/**
 * Adds an event listener to monitor window resizing and dynamically update the layout.
 *
 * - Calls `changeScreenView` whenever the window is resized.
 *
 * @event window#resize
 */

window.addEventListener("resize", function () {
  changeScreenView();
});
/**
 * Updates the layout of the summary boxes based on the window size.
 *
 * Workflow:
 * 1. Iterates through all summary boxes.
 * 2. Adjusts the size and position of each box to fit the current screen size.
 *
 * @function changeScreenView
 */
function changeScreenView() {
  for (let index = 0; index < summary_boxes.length; index++) {
    const element = summary_boxes[index]; // get the current element
    element.checkScreenView(index); // change the size of the summary boxes by the window size
    element.renderPosition(index); // change the position of the summary boxes by the window size
  }
}
