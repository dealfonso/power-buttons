/**
 * A class to manage a dialog provided by the user. This means that it will need selectors (for the buttons, the title, the message, etc)
 *  to be provided by the user, to be able to customize the content of the dialog.
 */
class DialogCustom extends Dialog {
    DEFAULTS = {
        // The title of the dialog
        title: "Title",
        // The selector for the title of the dialog
        titleSelector: null,
        // The message of the dialog
        message: "Main message",
        // The selector for the message of the dialog
        messageSelector: null,
        // A custom content to add to the dialog (it will be added after the message)
        customContent: null,
        // The selector for the custom content of the dialog
        customContentSelector: null,
        // List of buttons in the dialog. The first button will have index 0, the second index 1, and so on. The content may
        // be a string (the text of the button), or an object { text: "text", classes: [ "class1", "class2" ]}
        buttons: [ "Accept" ],
        // The selector for the buttons of the dialog
        buttonsSelector: null,
        // If true, the button can be closed by pressing the escape key (no button will be clicked)
        escapeKeyCancels: true,
        // If false, the whole header will be hidden (the title will be hidden too; the close button will be added to the body)
        header: true,
        // The selector for the header of the dialog (it is assumed that is shown; if needed, it will be hidden using the selector)
        headerSelector: null,
        // If false, the whole footer will be hidden (the buttons will be added to the body)
        footer: true,
        // The selector for the footer of the dialog (it is assumed that is shown; if needed, it will be hidden using the selector)
        footerSelector: null,
        // If false, the whole body will be hidden (the message and the custom content will be hidden too)
        body: true,
        // The selector for the body of the dialog (it is assumed that is shown; if needed, it will be hidden using the selector)
        bodySelector: null,
        // If true, the dialog will have a close button (i.e. cross) in the top right corner. Clicking this button will call the
        //   onButton function with the index -1
        close: true,
        // The selector for the close button of the dialog (it is assumed that is shown; if needed, it will be hidden using the selector)
        closeSelector: null,
    };

    _buttonHandlers = [];

    constructor (options = {}, onButton = null, onHidden = null) {
        if ((exports.bootstrap === undefined) || (exports.bootstrap.Modal === undefined)) {
            throw new Error("Bootstrap is required to use this class");
        }

        this.options = { ...this.DEFAULTS, ...options };
        this.onButton = onButton;
        this.onHidden = onHidden;

        console.warn("This class is for advanced users only. If you are not sure about what you are doing, use the Dialog class instead");
        console.warn("This class is not finished yet. It may not work as expected");
    }

    /**
     * This function is called when the dialog is finally hidden
     */
    _hiddenHandler() {
        for (let i = 0; i < this._buttonHandlers.length; i++) {
            this._buttonHandlers[i].button.removeEventListener("click", this._buttonHandlers[i].handler);
        }
        this._buttonHandlers = [];

        // Call the parent handler (if any)
        super._hiddenHandler();
    }


    /**
     * Prepares the dialog to be shown. It will try to select the dialog using the selector provided by the user (dialogSelector), and
     *  if it is not found, it will try to create it using the dialogFunction provided by the user.
     * 
     * @throws An exception if the dialog could not be found or created
     */
    _build_dialog(options) {
        let dialog = null;
        if (options.dialogSelector !== null) {
            dialog = document.querySelector(options.dialogSelector);
        } 
        if (options.dialogFunction !== null) {
            dialog = options.dialogFunction();
            if (! dialog instanceof HTMLElement) {
                throw "The dialog function must return an HTMLElement";
            }
        }

        if (dialog === null) {
            return null;
        }

        this._customizeDialog(dialog,
            options.titleSelector, options.title,
            options.messageSelector, options.message,
            options.customContentSelector, options.customContent,
            options.headerSelector, options.header,
            options.footerSelector, options.footer,
            options.bodySelector, options.body,
            options.closeSelector, options.close,
        );

        if (options.buttonsSelector.length !== options.buttons.length) {
            throw `The number of buttons (${options.buttons.length}) does not match the number of selectors (${options.buttonsSelector.length})`;
        }

        this._buttonHandlers = [];

        for (let i = 0; i < options.buttons.length; i++) {
            this._customizeDialog(dialog, options.buttonsSelector, options.buttons[i]);
            let buttonObject = dialog.querySelector(options.buttonsSelector[i]);

            if (buttonObject !== null) {
                this._buttonHandlers[i] = {
                        handler: function() {
                                    let button = {
                                        text: buttonObject.innerHTML, 
                                        class: Array.from(buttonObject.classList).join(" ") 
                                    };
                                    this._handleButton(i, button, buttonObject);
                                }.bind(this),
                        button: buttonObject
                    };
                buttonObject.addEventListener("click", this._buttonHandlers[i].handler);
            }
        }

        return dialog;
    }

    /** Customizes a dialog by searching for elements and settings its values (if they are different from null)
     * @param {HTMLElement} dialog The dialog to customize
     * @param  {...any} elements A list of elements to customize. Each element is a selector followed by a value. 
     *                  If the value is null, the element is not customized.
     *                  If the value is false, the element is hidden.
     */
    _customizeDialog(dialog, ...elements) {
        for (let i = 0; i < elements.length; i++) {
            let elementSelector = elements[i];
            let elementValue = elements[++i];
            if (elementValue !== null) {
                let element = dialog.querySelector(elementSelector);
                if (element !== null) {
                    console.error(`The element ${elementSelector} could not be found in the dialog`);
                } else {
                    if (elementValue === false) {
                        element.style.display = "none";
                    } else {
                        element.innerHTML = elementValue;
                    }
                }
            } 
        }
    }
}