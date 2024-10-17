class PowerButtons {
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
         * @param {*} override, if true, it will override any other action and will assume that the callee was the last one
         */
        let onNextAction = function(override = false) {
            // Continue with the action, by simulating the common click action
            if (override) {
                this.current_action = this.actions.length;
            } else {
                this.current_action++;
            }

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
}