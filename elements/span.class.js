class Span extends Elements {

        /**
     * Constructs a new instance of the class.
     *
     * @param {parent} parent - The parent element.
     * @param {id} id - The ID of the element.
     * @param {className} className - The CSS class name of the element.
     * @param {data} data - The text content of the element.
     */
    constructor(parent, id, className, data) {
        super('span', id, className)
        this.element.textContent = data;
        docID(parent).appendChild(this.element);
    }
}