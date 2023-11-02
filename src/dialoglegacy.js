class DialogLegacy {
    DEFAULTS = {
        // The message of the dialog
        message: "Main message",
        // The list of buttons to display (the first button will have index 0, the second index 1, and so on)
        // * The legacy mode only has 2 options: 2 buttons ("Accept" and "Cancel") or 1 button ("Accept"). That
        //   means that the buttons array can only have 2 or 1 elements, and the 0th element will be considered
        //   the "Accept" button, and the 1st element will be considered the "Cancel" button.
        buttonCount: 2,
    }
    constructor (options = {}, onButton = null, onHidden = null) {
        this.options = { ...this.DEFAULTS, ...options };
        this.buttonCount = this.options.buttons.length;
        this.options.buttons = [ "Accept", "Cancel" ];

        this.result = null;
        this.onButton = onButton;
        this.onHidden = onHidden;
    }
    dispose() {
    }
    show(onButton = null, onHidden = null) {
        if (onButton !== null) {
            this.onButton = onButton;
        }
        if (onHidden !== null) {
            this.onHidden = onHidden;
        }
        switch (this.buttonCount) {
            case 0:
            case 1:
                alert(this.message);
                this.result = 0;
                break;
            case 2:
                this.result = confirm(this.options.message) ? 0 : 1;
                break;
            default:
                throw `Unsupported button count ${this.buttonCount}`;
        }

        if (this.onButton !== null) {
            this.onButton(this.result, { button: this.result, text: this.options.buttons[this.result] }, null);
        }
        if (this.onHidden !== null) {
            this.onHidden(this.result, { button: this.result, text: this.options.buttons[this.result] }, null);
        }
    }
}