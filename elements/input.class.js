class Input extends Elements{

        /**
     * Constructs a new instance of the class.
     *
     * @param {any} parent - The parent element to append the input element to.
     * @param {string} id - The id attribute value of the input element.
     * @param {string} className - The class attribute value of the input element.
     * @param {string} type - The type attribute value of the input element.
     * @param {string} placeholder - The placeholder attribute value of the input element.
     */
    constructor(parent, id, className, type, placeholder) {
        super("input", id, className);
        this.element.type = type;
        this.element.placeholder = placeholder;
        docID(parent).appendChild(this.element);
    }
}