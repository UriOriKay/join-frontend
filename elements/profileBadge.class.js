class ProfilBagde{
    container; //parent-div
    container_id; // id of parent-div
    container_class = "profile-badge"; //name of class
    span_id; // id for name
    span_class = ""; // span has no classes

    /**
     * Constructs a new instance of the constructor function.
     *
     * @param {string} parent - The ID of the parent element.
     * @param {number} index - The index of the element.
     * @param {string} color - The color of the background.
     * @param {string} text - The text to be displayed.
     */
    constructor(parent, index, color, text) {
        this.container_id = `${parent}-profile_badgeCon-${index}`;
        this.span_id = `contact_itemNameTag-${index}`
        new Div(parent, this.container_id, this.container_class);
        docID(this.container_id).style = `background-color: var(${color})`;
        new Span(this.container_id, this.span_id, this.span_class, text);
    }
}
