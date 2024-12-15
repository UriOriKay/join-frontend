class Divinput{
    spanClass = `d-none`;
    div_input;

        /**
     * Initializes a new instance of the constructor.
     *
     * @param {type} parent - the parent element
     * @param {type} name - the name of the constructor
     * @param {type} placeholder - the placeholder value for the input
     * @param {type} id - the id of the input element
     * @param {type} cssClass - the CSS class for the input element
     * @param {type} type - the type of the input element
     */
    constructor(parent, name, placeholder, id, cssClass, type) {
        new Div(parent, name, "input-con");
        new Input(name, id, cssClass, type, placeholder);
    }
}


