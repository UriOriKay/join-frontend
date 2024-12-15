class UnsortedListElement{

    input_id;
    li_id;
    div_id;
    img_1_id;
    img_1_src = "../assets/img/blue Pencil.png";
    img_2_id;
    img_2_src = "../assets/img/delete.png";

     /**
     * Creates an UnsortedListElement instance.
     * @constructor
     * @param {HTMLElement} parent - The parent element to which the unsorted list element will be appended.
     * @param {string} subtask - The subtask content.
     * @param {number} index - The index of the unsorted list element.
     */
    constructor(parent, subtask, index) {
        this.input_id = `sub-list-${index}`;
        this.li_id =`list-${index}`;
        this.div_id = `${this.li_id}-con`;
        this.img_1_id = `${this.li_id}-img-1`;
        this.img_2_id = `${this.li_id}-img-2`;
        new ListElement(parent, this.li_id, "list");
        new Div(this.li_id, this.div_id , "list-element");
        new Input(this.div_id, this.input_id, "", "text", "Subtask eintragen");
        new Img(this.div_id, this.img_1_id, "subtask-element", this.img_1_src);
        new Img(this.div_id, this.img_2_id, "subtask-element", this.img_2_src);
        docID(this.input_id).value = subtask;
        docID(this.input_id).onclick = function() {subtaskChange(`sub-list-${index}`, index)}
        docID(this.img_1_id).onclick = function() {subtaskChange(`sub-list-${index}`, index)}
        docID(this.img_2_id).onclick = function() {deleteSubtask(index)};
    }
}

