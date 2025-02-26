class ActionConfirm extends Action {
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
        // The function to call when the action is confirmed (prior to the next action)
        onConfirm: null,
        // If falshi (i.e. null, 0, false, "false"), the esc key will not close the dialog (it will close it if true)
        escapeKey: true,
        // The class to apply to the dialog
        dialogClass: "fade",
        // The selector to focus when the dialog is shown
        focus: "",
        // Function called when the html element of the dialog is created
        onDialogCreated: (htmlElement) => {},
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
            dialogClass: settings.dialogClass,
            focus: settings.focus,
            onDialogCreated: settings.onDialogCreated
        }, null, function(result) {
            if (result === 0) {
                // The user has confirmed the action
                if (settings.onConfirm !== null) {
                    // Execute the onConfirm function, if any, either as a function or as a string (if it's a string, we'll eval it)
                    let result = null;
                    if (typeof(settings.onConfirm) === 'function') {
                        result = settings.onConfirm.bind(document)();
                    } else if (typeof(settings.onConfirm) === 'string') {
                        result = function() {
                            return eval(settings.onConfirm)
                        }.bind(document)();
                    }
                }
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

ActionConfirm.register();