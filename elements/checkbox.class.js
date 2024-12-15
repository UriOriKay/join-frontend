class Checkbox extends Elements{
 
    /**
     * Creates a new instance of the CheckboxInput class.
     *
     * @param {Object} parent - The parent element to append the checkbox to.
     * @param {string} id - The ID of the checkbox element.
     * @param {string} className - The CSS class name of the checkbox element.
     * @return {CheckboxInput} - The newly created CheckboxInput instance.
     */
    constructor(parent, id, className) {
        super("input", id, className);
        this.element.type = 'checkbox';
        docID(parent).appendChild(this.element);
    }
}