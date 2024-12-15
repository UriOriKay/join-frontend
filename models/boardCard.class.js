// const { Button } = require("bootstrap");

class BoardCard {
  parent;
  task;
  container;
  container_id;
  container_class = "board-card";
  departments;
  departments_id;
  departments_class = "card-dept";
  departments_content;
  description;
  description_id;
  description_class = "card-desc";
  subtask;
  subtask_id;
  subtask_class = "card-subtask";
  associates;
  associates_id;
  associates_class = "card-associates";

  priority_id;
  lastLine_div;
  lastLine_div_id;
//   drop_div_id;
//   drop_button_div_id;
//   drop_button_up_div_id;
//   drop_button_down_div_id;
//   container_child_id;
//   container_child;
  /**
   * Constructor function for creating an instance of the class.
   *
   * @param {type} e - The parameter that represents the input value.
   * @return {type} - The description of the return value.
   */
  constructor(e) {
    this.parent = e.container.replace("-con", "-div");
    this.container_id = e.container.replace("-con", "") + `-card-${e.id}`;
    
    this.departments_id = this.container_id + "department-con";
    this.description_id = this.container_id + "description-con";
    this.subtask_id = this.container_id + "subtask-con";
    this.associates_id = this.container_id + "assciates-con";
    this.drop_div_id = this.container_id + "-drop-div";
    this.drop_button_div_id = this.container_id + "drop_button-div";
    this.drop_button_up_div_id = this.container_id + "drop-button_up";
    this.drop_button_down_div_id = this.container_id + "drop-button_down";
    this.lastLine_div_id = this.container_id + "-last-line-div-id";
    this.container = new Div(this.parent,this.container_id,this.container_class);
    this.departments = new Div(this.container_id,this.departments_id,this.departments_class,this.departments_content);
    this.departments.depart(e, this.departments_id);
    this.description = new Div(this.container_id, this.description_id, this.description_class,);
    this.title(e, this.description_id)
    this.subtask = new Div(this.container_id, this.subtask_id, this.subtask_class);
    this.subtaskContent(this.subtask_id, e);
    new Div(this.container_id, this.lastLine_div_id, "last-line-div");
    this.associates = new Div(this.lastLine_div_id, this.associates_id, this.associates_class);
    this.assosciates(this.associates_id, e)
    new Img(this.lastLine_div_id, this.priority_id,"board-card-priority", e.priorityImg);
    docID(this.container_id).onclick = function () {openBigCard(e.id)};
    docID(this.container_id).ondragstart = function () {startDragging(e.id)};
    docID(this.container_id).ontouchstart = function () {checkMobile()};
    docID(this.container_id).draggable = true;
  }

  /**
   * Generates a title element for a card.
   *
   * @param {object} e - The data object containing the title and description.
   * @param {HTMLElement} parent - The parent element where the title will be appended.
   */
  title(e, parent) {
    new Span(parent, "", "card-title", e.title + "\n \n");
    new Span(parent, "", "card-desc", e.description);
  }

  /**
   * Generates the function comment for the given function.
   *
   * @param {type} parent - description of the parent parameter
   * @param {type} e - description of the e parameter
   * @return {type} description of the return value
   */
  subtaskContent(parent, e) {
    let checked_sub = 0;
    let amount_sub = e.subtasks.length;
    if (e.subtaskschecked) {
        e.subtaskschecked.forEach((ele) => {ele == 'checked' ? checked_sub++:""});
    }
    let procent = checked_sub / amount_sub * 100;
    let progress_div = `${parent}-progress-con`;
    let progress_in_id = `${progress_div}-in`;
    new Div(parent, progress_div , "progress-con");
    new Div(progress_div , progress_in_id, "progress-in");
    docID(progress_in_id).style = `width: ${procent}%`;
    new Span(parent, "","",`${checked_sub}/${amount_sub} Subtask`)
  }

  /**
   * Associates the parent element with the given values.
   *
   * @param {type} parent - the parent element to associate
   * @param {type} e - the values to associate with the parent element
   * @return {type} undefined
   */
  assosciates(parent, e) {
    let counter;
    e.assignedToNameTag.forEach((element, index) => {
      if (index < 3) {
        let div_id = `${parent}-assiciate-${index}`;
        let span_id = `${div_id}-span`;
        new Div(parent, div_id, "profile-badge badge-board");
        new Span(div_id, span_id, element[index], element);
        docID(div_id).style = `background-color: var(${e.assignedToColor[index]})`;
      }
      counter = index;
    });
    if (e.assignedToNameTag.length >= 4) {
      numberBadge(parent, `${parent}-assiciate-${counter}`, counter, 2);
    }
  }
}