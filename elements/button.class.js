class Button extends Elements {

        /**
     * Creates a new instance of the Button class.
     *
     * @param {Object} parent - The parent element to append the button to.
     * @param {string} id - The ID of the button element.
     * @param {string} className - The class name of the button element.
     * @param {function} onclick - The onclick event handler for the button.
     * @param {string} data - The text content of the button.
     */
    constructor_array;
    constructor(parent, id, className, onclick, data) {
        super("button", id, className);
        this.element.onclick = onclick;
        this.element.textContent = data;
        docID(parent).appendChild(this.element);
    }
}


   