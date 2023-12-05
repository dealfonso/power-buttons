'use strict';

if (typeof exports === 'undefined') {
    var exports = window;
}

// We'll create a namespace for the plugin, that will contain the plugin itself
exports.powerButtons = function(param1, param2 = null, param3 = null) {

    // We are going to support three different ways of calling the plugin:
    //   - powerButtons(pluginName, els, options)
    //   - powerButtons(selector, options)
    //   - powerButtons(el, options)
    //   - powerButtons(els, options)
    
    let pluginName = null;
    let els = [];
    let options = {};

    function registeredPlugin(pluginName) {
        for (let actionName in PowerButtons.actionsRegistered) {
            if (pluginName.toLocaleLowerCase() === actionName.toLocaleLowerCase()) {
                return actionName;
            }
        }
        return null;
    }

    if (typeof(param1) === "string") {
        // Let's check if the plugin is registered
        pluginName = registeredPlugin(param1);
        if (pluginName === null) {
            // If the plugin is not registered, we'll assume that it is a selector and this is powerButtons(selector, options)
            els = document.querySelectorAll(param1);
            if (els.length === 0) {
                console.error(`Parameter ${param1} is neither the name of a registered plugin nor a valid selector`);
                return;
            }

            // If the second parameter is not an object or there are three parameters, we'll raise an error
            if (arguments.length > 2) {
                console.warn(`Ignoring extra parameters`);
            }
            options = param2;
        } else {
            // If the plugin is registered, this is powerButtons(pluginName, els, options)
            let valid = false;
            if (typeof(param2) === "string") {
                els = document.querySelectorAll(param2);
                valid = true;
            } else if (param2 instanceof HTMLElement) {
                els = [ param2 ];
                valid = true;
            } else if (param2.length !== undefined) {
                valid = true;
                for (let e in param2) {
                    if (! (param2[e] instanceof HTMLElement)) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    els = param2;
                }
            }
            if (! valid) {
                console.error(`Parameter ${param2} is neither a valid selector, a list of elements or an HTMLElement`);
                return;
            }
            options = param3;
        }
    } else if (param1 instanceof HTMLElement) {
        els = [ param1 ];
    } else if (param1.length !== undefined) {
        for (let e in param1) {
            if (! (param1[e] instanceof HTMLElement)) {
                console.error(`Parameter ${param1} is neither a valid selector, a list of elements or an HTMLElement`);
                return;
            }
        }
        els = param1;
    } else {
        console.error(`Parameter ${param1} is neither a valid selector, a list of elements or an HTMLElement`);
        return;
    }

    if (options === null) {
        options = {};
    }
    if (typeof(options) !== "object") {
        console.error(`Options parameter must be an object`);
        return;
    }

    // Retrieve the keys of the registered plugins
    if (pluginName !== null) {
        let plugin = PowerButtons.actionsRegistered[pluginName];
        for (let el of els) {
            plugin.initialize(el, options);
        }
    } else {
        // We are discovering the plugins and parameters from the tag
        PowerButtons.discover(els, options);
    }
};

exports.powerButtons.version = '2.1.0';
exports.powerButtons.plugins = function() {
    return Object.keys(PowerButtons.actionsRegistered);
}

exports.powerButtons.discoverAll = function() {
    PowerButtons.discoverAll();
}

exports.powerButtons.discover = function(els, options) {
    PowerButtons.discover(els, options);
}

if (document.addEventListener !== undefined) {
    document.addEventListener('DOMContentLoaded', function(e) {
        PowerButtons.discoverAll();
    });
}

