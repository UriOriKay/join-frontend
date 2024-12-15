class Img extends Elements {

        /**
     * Constructs a new instance of the ImageElement class.
     *
     * @param {string} parent - the ID of the parent element
     * @param {string} id - the ID of the image element
     * @param {string} className - the class name of the image element
     * @param {string} src - the source URL of the image
     */
    constructor(parent, id, className, src) {
        super("img", id, className);
        this.element.src = src;
        docID(parent).appendChild(this.element);
    }
}