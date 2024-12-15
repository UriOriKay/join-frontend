class Confirmation extends Elements{
    id;
    div_id;
    span_id;
    img_id;
    img;

     /**
     * Creates a new instance of the Confirmation class.
     *
     * @param {string|HTMLElement} parent - The parent element or selector.
     * @param {string} text - The text for the confirmation message.
     * @param {string} img - The image source for the confirmation icon.
     */

    constructor(parent, text, img ){
        super();
        this.div_id = `confirmation-id-div`;
        this.span_id = `span-confirmation-id`;
        this.img_id = `img-confirmation-id`;
        this.img = img;
        new Div(parent, this.div_id, "confirmation confirmation-animation", text);
        this.addImg();
        docID(this.div_id).style.animationName = "confirmation";
    }

     /**
     * Add an image to the specified div element.
     *
     * @return {undefined} This function does not return a value.
     */
    addImg(){
        if(this.img){
            new Img(this.div_id, this.img_id, "", "../assets/img/board_menu.png");
        }
    }
}
