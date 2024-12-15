class BoardBigCard{
    container_id = "main-bord-card";
    container_class = this.container_id;
    department;
    department_id = this.container_id + "-department";
    department_class = "card-dept";
    title;
    title_id = this.container_id + "-title";
    title_class;
    description;
    description_id = this.container_id + "-description";
    description_class = "font-t6";
    due_date;
    due_date_id = this.container_id + "-due-date";
    due_date_class;
    due_date_format;
    priority;
    priority_id = this.container_id + "-priority";
    priority_class;
    associates;
    associates_id = this.container_id + "-associates";
    associates_class;
    subtasks;
    subtasks_id = this.container_id + "-subtasks";
    subtasks_class;
    edit;
    edit_id = this.container_id + "-edit";
    edit_class = `big-card-edit`;

     /**
     * Constructor for the class.
     *
     * @param {type} e - description of the parameter e
     * @param {type} parent - description of the parameter parent
     */
    constructor(e, parent) {
        this.department = new Div(parent, this.department_id, this.department_class);
        this.department.depart(e, this.department_id);
        new Img(parent, "card-close","card-close","../assets/img/close.png");
        this.title = new Div(parent, this.title_id, this.title_class);
        new Span(this.title_id, "", "",e.title);
        this.description = new Div(parent, this.description_id, this.description_class);
        new Span(this.description_id, "", "",e.description);
        this.due_date = new Div(parent, this.due_date_id, this.due_date_class);
        this.due_date_format = this.dueDateFormat(e.date);
        new Span(this.due_date_id, "", "span-big-card", "Due Date:");
        new Span(this.due_date_id, "", "font-t6", this.due_date_format);
        this.priority = new Div(parent, this.priority_id, this.priority_class);
        new Span(this.priority_id, "", "span-big-card", "Priortiy:");
        new Span(this.priority_id, "", "font-t6 img-margin", e.priority);
        new Img(this.priority_id, "","", e.priorityImg);
        this.associates = new Div(parent, this.associates_id, this.associates_class);
        new Span(this.associates_id, "", "span-big-card", "Assigned To:");
        this.associatesCard(e);
        this.subtasks = new Div(parent, this.subtasks_id, this.subtasks_class);
        this.edit = new Div(parent, this.edit_id, this.edit_class);
        this.editContent(e)
        docID("card-close").onclick = function () {closeCard("main-card-div", "main-board-card", e)};
        this.subtasksContent(e);
    }

     /**
     * Transforms a given date from the format 'YYYY-MM-DD' to 'DD.MM.YYYY'.
     *
     * @param {string} olddate - The date to be transformed in the format 'YYYY-MM-DD'.
     * @return {string} The transformed date in the format 'DD.MM.YYYY'.
     */
    dueDateFormat(olddate) {
        let date_part = olddate.split('-');
        let new_date =date_part[2] + '.' + date_part[1] + '.' + date_part[0];
        return new_date
    }

    /**
     * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
     *
     * @param {type} element - description of the parameter 'element'
     * @return {type} description of the return value
     */
    associatesCard(element) {
        element.assignedTo.forEach((e, index) => {
            let container_id = `big-associates-${index}`
            new Div(this.associates_id, container_id, 'bigcard-associates')
            new ProfilBagde(container_id, index, element.assignedToColor[index], element.assignedToNameTag[index]);
            new Span(container_id, "", "", e)
        });
    }

     /**
     * Generates the function comment for the given function.
     *
     * @param {type} e - description of the parameter 'e'
     * @return {type} description of the return value
     */
    subtasksContent (e) {
        let checkboxs = [];
        new Span(this.subtasks_id, "", "span-big-card", "Subtasks");
        e.subtasks.forEach((element, index) => {
            let div_id = this.subtasks_id + `${index}-con-`;
            let checkbox_id = this.subtasks_id + `${index}-checkbox`
            new Div(this.subtasks_id, div_id, "bg-c")
            new Checkbox(div_id, checkbox_id, "checkbox big-card-sub") // erst Div dann checkbox, dann name
            new Span(div_id, "","", element)
            if (e.subtaskschecked[index] == 'checked') {
                checkboxs.push(checkbox_id);
            }
        })
        checkboxs.forEach((e) => {
            docID(e).checked = true;
        })
    }

     /**
     * Edit the content.
     *
     * @param {Event} e - the event object
     */
    editContent(e) {
        let div_id_1 = `${this.edit_id}-1`;
        let div_id_2 = `${this.edit_id}-2`;
        let div_class = `edit-img-con`
        new Div(this.edit_id, div_id_1, div_class);
        new Img(div_id_1, "edit-img-1","","../assets/img/delete.png");
        new Span(div_id_1, "","","Delete");
        new Div(this.edit_id, div_id_2, div_class);
        new Img(div_id_2, "edit-img-2","","../assets/img/edit.png");
        new Span(div_id_2, "","","Edit");
        docID(div_id_1).onclick = function () {deleteCard(e.id)};
        docID(div_id_2).onclick = function () {editCard(e)};
    }
}