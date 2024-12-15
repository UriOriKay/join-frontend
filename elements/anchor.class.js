class Anchor extends Elements {
    /**
     * Constructs a new instance of the constructor.
     *
     * @param {Object} parent - The parents object ID.
     * @param {string} id - The ID of the element.
     * @param {string} className - The class name of the element.
     * @param {string} href - The URL to link to.
     * @param {string} textContent - The text content of the element.
     */
    constructor(parent, id, className, href, textContent) {
        super('a', id, className);
        this.element.href = href;
        this.element.textContent = textContent;
        docID(parent).appendChild(this.element);
    }
}