class Headline extends Elements {

        /**
     * Creates a new instance of the Constructor class.
     *
     * @param {string} html_tag - The HTML tag of the element.
     * @param {string} parent - The parent element's ID.
     * @param {string} id - The ID of the element.
     * @param {string} className - The class name of the element.
     * @param {string} textContent - The text content of the element.
     */
    constructor(html_tag, parent, id, className, textContent) {
        super(html_tag, id, className);
        this.element.textContent = textContent;
        docID(parent).appendChild(this.element);
    }
}