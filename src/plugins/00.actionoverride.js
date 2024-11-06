class ActionOverride extends Action {
    static NAME = "Override";

    static DEFAULTS = {
        // The function to call to check for overriding the next actions. It must return a true or false value. If it is an string, it will be evaluated as javascript, using _eval_
        override: null,
        // The form to bind the verification to. If it is a string, it will be interpreted as a selector (it is not verified if it is a form or any other object). If null, the verification will be bound to the document
        form: null,
        // The content of the message to show to the user if `override` evaluates to true (it can be either plain text or a HTML fragment)
        overridden: null,
        // A custom content to show to the user under the message when `override` evaluates to true (it can be either plain text or a HTML fragment)
        customContent: null,
        // The content of the title of the dialog when `override` evaluates to true (it can be either plain text or a HTML fragment)
        title: null,
        // The content for the button that confirms the action (it can be either plain text or a HTML fragment)
        buttonAccept: "Accept",
        // If falshi (i.e. null, 0, false, "false"), the esc key will not close the dialog (it will close it if true)
        escapeKey: true,
        // The class to apply to the dialog
        dialogClass: "",
        // The selector to focus when the dialog is shown
        focus: "",
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
            if (typeof(settings.override) === 'function') {
                result = settings.override.bind(bindObject)();
            } else if (typeof(settings.override) === 'string') {
                result = function() {
                    return eval(settings.override)
                }.bind(bindObject)();
            } else {
                result = parseBoolean(settings.override);
            }
        } catch (e) {
            console.error("Error executing override function", e);
            result = false;
        }

        if (result) {
            if ((settings.overridden !== null) || (settings.customContent !== null) || (settings.title !== null)) {
                let dialog = null;
                dialog = Dialog.create({
                    title: settings.title,
                    message: settings.overridden,
                    customContent: settings.customContent,
                    buttons: [ settings.buttonAccept ],
                    escapeKeyCancels: settings.escapeKey,
                    close: settings.buttonClose,
                    dialogClass: settings.dialogClass,
                    focus: settings.focus,        
                }, null, function(result) {
                    // Let's override the next actions, to get to the final action
                    onNextAction(true);
                });
                dialog.show();
            } else {
                // Let's override the next actions, to get to the final action
                onNextAction(true);
            }
        } else {
            onNextAction();
        }
    }
}

ActionOverride.register();