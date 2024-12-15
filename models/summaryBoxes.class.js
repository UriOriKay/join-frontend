class SummaryBox {
  item;
  headline_amount;
  id;
  containerWidth;
  containerHeight;
  spanheight;
  gapColoumn;
  gapRow;
  item_amountPerRow;
  rowAmount;
  row;
  itemWidth;
  itemHeight;
  top;
  left;
  index;
  taskAmount;

  constructor(id, index) {
    this.id = id;
    this.index = index;
    this.taskAmount = task_amounts[index]; //Variable aus summary.js
    this.item = this.generateItemHTML(id, index);
    this.checkScreenView(index);
    this.renderPosition();
  }

createFirstBox() {
  docID(`item-${summaryBox_div_id}-0`).innerHTML ="";
  new Div(`item-${summaryBox_div_id}-0`,`item-${summaryBox_div_id}-0-1`, "col");
  new Div(`item-${summaryBox_div_id}-0-1`, 'div-row', "row");
  new Img('div-row', "", "", images[0]);
  new Headline("h1", 'div-row', `task_amounts-${summaryBox_div_id}-0`, "", task_amounts[0]);
  new Headline("h6",`item-${summaryBox_div_id}-0-1`, "", "",descriptions[0]);
  new Div(`item-${summaryBox_div_id}-0`, 'first-box');
  new Headline("h6", 'first-box', 'upcoming-deadline', "", "Upcoming Deadline");
  new Span('first-box', "", "", task_amounts[6]);
  docID(`first-box`).onclick = navToBoard;
}

  generateItemHTML(id, index) {
    new Div(`${id}-${index}`, `item-${id}-${index}`, "col");
    new Div(`item-${id}-${index}`, `item-${id}-${index}-row`, 'row')
    new Img(`item-${id}-${index}-row`, "","", images[index])
    this.headline_amount = new Headline("h1", `item-${id}-${index}-row`, `task_amounts-${id}-${index}`, "", task_amounts[this.index])
    new Headline("h6",`item-${id}-${index}-row`, "", "",descriptions[index])
    docID(`item-${id}-${index}`).onclick = navToBoard;
  }

  updateTaskAmount(taskAmount, index) {
    docID(`task_amounts-${this.id}-${index}`).textContent = taskAmount;
 }

  renderPosition() {
    docID(`item-${this.id}-${this.index}`).style.width = `${this.itemWidth}px`;
    docID(`item-${this.id}-${this.index}`).style.height = `${this.itemHeight}px`;
    docID(`item-${this.id}-${this.index}`).style.left = `${this.left}px`;
    docID(`item-${this.id}-${this.index}`).style.top = `${this.top}px`;
  }

  checkScreenView(index) {
    if (window.innerWidth > screen_size) {
      this.calcPositionDesktop(index);
    } else {
      this.calcPositionMobile(index);
    }
  }


  calcPositionDesktop(index) {
    this.containerWidth = 798;
    this.containerHeight = 478;
    this.spanheight = 36;
    this.gapColoumn = 16;
    this.gapRow = this.gapColoumn;
    this.item_amountPerRow = item_amount - 2;
    this.rowAmount = 2;
    this.row = 0;

    this.itemWidth =
      this.containerWidth / this.item_amountPerRow - this.gapColoumn;

    this.height = this.containerHeight - this.spanheight;
    this.itemHeight = this.height / this.rowAmount - this.gapRow;

    if (index == 0) {
      let singleContainer = this.item_amountPerRow - 1;
      this.itemWidth =
        (this.containerWidth * singleContainer) / this.item_amountPerRow -
        this.gapColoumn;
      index = 0;
    } else if (index == 1) {
      index = this.item_amountPerRow - 1; //letztes in der ersten Reihe
    } else {
      index = index - 2; //min 2, -2 da 2 in der ersten Reihe
      this.row = 1;
    }

    this.top =
      this.spanheight +
      this.gapRow / 2 +
      this.row * this.itemHeight +
      this.row * this.gapRow;

    this.left =
      this.gapColoumn / 2 + index * this.itemWidth + index * this.gapColoumn;
  }

  calcPositionMobile(index) {
    this.item_amountPerRow = 2;
    this.rowAmount = 4;
    this.gapColoumn = 8;
    this.gapRow = 8;
    this.containerWidth = window.innerWidth * 0.9 - 2;
    this.height = window.innerHeight * 0.8 - 2; // gesamtbreite - 10% (nav) - 10% (header) -2px für Rand
    this.itemWidth = this.containerWidth / this.item_amountPerRow - this.gapColoumn;
    this.itemHeight = this.height / this.rowAmount - this.gapRow;

    this.row = 0;

    if (index == 0) {
       this.itemWidth = this.containerWidth - this.gapColoumn;
    } else if (index == 1) {
      this.itemWidth = this.containerWidth - this.gapColoumn;
      index = 0;
      this.row = 1;
    } else if (index == 2 || index == 3) {
      index = index - 2;
      this.row = 2;
    } else {
      index = index - 4;
      this.row = 3;
    }

    this.top =
      this.gapRow / 2 + this.row * this.itemHeight + this.row * this.gapRow;

    this.left =
      this.gapColoumn / 2 + index * this.itemWidth + index * this.gapColoumn;
  }
}
