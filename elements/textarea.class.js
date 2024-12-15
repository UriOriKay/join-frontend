class Textarea extends Elements{

        /**
     * Creates a new instance of the constructor.
     *
     * @param {Object} parent - The parent element to which the textarea will be appended.
     * @param {string} id - The ID of the textarea element.
     * @param {string} className - The class name of the textarea element.
     * @param {string} placeholder - The placeholder text for the textarea element.
     */
    constructor(parent, id, className, placeholder) {
        super('textarea', id, className);
        this.element.placeholder = placeholder;
        docID(parent).appendChild(this.element);
    }
}