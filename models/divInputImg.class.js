class Divinputimg {
  div_id;
  div_onclick;
  img_id;
  img_onclick;
  imgId;
  inputfocus;
  placeholder;
  type;
  imgsrc;

  /**
   * Constructor function that initializes the properties of an object.
   *
   * @param {Object} parent - The parent object.
   * @param {string} className - The class name.
   * @param {string} type - The type.
   * @param {string} placeholder - The placeholder.
   * @param {string} imgsrc - The image source.
   * @param {string} id - The ID.
   * @param {string} div_id - The div ID.
   */
  constructor(parent, className, type, placeholder, imgsrc, id, div_id) {
    this.div_id = div_id;
    this.img_id = `${parent}-img`;
    this.input_id = id;
    this.inputForSelect(parent, className);
    this.imgsrc = imgsrc;
    this.img_onclick = this.div_onclick = imgsrc.includes("+.png") ? function () {submitSubtask("input-con-Add")} : "";
    this.img_onclick = imgsrc.includes("arrow_drop_down.png")? function () {dropdownMenu(`${parent}-img`, parent, parent)} : this.img_onclick;
    this.img_onclick = imgsrc.includes("searchLupe.png")? function () {filterTasks()} : this.img_onclick;
    this.img_id = placeholder.includes("Password")? `${id}-img` : this.img_id;
    this.img_onclick = placeholder.includes("Password")? function () {togglePassword(id)} : this.img_onclick;

    this.inputfocus = imgsrc.includes("+.png") ? `onfocusin='subtasksFocusIn()'` : "";
    this.placeholder = placeholder;
    this.type = type;
    new Div(parent, this.div_id, className);
    new Input(this.div_id, this.input_id, "font-t6 input-field", this.type, this.placeholder);
    new Img(this.div_id, this.img_id, "", imgsrc);

    docID(this.div_id).onclick = this.div_onclick;
    docID(this.img_id).onclick = this.img_onclick;
  }

    /**
   * Generates the input ID based on the parent and class name.
   *
   * @param {string} parent - The parent value.
   * @param {string} className - The class name value.
   */
  inputForSelect(parent, className) {
    if (parent == "assigned" || parent == "category") {
      this.input_id = `${className}-${parent}-input-id`;
    }
    if (parent == "subtask") {
      this.input_id = `${className}-Add`;
    }
  }
}
