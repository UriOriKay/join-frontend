class Elements{

    element;
        /**
     * Creates a new element with the specified HTML tag, ID, and class name.
     *
     * @param {string} html_tag - The HTML tag of the element.
     * @param {string} id - The ID of the element.
     * @param {string} className - The class name of the element.
     */
    constructor(html_tag, id, className) {
        this.element = document.createElement(html_tag);
        this.element.id =  id;
        this.element.className = className;
    }

        /**
     * Generate a function comment for the given function body.
     *
     * @param {type} e - description of parameter
     * @param {type} parent - description of parameter
     * @return {type} description of return value
     */
    depart(e, parent) {
        let color;
        let div_id;
        for (let i = 0; i < e.category.length; i++) {
            color = this.backgroundcolor(e.category[i]);
            div_id = `${parent}-${i}-div`      
            new Div(parent, div_id, "department-card");
            new Span(div_id,"","deparment-span", categorys.filter( ele => ele.id == e.category[i])[0].name);
            docID(div_id).style = `background-color: var(${color})`;
        }
    }
    
    /**
 * Returns the background color for a given department.
 *
 * @param {string} department - The name of the department.
 * @return {string} The color associated with the department.
 */
    backgroundcolor(department) {
        let color;
        categorys.forEach((e) => {
            if(e.id == department) {
                color = e.color;
            }
        });
        return color
    }
}
