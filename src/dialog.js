class Dialog {
    static create(options = {}, onButton = null, onHidden = null) {
        // If bootstrap is not supported, we'll use the legacy system dialog
        if ((exports.bootstrap === undefined) || (exports.bootstrap.Modal === undefined)) {
            return new DialogLegacy(options, onButton, onHidden);
        }
        // If the user provided a selector or a dialog function, we'll use the custom dialog
        if (((options.selector !== undefined) && (options.selector !== null))
            || ((options.dialogFunction !== undefined) && (options.dialogFunction !== null))) {
                throw new Error("not implemented, yet");
                // return new DialogCustom(options, onButton, onHidden);
        }
        // Otherwise, we'll use our bootstrap dialog (this is the preferred method)
        return new Dialog(options, onButton, onHidden);
    }

    DEFAULTS = {
        // The title of the dialog
        title: "Title",
        // The message of the dialog
        message: "Main message",
        // A custom content to add to the dialog (it will be added after the message)
        customContent: null,
        // List of buttons in the dialog. The first button will have index 0, the second index 1, and so on. The content may
        // be a string (the text of the button), or an object { text: "text", classes: [ "class1", "class2" ]}
        buttons: [ "Accept" ],
        // The classes to add to the buttons (the first button will have the first class, the second button the second class, and so on).
        //   If there are more buttons than classes, the last class will be used for all the remaining buttons
        buttonClasses: [ "btn-primary", "btn-secondary" ],
        // The classes to add to the button panel (the div that contains the buttons)
        buttonPanelClasses: [ "text-end" ],
        // If true, the button can be closed by pressing the escape key (no button will be clicked)
        escapeKeyCancels: true,
        // If false, the whole header will be hidden (the title will be hidden too; the close button will be added to the body)
        header: true,
        // If false, the whole footer will be hidden (the buttons will be added to the body)
        footer: true,
        // If false, the whole body will be hidden (the message and the custom content will be hidden too)
        body: true,
        // If true, the dialog will have a close button (i.e. cross) in the top right corner. Clicking this button will call the
        //   onButton function with the index -1
        close: true,
        // Classes to add to the dialog
        dialogClass: "",
        // A selector in which to call the focus function when the dialog is shown (i.e. the element that will receive the focus)
        focus: ""
    };

    // The HTML element of the dialog
    dialog = null;
    // The options passed to the constructor
    options = null;
    // The bootstrap modal resource
    modal = null;
    // The function to call when a button has been clicked
    onButton = null;
    // The button that was clicked (null means that the dialog was closed without clicking any button, -1 means that the close button 
    //  was clicked)
    result = null;
    // The function to call when the dialog is finally hidden (it has the prototype function(result), where result is the button that 
    //  was clicked: null means that the dialog was closed without clicking any button, -1 means that the close button was clicked)
    onHidden = null;
    // The function to call when a button is clicked (it has the prototype function(button_index, button_definition, button_object))
    onButton = null;

    constructor (options = {}, onButton = null, onHidden = null) {
        if ((exports.bootstrap === undefined) || (exports.bootstrap.Modal === undefined)) {
            throw new Error("Bootstrap is required to use this class");
        }

        this.options = { ...this.DEFAULTS, ...options };

        // Let's convert the buttons to the format we want: an array of objects { text, class, handler }
        let parsedButtons = [];
        for (let i = 0; i < this.options.buttons.length; i++) {
            let button = this.options.buttons[i];

            // We expect an object { text, class, handler }, but we can also accept a string, in which case we'll create the object
            if (typeof(button) === "string") {
                button = { text : button };
            } else {
                if (button.text === undefined) {
                    button.text = `Button ${i}`;
                }
            }
            // If no class is defined, we'll use one in the options
            if (button.class === undefined) {
                button.class = this.options.buttonClasses[Math.min(i, this.options.buttonClasses.length - 1)];
            }        

            parsedButtons.push(button);
        }
        this.options.buttons = parsedButtons;

        this.dialog = null;
        this.modal = null;
        this.result = null;
        this.onButton = onButton;
        this.onHidden = onHidden;
        this._hiddenHandler = this._hiddenHandler.bind(this);
    }

    /**
     * This function is called when the dialog is finally hidden
     */
    _hiddenHandler() {
        this.dialog.removeEventListener("hidden.bs.modal", this._hiddenHandler);
        if (this.onHidden !== null) {
            if ((this.result !== null) && (this.result >= 0)) {
                this.onHidden(this.result, { button: this.result, text: this.options.buttons[this.result] });
            } else {
                this.onHidden(this.result, null);
            }
        }
        this.dispose();
    }

    /**
     * Function that frees the resources (i.e. bootstrap modal and HTML dialog)
     */
    dispose() {
        // TODO: check if it is hidden, and if not, hide it and then free resources (that would mean to add a new handler to the hidden event)
        // this.hide();
        if (this.modal !== null) {
            this.modal.dispose();
            this.modal = null;
        }
        this.dialog.remove();
        this.dialog = null;
    }

    /**
     * Shows the dialog
     * @param {*} onButton, the function to call when a button is pressed (if null, the function passed to the constructor will be used)
     * @param {*} onHidden, the function to call when the dialog is hidden (if null, the function passed to the constructor will be used)
     */
    show(onButton = null, onHidden = null) {
        if (this.dialog === null) {
            // This should never happen, but just in case the user disposed the dialog and tries to show it again
            this.dialog = this._build_dialog(this.options);
        }
        if (this.modal === null) {
            this.modal = new bootstrap.Modal(this.dialog, { backdrop: this.options.escapeKeyCancels?true:"static", keyboard: this.options.escapeKeyCancels });
        }
        this.dialog.addEventListener("hidden.bs.modal", this._hiddenHandler);
        this.result = null;
        if (onButton !== null) {
            this.onButton = onButton;
        }
        if (onHidden !== null) {
            this.onHidden = onHidden;
        }
        this.modal.show();
        return promiseForEvent(this.dialog, "shown.bs.modal").then(() => {
            if (this.options.focus !== "") {
                this.dialog.querySelector(this.options.focus)?.focus();
            }
        });
    }

    /**
     * Hides the dialog
     */
    hide() {
        this.modal.hide();
        return promiseForEvent(this.dialog, "hidden.bs.modal")
    }

    /**
     * Handler for the button click for any button in the dialog
     * @param {*} index, the zero-based index of the button that has been pressed
     * @param {*} button, the button definition
     * @param {*} buttonObject, the html object of the button
     */
    _handleButton(index, button, buttonObject) {
        this.result = index;

        let autoHide = true;

        if (this.onButton !== null) {
            autoHide = ! (this.onButton(index, button, buttonObject) === false);
        }

        if (autoHide) {
            this.hide();
        }
    }

    /**
     * Creates the dialog object using the options
     * @param {*} options 
     * @returns an HTML object that contains the dialog
     */
    _build_dialog(options = {}) {
        let header = null;

        let closeButton = null;
        if (parseBoolean(options.close)) {
            closeButton = createTag("button.close.btn-close", { tabindex: "-1", type: "button", "aria-label": "Close" });
            closeButton.addEventListener("click", () => this._handleButton(-1, null, closeButton));
        }

        // We'll create the header if the user wants it, or if the user wants the close button
        if (parseBoolean(options.header)) {
            header = createTag(".modal-header");
            if (options.title !== null) {
                header.append(
                    appendToElement(createTag(".modal-title"),
                        appendToElement(createTag("h5", options.title))
                    ),
                );
            }
            if (parseBoolean(options.close)) {
                header.append(closeButton);
            }
        }

        let buttons = [];
        if (options.buttons !== null) {
            for (let i = 0; i < options.buttons.length; i++) {
                let button = options.buttons[i];

                // We'll create the class for the button
                let buttonClass = button.class.split(" ").map((e) => e.trim()).filter((e) => e !== "").join(".");
                if (options.footer === false) {
                    buttonClass += ".mx-1";
                }
                if (buttonClass !== "") {
                    buttonClass = "." + buttonClass;
                }

                // We'll create the button object
                let buttonObject = createTag("button.btn" + buttonClass + ".button" + i, { type: "button", tabindex: i+1 }, button.text);

                // Let's add the handler for the button. We do not need to store it because we are not removing it
                buttonObject.addEventListener("click", function() {
                    this._handleButton(i, button, buttonObject);
                    if ((button.handler !== undefined) && (button.handler !== null)) {
                        button.handler(i, button, buttonObject);
                    }
                }.bind(this));

                buttons.push(buttonObject);
            }
        }
            
        let footer = null;
        if (parseBoolean(options.footer)) {
            footer = appendToElement(createTag(".modal-footer"), ...buttons);
        }

        let body = null;
        if (parseBoolean(options.body)) {
            body = createTag(".modal-body");
            if (header === null) {
                if (parseBoolean(options.close)) {
                    body.append(appendToElement(createTag(".text-end"), closeButton));
                }    
            }
            if (options.message !== null) {
                body.append(createTag("p.message.text-center", options.message));
            }
            if (options.customContent !== null) {
                body.append(createTag(".custom-content.mx-auto", options.customContent));
            }
            if (footer === null) {
                let buttonPanelClasses = options.buttonPanelClasses.map((e) => e.trim()).filter((e) => e !== "").join(".");
                if (buttonPanelClasses !== "") {
                    buttonPanelClasses = "." + buttonPanelClasses;
                }
                appendToElement(body, appendToElement(createTag(".buttons" + buttonPanelClasses), ...buttons));
            }
        }

        let dialogClasses = options.dialogClass.split(" ").map((e) => e.trim()).filter((e) => e !== "").join(".");
        if (dialogClasses !== "") {
            dialogClasses = "." + dialogClasses;
        }

        let dialog = appendToElement(
            createTag(dialogClasses + ".modal.fade", { tabindex : "-1", role : "dialog", "aria-hidden" : "true", "data-keyboard": "false"  }),
                appendToElement(createTag(".modal-dialog.modal-dialog-centered", { role : "document" }),
                    appendToElement(createTag(".modal-content"),
                        header,
                        body,
                        footer
                    )
                )
            );
        return dialog;
    }
}
