class CustomCheckbox{
  div_id;

    /**
   * Initializes a new instance of the constructor.
   *
   * @param {string} parent - The ID of the parent element.
   * @param {string} name - The name of the element.
   * @param {string} text - The text content of the element.
   */
  constructor(parent, name, text) {
    this.div_id = `${parent}-div`;
    new Div(parent, this.div_id, "");
    new Checkbox(this.div_id, name, "checkbox");
    new Label(this.div_id, name, text);
  }
}
