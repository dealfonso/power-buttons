class ActionFormset extends Action {
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

            console.debug("form is empty");

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

ActionFormset.register();