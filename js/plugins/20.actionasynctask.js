class ActionAsyncTask extends Action {
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
    
    static execute(options, onNextAction, onCancelActions) {
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

ActionAsyncTask.register();