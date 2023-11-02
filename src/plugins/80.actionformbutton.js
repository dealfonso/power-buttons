class ActionFormButton extends Action {
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