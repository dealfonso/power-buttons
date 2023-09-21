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

    static execute(options, onNextAction, onCancelActions) {
        // We merge the options with the defaults to get a valid settings object
        let settings = PowerButtons.getActionSettings(this, options);

        // Get the form to set using the provided selector (or name)
        let formToSet = searchForm(settings.form);
        if (formToSet === null) {
            console.error(`Form not found ${settings.form}`);
            return;
        }

        // As the dataset attributes are always in camelCase, the name of the fields to set is case insensitive. So
        //   in the form we may have the field <input name="Name"> and in the button the attribute data-setform-name="John"
        //   We'll do this by creating a map of the field name in lowercase and the field name in the form, and then
        //   we'll use the map to set the values.
        //
        // This mechanism restricts the existence of the same field name for different fields in the form, with different
        //   case. For example, if we have the fields <input name="Name"> and <input name="name">, we'll set the value for
        //   the last one, as the map will have the reference to it.
        let nameMap = {};
        for (var i = 0; i < formToSet.elements.length; i++) {
            let element = formToSet.elements[i];

            if (element.name !== '') {
                nameMap[element.name.toLocaleLowerCase()] = element.name;
            }
            // In a form, the same input is indexed both by name or by id, but assigning a value is done in the same way
            if (element.id !== '') {
                nameMap[element.id.toLocaleLowerCase()] = element.id;
            }
        }
        for (var field in settings.fields) {
            if (nameMap[field] !== undefined) {
                let value = settings.fields[field];

                // Get the value with the support for javascript expressions
                formToSet[nameMap[field]].value = getValueWithJavascriptSupport(value, formToSet);
            }
        }

        // Continue with the action chain
        onNextAction();
    }
}

ActionFormset.register();