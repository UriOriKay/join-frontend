class Contact {
  parent;
  contact_color;
  contact_name_tag;
  contact_name;
  contact_email;
  contact_phone;
  contact_idx;
  contact_item_id;
  profile_badge;
  contact_item;
  contact_inner_item;
  contact_name_tag;
  parent;

   /**
   * Initializes a new instance of the Contact class.
   *
   * @param {Object} parent - The parent object.
   * @param {string} color - The color of the contact.
   * @param {string} nameTag - The name tag of the contact.
   * @param {string} contact_name - The name of the contact.
   * @param {string} contact_email - The email of the contact.
   * @param {string} contact_phone - The phone number of the contact.
   * @param {number} idx - The index of the contact.
   * @return {void}
   */
  constructor(parent, color, nameTag, contact_name, contact_email, contact_phone, idx) {
    this.parent = parent; 
    this.contact_color = color;
    this.contact_name_tag = nameTag;
    this.contact_name = contact_name;
    this.parentArray = contact_boxes; //später in constructor oder gleich ins Backend
    this.contact_email = contact_email;
    this.contact_phone = contact_phone;
    this.contact_idx = idx;
    this.contact_item_id = `contact-item-${this.contact_idx}`;
    this.parentArray = contact_boxes; //später in constructor oder gleich ins Backend
  }
  
  /**
   * Fills the edit contact form with the contact information.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  fillEditContact() {
    docID(input_name.input_id).value = this.contact_name;
    docID(input_email.input_id).value = this.contact_email;
    docID(input_phone.input_id).value = this.contact_phone;
  }
}