// Now we add the plugin to jQuery, if it has been loaded
if (exports.$ !== undefined) {
    exports.$.fn.powerButtons = function(pluginName, options = {}) {
        exports.powerButtons(pluginName, this, options);
        return this;
    }
    exports.$.fn.powerButtons.version = exports.powerButtons.version;
    exports.$.fn.powerButtons.plugins = exports.powerButtons.plugins;
}function pascalToSnake(str) { return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_*/,'') };
function pascalToKebab(str) { return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-*/,''); }
function snakeCaseToCamel(str) { return str.replace(/-([a-z])/g, g => g[1].toUpperCase()); }
function pascalToCamel(str) { return str.charAt(0).toLowerCase() + str.slice(1); }
function CamelToCamel(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function isElement(el) { return el instanceof Element || el instanceof HTMLDocument; }

/**
 * Parses a boolean value from a string or a boolean value (e.g. "true" => true, "false" => false, "yes" => true, 
 *  "no" => false, "1" => true, "0" => false)
 * @param {*} value 
 * @returns 
 */
function parseBoolean(value) {
    if (typeof(value) === "boolean") {
        return value;
    }
    if (typeof(value) === "string") {
        value = value.toLowerCase();
        if (value === "true" || value === "yes" || value === "1") {
            return true;
        }
        return false;
    }
    return !!value;
}

/**
 * This function creates a tag object using a notation like the one used for query selectors (e.g. div#myid.myclass.myclass2)
 *   if ommited the tag name, it will be considered as a div (e.g. #myid.myclass1.myclass2 or .myclass1.myclass2)
 * @param {*} tag tag to create in the form '<tag>#<id>.<class1>.<class2>'
 * @param {*} props other properties to set to the element (e.g. attributes) ** if is a text, it will be interpreted as the text param
 * @param {*} html html content to set to the element (if prop is set to a string, this param will be ignored)
 * @returns the objet
 */
function createTag(tag, props = {}, html = null) {
    let parts_id = tag.split('#');

    let id = null;
    if (parts_id.length == 1) {
        tag = parts_id[0];
    } else {
        parts_id[1] = parts_id[1].split('.')
        id = parts_id[1][0];
        tag = [ parts_id[0], ...parts_id[1].slice(1) ].join('.');
    }

    let parts = tag.split('.');
    tag = parts[0];
    if (tag === "") {
        tag = "div";
    }

    if (typeof(props) === "string") {
        html = props;
        props = {};
    }

    if (html !== null) {
        props.innerHTML = html;
    }

    if (id !== null) {
        props.id = id;
    }

    props.className = [ props.className, ...parts.slice(1) ].filter(function(e) {
        return `${e}`.trim() !== "";
    }).join(" ");

    let el = document.createElement(tag);
    for (let prop in props) {
        if (el[prop] !== undefined) {
            el[prop] = props[prop];
        } else {
            el.setAttribute(prop, props[prop]);
        }
    }
    return el;
}

/**
 * This function is a proxy to Element.append, but it returns the object, to enable to chain actions
 * @param {*} el The element to append to
 * @param  {...any} args The objects to append to the element
 * @returns the element
 */
function appendToElement(el, ...args) {
    let filtered = args.filter((e) => e !== null && e !== undefined);
    el.append(...filtered);
    return el;
}

/**
 * This function searches for a form in the document. It first tries to find the form by name, and if it fails, it tries
 *  to find the form assuming that the parameter was a query selector.
 * If the form is not found, it will return null
 *  (*) If a selector is provided, we are checking if the HTML Element is actually a form, but we are only issuing a warning;
 *      the object is returned anyway just in case it is useful for the caller
 * @param {*} formName, the name of the form to search for (or the query selector)
 * @returns an HTMLElement or null if the form was not found
 */
function searchForm(formName) {
    let formObject = null;
    if (formName !== null) {
        // first we are assuming that the form is a name
        formObject = document.forms[formName];

        if (formObject === undefined) {
            // if it was not a form name (or ID) let's assume that the form is a selector
            formObject = document.querySelector(formName);
            if (formObject === null) {
                console.warn(`form ${formName} not found`);
            }
        }    
    }
    if (formObject !== null) {
        if (formObject.tagName.toLowerCase() !== "form") {
            console.warn(`form ${formName} is not a form`);
        }
    }
    return formObject;
}

/**
 * Checks wether a value is a javascript expression or not, because it starts with "javascript:". If it is, it executes
 *  the expression and returns the result. If not, it returns the value as it is.
 * @param {*} value, the value to check
 * @param {*} context, the context to use when executing the javascript code (i.e. the this object)
 * @returns the value or the result of the javascript code
 */
function getValueWithJavascriptSupport(value, context = null) {
    // If it is a function, we'll simply return the function bound to the context
    if (typeof(value) === "function") {
        return value.bind(context);
    }

    // If it is a string, we'll check if it starts with javascript: and, if so, we'll return a function that will
    //  execute the code and return the result
    if (typeof(value) === "string") {
        let internalValue = value.trim();
        // If the value starts with javascript:, we'll execute the code and use the result as value
        if (internalValue.startsWith("javascript:")) {
            try {
                let f = internalValue.substring(11);
                value = function() {
                    return eval(f)
                }.bind(context);
            } catch (e) {
                console.error(`Error executing javascript code ${internalValue.substring(11)}, error: ${e}`);
                value = null;
            }
        }
    }

    // And finally, we return the value
    return value
}

/**
 * Returns a promise that will be resolved when the event is triggered in the element
 * @param {HTMLElement} el, the element to wait for the event
 * @param {string} event, the event name to wait for
 * @returns a promise that will be resolved when the event is triggered
 */
function promiseForEvent(el, event) {
    let resolveFunction = null;
    let promise = new Promise((resolve) => {
        resolveFunction = resolve;
    });
    let handler = function() {
        el.removeEventListener(event, handler);
        resolveFunction();
    }
    el.addEventListener(event, handler);
    return promise;
}

/**
 * Returns wether the object is empty or not. An object is considered empty if it is null, undefined, an empty string, an empty array or an empty object
 * @param {*} obj, the object to check
 * @returns true if the object is null, undefined, an empty string, an empty array or an empty object
 */
function isEmpty(obj) {
    if (obj === null || obj === undefined) {
        return true;
    }
    if (obj instanceof Array) {
        return obj.length === 0;
    }
    if (obj instanceof Object) {
        return Object.keys(obj).length === 0;
    }
    if (typeof(obj) === "string") {
        return obj.trim() === "";
    }
    return false;
}class DialogLegacy {
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
}class Dialog {
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
        return promiseForEvent(this.dialog, "shown.bs.modal")
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
            closeButton = createTag("button.close.btn-close", { type: "button", "aria-label": "Close" });
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
                let buttonObject = createTag("button.btn" + buttonClass + ".button" + i, { type: "button" }, button.text);

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

        let dialog = appendToElement(
            createTag(".modal.fade", { tabindex : "-1", role : "dialog", "aria-hidden" : "true", "data-keyboard": "false"  }),
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
function confirmDialog(message, title = "this action needs confirmation", onConfirm = null, onCancel = null, cancellable = true) {
    let dialog = new Dialog({
        title: title,
        message: message,
        buttons: [
            { text: "Cancel", class: "btn-secondary", handler: onCancel },
            { text: "Confirm", class: "btn-primary", handler: onConfirm }
        ],
        escapeKeyCancels: cancellable
    });
    dialog.show();
    return dialog;
}

function alertDialog(message, title = "Alert", onAccept = null) {
    let dialog = new Dialog({
        title: title,
        message: message,
        buttons: [
            { text: "Accept", class: "btn-primary", handler: onAccept }
        ],
        escapeKeyCancels: true
    });
    dialog.show();
    return dialog;
}

/**
 * Function that creates a loading dialog (i.e. non-closeable dialog)
 * @param {*} message, the message to display
 * @param {*} customContent, the custom content to display
 * @param {*} canCancel, function that is called when the user clicks on the cancel button. If returns false, the dialog cannot be closed
 * @returns a dialog object
 * 
 * NOTE: the prototype of the function is (message, customContent, canCancel), but it can also be called with (message, canCancel)
 */
function loadingDialog(message, customContent = null, canCancel = null) {
    if (typeof(customContent) === "function") {
        canCancel = customContent;
        customContent = null;
    }

    let dialog = new Dialog({
        title: null,
        message: message,
        buttons: [
            { text: "Cancel", class: "btn-primary" }
        ],
        customContent: customContent,
        escapeKeyCancels: false,
        close: false,
        header: false,
        footer: false,
    }, canCancel);
    dialog.show();
    return dialog;
}

if (exports.powerButtons.utils === undefined) {
    exports.powerButtons.utils = {};
}

Object.assign(exports.powerButtons.utils, {
    confirmDialog: confirmDialog,
    alertDialog: alertDialog,
    loadingDialog: loadingDialog
});class PowerButtons {
    // The list of actions registered in the library
    static actionsRegistered = {};

    /**
     * Registers one action in the library (it must be an Action object)
     * @param action, the action to be registered
     */
    static registerAction(action) {
        this.actionsRegistered[action.NAME.toLowerCase()] = action;

        if (exports.powerButtons === undefined) {
            exports.powerButtons = {};
        }
        if (exports.powerButtons.defaults === undefined) {
            exports.powerButtons.defaults = {};
        }
        exports.powerButtons.defaults[action.NAME.toLowerCase()] = Object.assign({}, action.DEFAULTS);
    }

    /**
     * Retrieves the options for an action, by merging the defaults of the action with the defaults of the window and the options
     * @param {*} action, the action to retrieve the defaults for
     * @param {*} options, the options to merge with the defaults
     * @returns an object that contains the options for the action, merged with the defaults for the action and the default
     *   options for the window
     */
    static getActionSettings(action, options) {
        if (this.actionsRegistered[action.NAME.toLowerCase()] === undefined) {
            console.error(`The action ${action.NAME} is not registered`);
            return {};
        }

        let defaultsWindow = {};

        if ((exports.powerButtons !== undefined) && (exports.powerButtons.defaults !== undefined) && (exports.powerButtons.defaults[action.NAME.toLowerCase()] !== undefined)) {
            defaultsWindow = exports.powerButtons.defaults[action.NAME.toLowerCase()];
        }

        // Merge the defaults of the action with the defaults of the window and the options
        return Object.assign({}, action.DEFAULTS, defaultsWindow, options);
    }

    /**
     * Adds an action to the list of actions to be executed. First makes sure that the element has the support for the actions 
     *  of this library
     * @param {*} el, the HTML element to add the action to
     * @param {*} options, the options for the action
     */
    static addAction(el, options = {}) {
        // Add (or get) the support for the actions of this library
        let powerButton = PowerButtons.addActionSupport(el);

        // Add the action to the list
        powerButton.appendAction(options);
    }        

    /**
     * Checks if the element has the support for the actions of this library, and if not, adds it
     * @param {*} el, the HTML element to add the support to
     * @returns an instance of PowerButtons that supports the actions of this library for the element
     */
    static addActionSupport(el) {
        // Add support for each element in the list (just add the sidecar object if it does not exist)
        if (el._powerButtons === undefined) {
            el._powerButtons = new PowerButtons(el);
        } else {
            el._powerButtons.reset();
        }
        return el._powerButtons;
    }

    // The HTML element to which this sidecar is attached
    el = null;
    // The current action to be executed
    current_action = 0;
    // The ordered list of actions to be executed
    actions = [];
    // The previous onclick event
    back_onclick = null;

    /**
     * Adds the support for the actions of this library to the HTML element (i.e. adds the _powerButtons sidecar property and a click handler)
     * @param {*} el, the HTML element to add the support to 
     */
    constructor(el) {
        el._powerButtons = this;

        this.el = el;
        this.current_action = 0;
        this.actions = [];
        this.back_onclick = null;

        // First we'll remove the onclick method, if exists and back it
        if ((el.onclick !== undefined) && (el.onclick !== null)) {
            this.back_onclick = el.onclick;
            el.onclick = null;
        }

        // Now we'll add the handler for the click event
        el.addEventListener("click", this.handlerClick.bind(this));
    }

    /**
     * Adds an action to the list of actions to be executed
     * @param {*} options, the options for the action
     */
    appendAction(options = {}) {
        if (options.type === undefined) {
            throw "The type of the action is mandatory";
        }
        this.actions.push(options);
    }

    handlerClick(e) {
        // If we have confirmed anything, just execute the onclick
        if (this.current_action >= this.actions.length) {
            this.current_action = 0;

            // TODO: check if onclick works together with the onclick event; I think it does not, and it should be called
            //    el.click() (if exists), then _back_onclick (if exists) and if both work, not prevent default (then the code
            //    below should be removed)

            // If there was a previous onclick event, we'll execute it
            if (typeof(this.back_onclick) === 'function') {
                if (!this.back_onclick()) {
                    e.preventDefault();
                }
            }
            return;
        }

        // Grab the current settings
        let currentActionSettings = this.actions[this.current_action];

        // Has confirmations pending
        e.preventDefault();

        // Prevent from executing the other handlers
        e.stopImmediatePropagation();

        /**
         * This is a handler for the accept button of the dialog (or the confirmation button), to execute the next action by simulating a click event
         */
        let onNextAction = function() {
            // Continue with the action, by simulating the common click action
            this.current_action++;

            // If it is the last confirmation, we'll execute the legacy click event (if exists; otherwise we'll dispatch an event to fire jquery events (click method already fires them))
            if (this.current_action >= this.actions.length) {
                // TODO: check whether onclick (i.e. el.click) and other event handlers work together (I think that el.dispatchEvent(...) should be also called if not returned false)
                if (this.el.click !== undefined) {
                    this.el.click();
                } else {
                    this.el.dispatchEvent(new Event(e.type, e));
                }
            } else {
                this.el.dispatchEvent(new Event(e.type, e));
            }
        }.bind(this);

        // Get the action to execute and execute it
        let action = this.constructor.actionsRegistered[currentActionSettings.type];
        if (action === undefined) {
            throw `The action ${currentActionSettings.type} is not registered`;
        }
        action.execute(this.el, currentActionSettings, onNextAction, () => this.reset());
    }

    /**
     * Resets the current action to the first one
     */
    reset() {
        this.current_action = 0;
    }

    /**
     * Function that initializes the actions of this library, by calling the `discoverAll` method of each action. The idea
     *   is that the `discoverAll` searches for the elements that have the data attributes for the action and initializes
     *   them.
     */
    static discoverAll() {
        Object.entries(this.actionsRegistered).forEach(([key, action]) => {
            action.discoverAll();
        });
    }

    static discover(els, options = {}) {
        Object.entries(this.actionsRegistered).forEach(([key, action]) => {
            action.discover(els, options);
        });
    }
}class Action {
    static NAME = null;

    static register() {
        PowerButtons.registerAction(this);
    }

    static DEFAULTS = {};

    /**
     * Extract the values of the options in the DEFAULTS of the class from the data attributes of the element
     * 
     *   - The data attributes are assumed to be named like data-{prefix}-{option} in the HTML element, where 
     *     {prefix} is the prefix provided (or the name of the action) and {option} is the name of the option
     *     in the DEFAULTS of the class. 
     * 
     *     For example, if the prefix is "verify" and the option is "title", the data attribute will be 
     *     data-verify-title and the value will be set to the option "title" in the extracted options object.
     * 
     *     It is important to note that the values that will be extracted from the data attributes, will be
     *     those keys that are defined in the DEFAULTS of the class. If the data attribute is not defined in the
     *     DEFAULTS, it will be ignored.
     * 
     *   - The map is used to map the data attribute names to the options names. 
     * 
     *     Reasoning: if we wanted an option named "verify" and we used the prefix "verify", the data attribute
     *       would be data-verify-verify, which is not very nice looking. So, we can use the map to map the data 
     *       key to the expected data attribute name. If the map is { 'verify': 'verify' }, to fill the key 'verify'
     *       in the resulting options object, the data attribute will be data-verify, instead of data-verify-verify.
     *       This also works for renaming the data attribute, so if we set a map { 'form': 'formset' }, to fill the 
     *       key 'form' in the options object, the data attribute to use will be data-formset.
     * 
     * @param {HTMLElement} el, the element to extract the options from
     * @param {string} prefix, the prefix to use for the data attributes (if not provided, the name of the action will be used)
     * @param {object} map, the map to use to map the data attribute names to the options names (if not provided, the map will be empty)
     * 
     * @returns an object with the extracted options, with (at most) the same keys as the DEFAULTS of the class, but
     *      only those that are defined in the data attributes of the element.
     */
    static extractOptions(el, prefix = null, map = null) {
        if (prefix === null) {
            prefix = this.NAME.toLowerCase();
        }

        if (map === null) {
            map = {};
            map[prefix] = prefix;
        }

        // Now walk the dataset and extract the options
        let options = {};
        for (let key in this.DEFAULTS) {
            let targetKey = key;
            if (map[targetKey] !== undefined) {
                targetKey = map[targetKey];
            } else {
                targetKey = prefix + CamelToCamel(targetKey);
            }
            if (el.dataset[targetKey] !== undefined) {
                options[key] = el.dataset[targetKey];
            }
        }
        return options;
    }

    /**
     * Initializes the element, by registering the action to the PowerButtons library.
     * 
     *   - The data attributes are assumed to be named like data-{prefix}-{option} in the HTML element, where
     *     {prefix} is the prefix provided (or the name of the action) and {option} is the name of the option
     *     in the DEFAULTS of the class.
     *   - The values are the values to use for the initialization of the action. They will be merged with the
     *     DEFAULTS of the class and the values extracted from the data attributes.
     *   - The values provided in the `values` parameter will have precedence over the values extracted from the, and
     *     the keys should be those defined in the DEFAULTS of the class.
     *   - The map is used to map the data attribute names to the options names (see `extractOptions` for more info).
     * 
     * @param {HTMLElement} el, the element to initialize
     * @param {object} values, the specific values to use for the initialization appart from the default ones
     */
    static initialize(el, values = {}) {
        PowerButtons.addAction(el, Object.assign({type: this.NAME.toLowerCase()},
                                values));
    }

    /**
     * Searches for any element with a data-{name} attribute, extract the values from the dataset (if any) and initializes 
     *  it using the `discover` method. (see `discover` for more info).
     */
    static discoverAll() {
        let prefix = this.NAME.toLowerCase();
        this.discover(document.querySelectorAll(`[data-${prefix}]`));
    }

    /**
     * Extract the values from the dataset (if any) and initializes it using the `initialize` method. (see `initialize` for more info).
     * 
     * @param {HTMLElement | Array(HTMLElement)} els, the element(s) to discover the action for
     * @param {object} options, the options to override for the initialization of the action from those extracted from the data attributes and the user-provided ones.
     * @param {boolean} skipInitialized, if true, it will skip the element if it has already been initialized (i.e. if it has the _powerButtons._discover property contains the name
     *     of this action as a value in the array)
     */
    static discover(els, options = {}, skipInitialized = true) {
        if (els.length === undefined) {
            els = [ els ];
        }

        let prefix = this.NAME.toLowerCase();

        for (let el of els) {
            if ((skipInitialized) && (el._powerButtons !== undefined) && (el._powerButtons._discover !== undefined) && (el._powerButtons._discover.indexOf(prefix) !== -1)) {
                continue;
            }
            if (el.dataset[prefix] === undefined) {
                continue;
            }

            let currentOptions = Object.assign(this.extractOptions(el, prefix), options);
            this.initialize(el, currentOptions);
            if (el._powerButtons !== undefined) {
                if (el._powerButtons._discover === undefined) {
                    el._powerButtons._discover = [];
                }
                if (! el._powerButtons._discover.includes(prefix)) {
                    el._powerButtons._discover.push(prefix);
                }
            }
        }
    }

    /**
     * Executes the action
     * @param {HTMLElement} el, the element that triggered the action (i.e. the element that has the data-{name} attribute)
     * @param {object} options, the options to use for the execution of the action (those extracted from the data attributes and the user-provided ones)
     * @param {function} onNextAction, the action to execute after the current one has finished (i.e. to be executed to get to the next action in the process)
     * @param {function} onCancelActions, the actions to execute if the user cancels the current action (i.e. to stop executing actions)
     */
    static execute(el, options, onNextAction, onCancelActions) {
        throw new Error("The execute method must be implemented by the derived class");
    }
}
class ActionVerify extends Action {
    static NAME = "Verify";

    static DEFAULTS = {
        // The function to call to verify the action. It must return a true or false value. If it is an string, it will be evaluated as javascript, using _eval_
        verify: null,
        // The form to bind the verification to. If it is a string, it will be interpreted as a selector (it is not verified if it is a form or any other object). If null, the verification will be bound to the document
        form: null,
        // The content of the message to show to the user if verified to true (it can be either plain text or a HTML fragment)
        verified: null,
        // The content of the message to show to the user if verified to false (it can be either plain text or a HTML fragment)
        notVerified: "The condition for this action is not met",
        // A custom content to show to the user under the message when verified (it can be either plain text or a HTML fragment)
        customContentVerified: null,
        // A custom content to show to the user under the message when not verified (it can be either plain text or a HTML fragment)
        customContentNotVerified: null,
        // The content of the title of the dialog when the condition is not verified (it can be either plain text or a HTML fragment)
        titleNotVerified: "The action requires verification",
        // The content of the title of the dialog when the condition is verified (it can be either plain text or a HTML fragment)
        titleVerified: null,
        // The content for the button that confirms the action (it can be either plain text or a HTML fragment)
        buttonAccept: "Accept",
        // If falshi (i.e. null, 0, false, "false"), the button to close the dialog will not be shown
        buttonClose: false,
        // If falshi (i.e. null, 0, false, "false"), the esc key will not close the dialog (it will close it if true)
        escapeKey: true,
        // If falshi (i.e. null, 0, false, "false"), the head of the dialog will be hidden
        header: true,
        // If falshi (i.e. null, 0, false, "false"), the footer of the dialog will be hidden
        footer: true
    }

    static execute(el, options, onNextAction, onCancelActions) {
        // We merge the options with the defaults to get a valid settings object
        let settings = PowerButtons.getActionSettings(this, options);

        let result = null;
        let bindObject = searchForm(settings.form);
        if (bindObject === null) {
            bindObject = document;
        }
        try {
            if (typeof(settings.verify) === 'function') {
                result = settings.verify.bind(bindObject)();
            } else if (typeof(settings.verify) === 'string') {
                result = function() {
                    return eval(settings.verify)
                }.bind(bindObject)();
            } else {
                result = parseBoolean(settings.verify);
            }
        } catch (e) {
            console.error("Error executing verification function", e);
            result = false;
        }

        let dialog = null;
        let onVerificationSuccess = onNextAction;
        let onVerificationFailure = onCancelActions;

        if (result) {
            if ((settings.verified !== null) || (settings.customContentVerified !== null) || (settings.titleVerified !== null)) {
                dialog = Dialog.create({
                    title: settings.titleVerified,
                    message: settings.verified,
                    customContent: settings.customContentVerified,
                    buttons: [ settings.buttonAccept ],
                    escapeKeyCancels: settings.escapeKey,
                    close: settings.buttonClose,
                }, null, function(result) {
                    if (onVerificationSuccess !== null) {
                        onVerificationSuccess();
                    }
                });
            }
        } else {
            if ((settings.notVerified !== null) || (settings.customContentNotVerified !== null) || (settings.titleNotVerified !== null)) {
                dialog = Dialog.create({
                    title: settings.titleNotVerified,
                    message: settings.notVerified,
                    customContent: settings.customContentNotVerified,
                    buttons: [ settings.buttonAccept ],
                    escapeKeyCancels: settings.escapeKey,
                    close: settings.buttonClose,
                }, null, function(result) {
                    if (onVerificationFailure !== null) {
                        onVerificationFailure();
                    }
                });
            }
        }

        if (dialog !== null) {
            dialog.show();
        } else {
            if (result) {
                if (onVerificationSuccess !== null) {
                    onVerificationSuccess();
                }
            } else {
                if (onVerificationFailure !== null) {
                    onVerificationFailure();
                }
            }
        }
    }
}

ActionVerify.register();class ActionConfirm extends Action {
    static NAME = "Confirm";

    static DEFAULTS = {
        // The content of the message to show to the user (it can be either plain text or a HTML fragment)
        confirm: "Please confirm this action",
        // A custom content to show to the user under the message (it can be either plain text or a HTML fragment)
        customContent: null,
        // The content of the title of the dialog (it can be either plain text or a HTML fragment)
        title: "The action requires confirmation",
        // The content for the button that confirms the action (it can be either plain text or a HTML fragment)
        buttonConfirm: "Confirm",
        // The content for the button that cancels the action (it can be either plain text or a HTML fragment)
        buttonCancel: "Cancel",
        // If falshi (i.e. null, 0, false, "false"), the button to close the dialog will not be shown
        buttonClose: true,
        // If falshi (i.e. null, 0, false, "false"), the esc key will not close the dialog (it will close it if true)
        escapeKey: true        
    };

    static extractOptions(el, prefix = null, map = null) {
        let options = super.extractOptions(el, prefix, map);
        if (options.confirm.trim() == "") {
            delete options.confirm;
        }
        return options;
    }

    static execute(el, options, onNextAction, onCancelActions) {
        // We merge the options with the defaults to get a valid settings object
        let settings = PowerButtons.getActionSettings(this, options);

        // We'll create the dialog
        let dialog = Dialog.create({
            title: settings.title,
            message: settings.confirm,
            customContent: settings.customContent,
            buttons: [ settings.buttonConfirm, settings.buttonCancel ],
            escapeKeyCancels: settings.escapeKey,
            close: settings.buttonClose,
        }, null, function(result) {
            if (result === 0) {
                // The user has confirmed the action
                if (onNextAction !== null) {
                    onNextAction();
                }
            } else {
                // The user has cancelled the action
                if (onCancelActions !== null) {
                    onCancelActions();
                }
            }
        });

        // We'll show the dialog
        dialog.show();
    }        
}

ActionConfirm.register();class ActionAsyncTask extends Action {
    static NAME = "AsyncTask";

    static DEFAULTS = {
        // The function to call to execute the action.
        task: null,
        // The content of the message to show to the user while the task is being executed (it can be either plain text or a HTML fragment)
        message: "Please wait...",
        // A custom content to show to the user under the message (it can be either plain text or a HTML fragment)
        customContent: null,
        // The content of the title of the dialog (it can be either plain text or a HTML fragment)
        title: null,
        // The content for the button that cancels the action (it can be either plain text or a HTML fragment)
        buttonCancel: "Cancel",
        // The function to call to cancel the action (if null, the button will not be shown)
        cancel: null,
        // If falshi (i.e. null, 0, false, "false"), the head of the dialog will be hidden
        header: true,
        // If falshi (i.e. null, 0, false, "false"), the footer of the dialog will be hidden
        footer: true
    }

    // Overwrite to rename the data attribute
    static extractOptions(el, prefix = null, map = null) {
        return super.extractOptions(el, prefix, { task: "asynctask" });
    }
    
    static execute(el, options, onNextAction, onCancelActions) {
        // We merge the options with the defaults to get a valid settings object
        let settings = PowerButtons.getActionSettings(this, options);

        if (settings.task === null) {
            console.error("The task to execute cannot be null");
            return;
        }

        // Create the task to execute
        let task = null;
        if (typeof(settings.task) === "string") {
            task = async function() {
                return await eval(settings.task);
            }
        } else if (typeof(settings.task) === "function") {
            task = settings.task;
        } else {
            console.error("The task to execute must be either a string or a function");
            return;
        }

        // Prepare the cancel button (if there is a cancel handler)
        let buttons = [];
        let cancelHandler = null;
        if (settings.cancel !== null) {
            buttons = [ settings.buttonCancel ];
            if (typeof(settings.cancel) === "string") {
                cancelHandler = function() {
                    eval(settings.cancel);
                }
            } else if (typeof(settings.cancel) === "function") {
                cancelHandler = settings.cancel;
            } else {    
                console.error("The cancel handler must be either a string or a function");
            }
        }

        // Finally, create the dialog
        let dialog = Dialog.create({
            title: settings.title,
            message: settings.message,
            customContent: settings.customContent,
            buttons: buttons,
            escapeKeyCancels: false,
            close: false,
            header: (options.header !== undefined)?settings.header : (settings.title!==null&&settings.title!= ""),
            footer: (options.footer !== undefined)?settings.footer : (cancelHandler!==null),
        }, function() {
                cancelHandler();
                onCancelActions();
            }, function(result) {
            if (onNextAction !== null) {
                onNextAction();
            }
        });

        // Show the dialog and execute the task
        dialog.show().then(
            function() {
                // The dialog has been shown, so we'll execute the task (once the task is finished, we'll hide the dialog)
                task().finally(function() {
                    dialog.hide();
                });
            }
        );
    }
}

ActionAsyncTask.register();class ActionShowMessage extends Action {
    static NAME = "ShowMessage";
    static DEFAULTS = {
        // The content of the message to show to the user (it can be either plain text or a HTML fragment)
        showmessage: "This is a message",
        // A custom content to show to the user under the message (it can be either plain text or a HTML fragment)
        customContent: null,
        // The content of the title of the dialog (it can be either plain text or a HTML fragment)
        title: null,
        // If falshi (i.e. null, 0, false, "false"), the button to close the dialog will not be shown
        buttonAccept: "Accept",
        // If falshi (i.e. null, 0, false, "false"), the esc key will not close the dialog (it will close it if true)
        escapeKey: true,
        // If falshi (i.e. null, 0, false, "false"), the button to close the dialog will not be shown
        buttonClose: true,
        // If falshi (i.e. null, 0, false, "false"), the head of the dialog will be hidden
        header: true,
        // If falshi (i.e. null, 0, false, "false"), the footer of the dialog will be hidden
        footer: true
    }

    static execute(el, options, onNextAction, onCancelActions) {
        // We merge the options with the defaults to get a valid settings object
        let settings = PowerButtons.getActionSettings(this, options);

        // We'll create the dialog
        let dialog = Dialog.create({
            title: settings.title,
            message: settings.showmessage,
            customContent: settings.customContent,
            buttons: [ settings.buttonAccept ],
            escapeKeyCancels: settings.escapeKey,
            close: settings.buttonClose,
            header: (options.header !== undefined)?settings.header : (settings.title!==null&&settings.title!= ""),
            footer: (options.footer !== undefined)?settings.footer : (settings.buttonAccept!==null&&settings.buttonAccept!= ""),
        }, null, function(result) {
            if (onNextAction !== null) {
                onNextAction();
            }
        });

        // We'll show the dialog
        dialog.show();
    }    
}

ActionShowMessage.register();class ActionFormset extends Action {
    static NAME = "Formset";

    static DEFAULTS = {
        // The form whose values are to be set
        form: null,
        // The fields to set
        fields: {}
    }

    static extractOptions(el, prefix = null, map = null) {

        let options = super.extractOptions(el, prefix, { form: "formset" });

        let fields = {};
        for (let key in el.dataset) {
            if (key.startsWith(prefix)) {
                let fieldname = key.substring(prefix.length);
                if (fieldname === '') {
                    continue;
                }
                if (fieldname[0] !== fieldname[0].toUpperCase()) {
                    // The field names must be always set as data-formset-inputfield; so data-formsetinput-field will be ignored
                    //  just in case we have other plugin that uses the corresponding prefix
                    continue;
                }
                fieldname = fieldname.toLocaleLowerCase();
                // The rest if the key is the field name
                fields[fieldname] = el.dataset[key];
            }
        }

        // Just in case we have any field in the default values, we merge them with the extracted ones
        if (options.fields === undefined) {
            options.fields = {};
        }
        Object.assign(options.fields, fields);

        return options;
    }

    static execute(el, options, onNextAction, onCancelActions) {
        // We merge the options with the defaults to get a valid settings object
        let settings = PowerButtons.getActionSettings(this, options);

        let formToSet = null;
        let inputFields = [];
        let elements = [];

        if (settings.form == "") {
            // This is a special shortcut to
            // 1. set the form to the form that contains the button
            // 2. set the value of an input that is not in any form
            if (el.form !== null) {
                // The element is in a form, so we'll set the form to the form that contains the button
                formToSet = el.form;
            } else {
                // The element is not in a form, so we are dealing with the inputs that are not in a form
                elements = Array.from(document.querySelectorAll('input')).filter(input => input.form === null);
            }
        } else {
            // We'll get the form to set using the provided selector (or name)
            formToSet = searchForm(settings.form);
            if (formToSet === null) {
                console.error(`Form not found ${settings.form}`);
                return;
            }
        }

        // If there is a form, we'll get the input fields
        if (formToSet !== null) {
            elements = Array.from(formToSet.elements);
        }

        // Now use the lowercase name and id of the input fields to create a map
        //
        // As the dataset attributes are always in camelCase, the name of the fields to set is case insensitive. So
        //   in the form we may have the field <input name="Name"> but in the button the attribute should be data-setform-name="John"
        //
        // This mechanism restricts the existence of the same field name for different fields in the form, with different
        //   case. For example, if we have the fields <input name="Name"> and <input name="name">, we'll set the value for
        //   the last one, as the map will have the reference to it.
        elements.forEach(element => {
            if (element.name !== '') {
                inputFields[element.name.toLocaleLowerCase()] = element;
            }
            if (element.id !== '') {
                inputFields[element.id.toLocaleLowerCase()] = element;
            }
        });

        // Now we'll set the values of the fields
        for (let field in settings.fields) {
            if (inputFields[field] !== undefined) {
                let value = settings.fields[field];

                // Get the value with the support for javascript expressions; if the form is null, we'll use the inputFields
                let result = getValueWithJavascriptSupport(value, formToSet !== null ? formToSet : inputFields);
                if (typeof(result) === 'function') {
                    try {
                        result = result();
                    } catch (e) {
                        console.error(`Error executing ${value}`, e);
                        continue;
                    }
                }
                inputFields[field].value = result;
            }
        }

        // Continue with the action chain
        onNextAction();
    }
}

ActionFormset.register();class ActionFormButton extends Action {
    static NAME = "FormButton";

    static DEFAULTS = {
        // The URL to submit the form
        formbutton: null,
        // The method to use for the form
        method: 'post',
        // The class to use for the form
        formClass: 'formbutton',
        // Wether to convert the case of the payload names to kebab-case, snake_case, camelCase or PascalCase
        convertCase: 'none',
        // The id to use for the form
        formId: null,
        // The additional fields to add to the form, along with their values
        fields: {}
    }

    static extractOptions(el, prefix = null, map = null) {
        let options = super.extractOptions(el, prefix, map);

        let fields = {};
        prefix = prefix + "Field";
        for (let key in el.dataset) {
            if (key.startsWith(prefix)) {
                let fieldname = key.substring(prefix.length);
                if (fieldname === '') {
                    continue;
                }
                if (fieldname[0] !== fieldname[0].toUpperCase()) {
                    // The field names must be always set as data-formset-inputfield; so data-formsetinput-field will be ignored
                    //  just in case we have other plugin that uses the corresponding prefix
                    continue;
                }

                // Because of attributes are always in camelCase, as we remove the beggining part (i.e. formbuttonPayload), then rest
                // of the attribute name is in PascalCase. So we'll convert it to the case specified in the data-formbutton-convert-case
                switch (options.convertCase) {
                    case 'kebab':
                        fieldname = pascalToKebab(fieldname);
                        break;
                    case 'snake':
                        fieldname = pascalToSnake(fieldname);
                        break;
                    case 'camel':
                        fieldname = pascalToCamel(fieldname);
                        break;
                    case 'pascal':
                        break;
                }                

                // The rest if the key is the field name
                fields[fieldname] = el.dataset[key];
            }
        }

        // Just in case we have any field in the default values, we merge them with the extracted ones
        if (options.fields === undefined) {
            options.fields = {};
        }
        Object.assign(options.fields, fields);

        return options;
    }

    /**
     * In this case, we are going to replace the button with a form, and add the button to the form.
     * 
     * If there are any fields to be calculated with javascript, we'll add them as an action to the
     *  powerButton, so they are calculated when the button is clicked.
     */
    static initialize(el, values = {}) {

        // We need to extract the options from the element, and merge them with the default values here
        //  because they have no sense in the operation of the action
        let settings = PowerButtons.getActionSettings(this, values);

        // Create the form and set the properties
        let form = document.createElement('form');
        form.method = settings.method;

        if (!isEmpty(settings.formbutton)) {
            form.action = settings.formbutton;
        }
        if (settings.formId !== null) {
            form.id = settings.formId;
        }
        let cssClasses = settings.formClass.split(' ');
        for (var i = 0; i < cssClasses.length; i++) {
            if (!isEmpty(cssClasses[i])) {
                form.classList.add(cssClasses[i]);
            }
        }

        // Make sure that the button is a submit button
        el.type = 'submit';    

        // Calculate the functions to get the values of the fields, if any
        let fields = {};
        for (let fieldName in settings.fields) {
            fields[fieldName] = getValueWithJavascriptSupport(settings.fields[fieldName], form);
        }

        // Here we'll store the fields that are functions, so we can calculate them when the button is clicked
        let pendingFields = {};
        
        for (let fieldName in fields) {
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = fieldName;
            if (typeof (fields[fieldName]) === 'function') {
                input.value = "";
                pendingFields[fieldName] = fields[fieldName];
            } else {
                input.value = fields[fieldName];
            }
            form.appendChild(input);
        }

        // And finally, replace the button with the form and add the button to the form
        el.parentNode.replaceChild(form, el);
        form.appendChild(el);

        // If there are any pending fields (i.e. functions), we'll add the action to the powerButton, 
        //  so it is executed when the button is clicked.
        if (Object.keys(pendingFields).length > 0) {
            settings.fields = pendingFields;
            settings._formObject = form;
            super.initialize(el, settings);
        }
    }

    static execute(el, options, onNextAction, onCancelActions) {
        // We merge the options with the defaults to get a valid settings object
        let settings = PowerButtons.getActionSettings(this, options);

        let error = false;
        for (let fieldName in settings.fields) {
            try {
                let value = settings.fields[fieldName]();
                settings._formObject[fieldName].value = value;
            } catch (e) {
                console.error(`Error obtaining value for field ${fieldName}: ${e}`,);
                error = true;
            }
        }
        if (error) {
            onCancelActions();
        } else {
            onNextAction();
        }
    }
}

ActionFormButton.register();