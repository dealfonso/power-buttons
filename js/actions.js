class Action {
    static NAME = null;

    static register(exports) {
        PowerButtons.registerAction(this);
    }

    static DEFAULTS = {};

    /**
     * Extract the values of the options in the DEFAULTS of the class from the data attributes of the element
     *   - The data attributes are assumed to be named like data-{prefix}-{option} in the HTML element, where 
     *     {prefix} is the prefix provided (or the name of the action) and {option} is the name of the option
     *     in the DEFAULTS of the class. 
     * 
     *     For example, if the prefix is "verify" and the option is "title", the data attribute will be 
     *     data-verify-title and the value will be set to the option "title" in the extracted options object.
     * 
     *     It is important to note that the values that will be extracted from the data attributes will be
     *     those that are defined in the DEFAULTS of the class. If the data attribute is not defined in the
     *     DEFAULTS, it will be ignored.
     * 
     *   - The map is used to map the data attribute names to the options names. 
     * 
     *     Reasoning: if we wanted an option named "verify" and we used the prefix "verify", the data attribute
     *       would be data-verify-verify, which is not very nice. So, we can use the map to map the data attribute
     *       names to the options names. If the map is { verify: "" }, the data attribute be data-verify will be
     *       used to set the option "verify" in the extracted options object.
     * 
     * @param {*} el 
     * @param {*} prefix 
     * @param {*} map 
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

        let options = extractValues(this.DEFAULTS, el.dataset, prefix, map);
        return options;
    }

    /**
     * Searches the element for attributes in the dataset estructure that correspond to this action, and initializes 
     * the element, by adding the action using the class PowerButtons.
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
     * @param {*} values, the specific values to use for the initialization appart from the default ones
     * @param {*} prefix, the prefix to use for the data attribute (defaults to the name of the action in lowercase)
     * @param {*} map, a map of the data attribute names to the options names; if not provided, it will be assumed 
     *                 that the data attribute names are the same as the options names using the camelCase convention
     */
    static initialize(el, values = {}, prefix = null, map = null) {
        let options = this.extractOptions(el, prefix, map);

        options.type = this.NAME;

        PowerButtons.addAction(el, Object.assign({},
                                options, 
                                extractValues(this.DEFAULTS, values)));
    }

    /**
     * Searches for any element with a data-{prefix} attribute and initializes it using the `initialize` method.
     *   (see `initialize` for more info).
     * @param {*} values, the specific values to use for the initialization appart from the default ones
     * @param {*} prefix, the prefix to use for the data attribute (defaults to the name of the action in lowercase)
     * @param {*} map, a map of the data attribute names to the options names; if not provided, it will be assumed 
     *                 that the data attribute names are the same as the options names using the camelCase convention
     */
    static initializeAll(values = {}, prefix = null, map = null) {
        if (prefix === null) {
            prefix = this.NAME.toLowerCase();
        }

        for (let el of document.querySelectorAll(`[data-${prefix}`)) {
            this.initialize(el, values, prefix, map);
        }        
    }

    /**
     * Executes the action
     * @param {*} options, the options to use for the execution of the action (those extracted from the data attributes and the
     *                     user-provided ones)
     * @param {*} onNextAction, the action to execute after the current one has finished (i.e. to be executed to get to the next
     *                          action in the process)
     * @param {*} onCancelActions, the actions to execute if the user cancels the current action (i.e. to stop executing actions)
     */
    static execute(options, onNextAction, onCancelActions) {
        throw new Error("The execute method must be implemented by the derived class");
    }
}
