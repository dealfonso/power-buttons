function confirmDialog(message, title = "this action needs confirmation", onConfirm = null, onCancel = null, cancellable = true) {
    let dialog = new Dialog({
        title: title,
        message: message,
        buttons: [
            { text: "Cancel", class: "btn-secondary", handler: onCancel },
            { text: "Confirm", class: "btn-primary", handler: onConfirm }
        ],
        escapeKeyCancels: cancellable
    });
    dialog.show();
    return dialog;
}

function alertDialog(message, title = "Alert", onAccept = null) {
    let dialog = new Dialog({
        title: title,
        message: message,
        buttons: [
            { text: "Accept", class: "btn-primary", handler: onAccept }
        ],
        escapeKeyCancels: true
    });
    dialog.show();
    return dialog;
}

/**
 * Function that creates a loading dialog (i.e. non-closeable dialog)
 * @param {*} message, the message to display
 * @param {*} customContent, the custom content to display
 * @param {*} canCancel, function that is called when the user clicks on the cancel button. If returns false, the dialog cannot be closed
 * @returns a dialog object
 * 
 * NOTE: the prototype of the function is (message, customContent, canCancel), but it can also be called with (message, canCancel)
 */
function loadingDialog(message, customContent = null, canCancel = null) {
    if (typeof(customContent) === "function") {
        canCancel = customContent;
        customContent = null;
    }

    let dialog = new Dialog({
        title: null,
        message: message,
        buttons: [
            { text: "Cancel", class: "btn-primary" }
        ],
        customContent: customContent,
        escapeKeyCancels: false,
        close: false,
        header: false,
        footer: false,
    }, canCancel);
    dialog.show();
    return dialog;
}

if (exports.powerButtons.utils === undefined) {
    exports.powerButtons.utils = {};
}

Object.assign(exports.powerButtons.utils, {
    confirmDialog: confirmDialog,
    alertDialog: alertDialog,
    loadingDialog: loadingDialog
});