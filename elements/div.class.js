class Div extends Elements {
    /**
     * Constructs a new instance of the ClassName class.
     *
     * @param {type} parent - The parent element where the new element will be appended.
     * @param {type} id - The ID of the new element.
     * @param {type} className - The class name of the new element.
     * @param {type} data - The data to be set as the text content of the new element.
     */
    constructor(parent, id, className, data) {
        super('div', id, className)
        this.element.textContent = data == undefined ? "" : data;
        docID(parent).appendChild(this.element);
        
    }
}