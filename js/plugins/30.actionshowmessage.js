class ActionShowMessage extends Action {
    static NAME = "ShowMessage";
    static DEFAULTS = {
        // The content of the message to show to the user (it can be either plain text or a HTML fragment)
        showmessage: "This is a message",
        // A custom content to show to the user under the message (it can be either plain text or a HTML fragment)
        customContent: null,
        // The content of the title of the dialog (it can be either plain text or a HTML fragment)
        title: null,
        // If falshi (i.e. null, 0, false, "false"), the button to close the dialog will not be shown
        buttonAccept: "Accept",
        // If falshi (i.e. null, 0, false, "false"), the esc key will not close the dialog (it will close it if true)
        escapeKey: true,
        // If falshi (i.e. null, 0, false, "false"), the button to close the dialog will not be shown
        buttonClose: true,
        // If falshi (i.e. null, 0, false, "false"), the head of the dialog will be hidden
        header: true,
        // If falshi (i.e. null, 0, false, "false"), the footer of the dialog will be hidden
        footer: true
    }

    static execute(options, onNextAction, onCancelActions) {
        // We merge the options with the defaults to get a valid settings object
        let settings = PowerButtons.getActionSettings(this, options);

        // We'll create the dialog
        let dialog = Dialog.create({
            title: settings.title,
            message: settings.showmessage,
            customContent: settings.customContent,
            buttons: [ settings.buttonAccept ],
            escapeKeyCancels: settings.escapeKey,
            close: settings.buttonClose,
            header: (options.header !== undefined)?settings.header : (settings.title!==null&&settings.title!= ""),
            footer: (options.footer !== undefined)?settings.footer : (settings.buttonAccept!==null&&settings.buttonAccept!= ""),
        }, null, function(result) {
            if (onNextAction !== null) {
                onNextAction();
            }
        });

        // We'll show the dialog
        dialog.show();
    }    
}

ActionShowMessage.register();