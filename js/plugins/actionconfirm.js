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
        // If falshi (i.e. null, 0, false, "false"), the esc key will not close the dialog (it will close it if true)
        escapeKey: true        
    };

    /**
     * Executes the action
     * @param {*} options, the options to use for the execution of the action (those extracted from the data attributes and the
     *                     user-provided ones)
     * @param {*} onNextAction, the action to execute after the current one has finished (i.e. to be executed to get to the next
     *                          action in the process)
     * @param {*} onCancelActions, the actions to execute if the user cancels the current action (i.e. to stop executing actions)
     */
    static execute(options, onNextAction, onCancelActions) {
        // We merge the options with the defaults to get a valid settings object
        let settings = flattenobjects(this.DEFAULTS, window.powerButtons.config.defaultsConfirm, options);

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

ActionConfirm.register();