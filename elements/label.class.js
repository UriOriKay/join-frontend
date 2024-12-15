class Label extends Elements {

        /**
     * Creates a new Label element and appends it to the specified parent.
     *
     * @param {Object} parent - The parent element to append the Label to.
     * @param {string} name - The name of the Label.
     * @param {string} text - The text content of the Label.
     * @return {void}
     */
    constructor(parent, name, text) {
        super('label', `label${name}`, undefined)
        this.element.for = name;
        this.element.textContent = text;
        docID(parent).appendChild(this.element);
    }
}