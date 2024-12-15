class Urgencybtn{
    urgencyImg = `../assets/img/urgentImg.png`;
    mediumImg = `../assets/img/medium.svg`;
    lowImg = `../assets/img/low.png`;
    urgencyClass = "btn-red";
    mediumClass = "btn-orange";
    lowClass = "btn-green";
    img;
    colorclass;

    /**
     * Creates an Urgencybtn instance.
     * @constructor
     * @param {HTMLElement} parent - The parent element to which the urgency button will be appended.
     * @param {string} btnName - The name of the urgency button ("Urgent", "Medium", or "Low").
     */
    constructor(parent, btnName) {
        this.img = this.which(btnName, this.urgencyImg, this.mediumImg, this.lowImg);
        this.colorclass = this.which(btnName, this.urgencyClass, this.mediumClass, this.lowClass);
        this.id = this.which(btnName, this.urgencyClass, this.mediumClass, this.lowClass);

        new Button(parent, this.id, `urgency-btn ${this.colorclass}`, function () {activeUrgency(this.id)});
        new Span(this.id, "","urgency-span",btnName);
        new Img(this.id,"","urgency-img",this.img);
    }

    /**
     * Returns the value based on the urgency level.
     * @param {string} type - The urgency level ("Urgent", "Medium", or "Low").
     * @param {string} urgent - The value for the "Urgent" level.
     * @param {string} medium - The value for the "Medium" level.
     * @param {string} low - The value for the "Low" level.
     * @returns {string} - The value based on the urgency level.
     */
    which(type, urgent, medium, low) {
        if(type == "Urgent") {return urgent};
        if(type == "Medium") {return medium};
        if(type == "Low") {return low};
        }
    }
