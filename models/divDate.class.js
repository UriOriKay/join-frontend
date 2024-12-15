class Divdate extends Elements {
    min_date;

     /**
     * Constructor function for creating an instance of the class.
     *
     * @param {parent} parent - The parent element to append the input to.
     * @param {id} id - The id of the input element.
     * @param {className} className - The class name of the input element.
     * @return {void}
     */
    constructor(parent, id, className) {
        super("input", id, className)
        // min="2000-01-02"
        this.element.min = this.today()
        this.element.type = 'date';
        docID(parent).appendChild(this.element);
        docID(id).onfocus = function () {blueBorderToggle(id)};
        docID(id).onblur = function () {blueBorderToggle(id)};
    }   

    today(){
        let time = new Date;
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let formatted_month = month < 10 ? "0" + month : month
        let day = time.getDate()
        let formatted_day = day < 10 ? "0" + day : day
        let today = `${year}-${formatted_month}-${formatted_day}`; 

        return today
    }
}
