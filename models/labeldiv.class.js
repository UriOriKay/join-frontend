class Labeldiv{
    additionaltext;
    
    /**
     * Constructor for creating an instance of MyClass.
     *
     * @param {parentType} parent - The parent element.
     * @param {childType} child - The child element.
     * @param {string} name - The name of the element.
     * @param {boolean} optional - A flag indicating if the element is optional.
     */
    constructor(parent, child, name, optional) {
        this.additionaltext = optional ? "(optional)" : "";
        new Div(parent, child)
        new Span(child, undefined, "div-span", name + this.additionaltext)
    }
}
