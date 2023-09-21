class ActionVerify extends Action {
    static NAME = "Verify";

    static DEFAULTS = {
        // The function to call to verify the action. It must return a true or false value. If it is an string, it will be evaluated as javascript, using _eval_
        verify: null,
        // The form to bind the verification to. If it is a string, it will be interpreted as a selector (it is not verified if it is a form or any other object). If null, the verification will be bound to the document
        form: null,
        // The content of the message to show to the user if verified to true (it can be either plain text or a HTML fragment)
        verified: null,
        // The content of the message to show to the user if verified to false (it can be either plain text or a HTML fragment)
        notVerified: "The condition for this action is not met",
        // A custom content to show to the user under the message when verified (it can be either plain text or a HTML fragment)
        customContentVerified: null,
        // A custom content to show to the user under the message when not verified (it can be either plain text or a HTML fragment)
        customContentNotVerified: null,
        // The content of the title of the dialog when the condition is not verified (it can be either plain text or a HTML fragment)
        titleNotVerified: "The action requires verification",
        // The content of the title of the dialog when the condition is verified (it can be either plain text or a HTML fragment)
        titleVerified: null,
        // The content for the button that confirms the action (it can be either plain text or a HTML fragment)
        buttonAccept: "Accept",
        // If falshi (i.e. null, 0, false, "false"), the button to close the dialog will not be shown
        buttonClose: false,
        // If falshi (i.e. null, 0, false, "false"), the esc key will not close the dialog (it will close it if true)
        escapeKey: true,
        // If falshi (i.e. null, 0, false, "false"), the head of the dialog will be hidden
        header: true,
        // If falshi (i.e. null, 0, false, "false"), the footer of the dialog will be hidden
        footer: true
    }

    static execute(options, onNextAction, onCancelActions) {
        // We merge the options with the defaults to get a valid settings object
        let settings = PowerButtons.getActionSettings(this, options);

        let result = null;
        let bindObject = searchForm(settings.form);
        if (bindObject === null) {
            bindObject = document;
        }
        try {
            if (typeof(settings.verify) === 'function') {
                result = settings.verify.bind(bindObject)();
            } else if (typeof(settings.verify) === 'string') {
                result = function() {
                    return eval(settings.verify)
                }.bind(bindObject)();
            } else {
                result = parseBoolean(settings.verify);
            }
        } catch (e) {
            console.error("Error executing verification function", e);
            result = false;
        }

        let dialog = null;
        let onVerificationSuccess = onNextAction;
        let onVerificationFailure = onCancelActions;

        if (result) {
            if ((settings.verified !== null) || (settings.customContentVerified !== null) || (settings.titleVerified !== null)) {
                dialog = Dialog.create({
                    title: settings.titleVerified,
                    message: settings.verified,
                    customContent: settings.customContentVerified,
                    buttons: [ settings.buttonAccept ],
                    escapeKeyCancels: settings.escapeKey,
                    close: settings.buttonClose,
                }, null, function(result) {
                    if (onVerificationSuccess !== null) {
                        onVerificationSuccess();
                    }
                });
            }
        } else {
            if ((settings.notVerified !== null) || (settings.customContentNotVerified !== null) || (settings.titleNotVerified !== null)) {
                dialog = Dialog.create({
                    title: settings.titleNotVerified,
                    message: settings.notVerified,
                    customContent: settings.customContentNotVerified,
                    buttons: [ settings.buttonAccept ],
                    escapeKeyCancels: settings.escapeKey,
                    close: settings.buttonClose,
                }, null, function(result) {
                    if (onVerificationFailure !== null) {
                        onVerificationFailure();
                    }
                });
            }
        }

        if (dialog !== null) {
            dialog.show();
        } else {
            if (result) {
                if (onVerificationSuccess !== null) {
                    onVerificationSuccess();
                }
            } else {
                if (onVerificationFailure !== null) {
                    onVerificationFailure();
                }
            }
        }
    }
}

ActionVerify.register();