class Header {

    parent;
    constructor() {
        this.parent ='header-div';
        //parent header-div
        this.headerRow ='header-row';
        new Img(this.parent, '', "img-fluid", "../assets/img/logo-white.png"); //parent, id, class, src
        new Div(this.parent, this.headerRow , "header-row", "") //parent, id, class, data
        new Span(this.headerRow , '', "span-size font-t6", "Kanban Project Management Tool"); //parent, id, class, data
        new Anchor(this.headerRow , 'help', "", "../html/help.html", ""); //parent, id, class, href, textContent
        new Img('help', 'help-icon', "help-icon", "../assets/img/help.png"); //parent, id, class, src
        new Div(this.headerRow, 'dropdown-menu-div', "d-flex", ""); //parent, id, class, data
        new UnorderedListElement('dropdown-menu-div', 'dropdown-menu', "dropdown-menu"); //parent, id, class
        new ListElement('dropdown-menu', 'li-0', "dropdown-item"); //parent, id, class, data
        new Anchor('li-0', 'help-item', "", "../html/help.html", "Help"); //parent, id, class, href, textContent
        new ListElement('dropdown-menu', 'li-1', "dropdown-item"); //parent, id, class, data
        new Anchor('li-1', 'legal-notice', "", "../html/LegalNotice.html", "Legal Notice"); //parent, id, class, href, textContent
        new ListElement('dropdown-menu', 'li-2', "dropdown-item"); //parent, id, class, data
        new Anchor('li-2', 'privacy-policy', "", "../html/PrivacyPolicy.html", "Privacy Policy"); //parent, id, class, href, textContent
        new ListElement('dropdown-menu', 'li-3', "dropdown-item"); //parent, id, class, data
        new Anchor('li-3', 'logout', "", "../html/index.html", "Log Out"); //parent, id, class, href, textContent
        new Div(this.headerRow,"header-name-tag",'', "") //parent, id, class, data
        docID('logout').onclick = logout;
        docID('header-name-tag').onclick = showHeaderDropdown;

    }
}