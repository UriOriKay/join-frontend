class MenuLink{
    name;
    anchor_id;
    anchor_class = "nav-link font-body";
    anchor_href;
    img;
    img_id;
    img_src;
    parent;
    
    /**
     * Constructs a new instance of the Constructor class.
     *
     * @param {Object} parent - the parent object
     * @param {string} id - the ID of the object
     */
    constructor(parent, id) {
        this.name = id.charAt(0).toUpperCase() + id.slice(1);
        this.name = this.name.replace("_t", " T");
        this.anchor_id = `${id}-link`;
        this.anchor_href = `${id}.html`;
        this.img_id = `${this.anchor_id}-img`
        this.img_src = `../assets/img/${id}_menu.png`;
        this.parent = parent
        new Anchor(parent, this.anchor_id, this.anchor_class, this.anchor_href);
        this.img = new Img(this.anchor_id, this.img_id, undefined, this.img_src);
        new Span(this.anchor_id, "", "", this.name);
        docID(this.img_id).alt = id;
    }
}

