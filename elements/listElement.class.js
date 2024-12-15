class ListElement extends Elements {

      /**
     * Constructs a new instance of the class.
     *
     * @param {parent} parent - The parent element.
     * @param {id} id - The ID of the element.
     * @param {className} className - The class name of the element.
     */
    
    constructor(parent, id, className) {
        super('li', id, className);
        docID(parent).appendChild(this.element);
    }
}