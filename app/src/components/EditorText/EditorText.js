export default class EditorText{
    constructor(el, elCopied) {
        this.el = el;
        this.elCopied = elCopied;
        this.el.addEventListener('click', () => this.onClick());
        this.el.addEventListener('blur', () => this.onblur());
        this.el.addEventListener('input', () => this.onTextChanged());
        this.el.addEventListener('keypress', (e) => this.onKeyPress(e));
        if(this.el.parentNode.nodeName === 'A' || this.el.parentNode.nodeName === 'BUTTON' ) {
            this.el.addEventListener('contextmenu', (e) => this.onLinkEditing(e));
        }
    }

    onTextChanged() {
        this.elCopied.textContent = this.el.textContent;
    }

    onClick() {
        this.el.contentEditable = true;
        this.el.focus();
    }

    onblur() {
        this.el.removeAttribute('contentEditable');
    }

    onKeyPress(e) {
        if(e.keyCode === 13) {
            this.el.blur();
        }
    }

    onLinkEditing(e) {
        e.preventDefault();
        this.onClick();
    }

}
 
