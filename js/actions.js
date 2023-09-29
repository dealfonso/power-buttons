class Action {
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
     *  it using the `initialize` method. (see `initialize` for more info).
     * 
     * @param {object} values, the specific values to use for the initialization appart from the default ones; if not provided,
     *                   the values will be extracted from the data attributes
     */
    static initializeAll(values = null) {
        let prefix = this.NAME.toLowerCase();

        for (let el of document.querySelectorAll(`[data-${prefix}`)) {
            let options = null;
            if (values === null) {
                options = this.extractOptions(el, prefix);
            } else {
                options = Object.assign({}, values);
            }
            this.initialize(el, options);
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
