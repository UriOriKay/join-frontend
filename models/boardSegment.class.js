class BoardSegment{

    container;
    con_id;
    con_class = 'board-segments';
    headline;
    headline_id;
    headline_class= "";
    headline_text;
    headline_con;
    headline_con_id;
    headline_con_class = "segment-class";
    button;
    button_id = "";
    button_class = "segments-btn";
    button_onclick;
    img;
    img_id = "";
    img_class ="";
    img_src = "../assets/img/+.png";
    childDiv;
    childDiv_id;
    childDiv_class = 'segment-content';

     /**
     * Constructor for the class.
     *
     * @param {type} parent - the parent element
     * @param {type} segment - the segment element
     * @param {type} headline - the headline element
     */

    constructor(parent, segment, headline) {
        this.con_id = `${segment}-con`;
        this.headline_con_id = `${segment}-headline-con`;
        this.button_id = `${segment}-btn`
        this.headline_text = headline;
        this.childDiv_id = `${segment}-div`;
        this.button_onclick = function () {openAddTask(`${segment}-con`);};
        this.container = new Div(parent, this.con_id, this.con_class);
        this.headline_con = new Div(this.con_id, this.headline_con_id, this.headline_con_class);
        this.headline = new Span(this.headline_con_id, this.headline_id, this.headline_class, this.headline_text);
        this.button = new Button(this.headline_con_id, this.button_id, this.button_class, this.button_onclick);
        this.img = new Img(this.button_id, this.img_id, this.img_class, this.img_src);
        this.childDiv = new Div(this.con_id, this.childDiv_id, this.childDiv_class)
       docID(this.con_id).ondrop = function () {moveTo(segment)}; 
       docID(this.con_id).ondragover = function () {dragOver(segment)}; 
    //    docID(this.con_id).ontouchmove = function () {moveTo(segment)}; 
    //    docID(this.con_id).ontouchend = function () {dragOver(segment)}; 
    }
}