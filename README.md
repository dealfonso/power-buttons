# PowerButtons

This is a library that adds additional functionality to buttons (or any other html component) in a web page. The idea is to simplify some tasks that we usually do in web pages, such as adding a confirmation dialog prior to submitting a form, or verifying that some condition is met prior to executing a function.

The library adds the following types of buttons:
1. _verify_ button that verifies that one condition is valid prior to executing the function that it should execute. And if the condition is not met, show a modal dialog to inform the user and interrupt its action. It is useful for (e.g.) form verification.
2. _confirm_ button that makes that a button shows a confirmation modal dialog prior to executing the function that it should execute. It is useful for (e.g.) confirm the action of submitting a form or deleting entries in a database.
3. _showmessage_ button, that shows a modal dialog with a message prior to executing its real action. It is useful for (e.g.) showing the user a message when he is submitting a form.
4. _formset_ button, that sets the values of a form fields prior to executing its real action. It is useful for (e.g.) setting a hidden field in a form prior to submitting it, or pre-filling a form.

The most simple example is the next one:

```html
<button data-confirm="Are you sure?">clickme</button>
```

Then, when the button is clicked, a modal dialog such as the next one will be shown.

![confirmation dialog](img/confirm1.png)

But it is possible to create more complex workflow such as in the next example:

```html
<form name="fullexampleform" method="get">
    <input type="text" name="name" class="form-control" placeholder="User name">
    <input type="text" name="email" class="form-control" placeholder="User email">
    <input type="hidden" name="payload" value="">
    <button type="button" class="btn btn-primary" 
        data-verify="this.name.value != '' && this.email.value != ''" 
        data-verify-form="fullexampleform"
        data-verify-not-verified="please fill all the fields" 
        data-confirm="are you sure you want to submit this form?" 
        data-showmessage="thank you for submitting the form" 
        data-formset="fullexampleform" data-formset-payload="javascript:JSON.stringify({name: this.name.value, email: this.email.value})">submit</button>
</form>
```

In this example we have a form. When the user submits it...

1. the button verifies that the fields `name` and `email` are not empty. If they are empty, a modal dialog is shown to the user with the message _please fill all the fields_. 
2. If the fields are not empty, a confirmation dialog is shown to the user with the message _are you sure you want to submit this form?_. 
3. If the user confirms, a message dialog is shown to the user with the message _thank you for submitting the form_. 
4. And finally, the values of the fields `name` and `email` are set in the hidden field `payload` in the form
5. ...and the form is submitted (it was its first purpose).

And we did all this without writing a single line of javascript code except for the validation and the creation of the derived values in the payload.

The library is written in javascript and is mostly designed to work with [Bootstrap](https://getbootstrap.com), although it is not mandatory. It also provides integration with [jQuery](https://jquery.com), but it is not needed.

# Setup

## Serving from your servers

You can clone this repo and copy the main file into the appropriate folder, to serve using your server:

```console
$ git clone
$ cp power-buttons/dist/power-buttons.js /path/to/my/html/folder
```

## Using a CDN

You can use this library directly from jsdelivr CDN

```html
<script src="https://cdn.jsdelivr.net/gh/dealfonso/power-buttons/power-buttons.min.js"></script>
```

# Using

It is possible to use _jsconfirm-buttons_ in a declarative way (i.e. including parameters in the html5 tags), or programmatically in a script.

## The declarative way

### Confirm Button
The basic syntax to use this plugin is to include the attribute _confirm_ in the button tag such as the next one:
```html
<button data-confirm="Are you sure?">clickme</button>
```

Then, when the button is clicked, a modal dialog such as the next one will be shown:
![confirmation dialog](img/confirm1.png)

> _power-buttons_ can also be used for links, by adding _confirm_ attribute to the `<a>` tag. Moreover it may also be used in any other components (such as images or list items).

Once the _Confirm_ button is clicked, the dialog will be closed and the activity in the button will continue (i.e. submit or execute any other click handler).

In case that the dialog is closed by other means but the _Confirm_ button, the activity in the button will not continue (i.e. the submission will be cancelled, and any other click handler will not be executed).

#### Options

The _confirm_ button can be configured according to its specific needs. The following attributes can be set in the html5 tags:

- `data-confirm`: is the message to show in the modal dialog. The text will be placed as _raw html_ in the dialog. It defaults to _Please confirm this action_.
- `data-confirm-custom-content`: is a custom content to show under the message. It defaults to _null_.
- `data-confirm-title`: is the title of the modal dialog. It defaults to _The action requires confirmation_.
- `data-confirm-button-confirm`: is the content for the confirmation button. It defaults to _Confirm_.
- `data-confirm-button-cancel`: is the content for the cancel button. It defaults to _Cancel_.
- `data-confirm-button-close`: if set to anything except _false_, a close button will be shown in the modal dialog. It defaults to _true_.
- `data-confirm-escape-key`: if set to anything except _false_, the dialog can be cancelled using the escape key or pressing outside the dialog.

> Each of the attributes can be either plain text or html code, so that it is possible to include images, links, etc.

### Verify Button

The basic syntax to use this verify button pluggin is to include the attribute _data-verify_ in the button tag such as the next one:
```html
<button data-verify="return Math.random() > 0.5;">clickme</button>
```

Then, whenever the button is pushed, the code inside the `data-verify` attribute will be evaluated and, if it did not return `true`, the default action for the element will be cancelled.

The _button verify_ plugin can also be use for links (i.e. `<a>` tag), images, etc.

### Options

The _verify_ button can be configured according to its specific needs. The following attributes can be set in the html5 tags:

- `data-verify`: is the javascript code to evaluate. If it returns _true_, the verification will succeed.
- `data-verify-form`: is the selector for the form to verify (it can also be any html5 object in the DOM). If it is set, the function will be evaluated in the context of the form (i.e. `this` will be the form).
- `data-verify-verified`: is the message to show in the modal dialog if the verification succeeds. If set to null, no dialog will be shown. It defaults to _null_.
- `data-verify-not-verified`: is the message to show in the modal dialog if the verification fails. If set to null, no dialog will be shown. It defaults to _The condition for this action is not met_.
- `data-verify-custom-content-verified`: is a custom content to show to the user under the message when verified. It defaults to _null_.
- `data-verify-custom-content-not-verified`: is a custom content to show to the user under the message when not verified. It defaults to _null_.
- `data-verify-title-verified`: is the title of the modal dialog if the verification succeeds. It defaults to _null_.
- `data-verify-title-not-verified`: is the title of the modal dialog if the verification fails. It defaults to _The action requires verification_.
- `data-verify-button-accept`: is the content for the confirmation button. It defaults to _Accept_.
- `data-verify-button-close`: if set to anything except _false_, a close button will be shown in the modal dialog. It defaults to _false_.
- `data-verify-escape-key`: if set to anything except _false_, the dialog can be cancelled using the escape key or pressing outside the dialog. It defaults to _true_.
- `data-verify-header`: if set to anything except _false_, the header of the dialog will be shown. If not shown, the contents of the header (i.e. the close button) will be placed in the body of the dialog. It defaults to _true_. 
- `data-verify-footer`: if set to anything except _false_, the footer of the dialog will be shown. If not shown, the contents of the footer (i.e. the buttons) will be placed in the body of the dialog. It defaults to _true_.

> Each of the attributes can be either plain text or html code, so that it is possible to include images, links, etc.

### Show Message Button

The basic syntax to use this plugin is to include the attribute _data-showmessage_ in the button tag such as the next one:
```html
<button data-showmessage="This is a message">clickme</button>
```

Then, when the button is clicked, a modal dialog will be shown with the message.

The _showmessage_ button can also be use for links (i.e. `<a>` tag), images, etc.

### Options

The _showmessage_ button can be configured according to its specific needs. The following attributes can be set in the html5 tags:

- `data-showmessage`: is the message to show in the modal dialog. It defaults to _This is a message_.
- `data-showmessage-custom-content`: is a custom content to show under the message. It defaults to _null_.
- `data-showmessage-button-accept`: is the content for the accept button. It defaults to _Accept_.
- `data-showmessage-title`: is the title of the modal dialog. It defaults to _null_.
- `data-showmessage-button-close`: if set to anything except _false_, a close button will be shown in the modal dialog. It defaults to _true_.
- `data-showmessage-escape-key`: if set to anything except _false_, the dialog can be cancelled using the escape key or pressing outside the dialog. It defaults to _true_.
- `data-showmessage-header`: if set to anything except _false_, the header of the dialog will be shown. If not shown, the contents of the header (i.e. the close button) will be placed in the body of the dialog. It defaults to _true_.
- `data-showmessage-footer`: if set to anything except _false_, the footer of the dialog will be shown. If not shown, the contents of the footer (i.e. the buttons) will be placed in the body of the dialog. It defaults to _true_.

> Each of the attributes can be either plain text or html code, so that it is possible to include images, links, etc.

### Form Set Button

The basic syntax to use this plugin is to include the attribute _data-formset_ in the button tag such as the next one:
```html
<form name="my-form">
    <input type="text" name="q">
    <input type="text" name="a">
</form>
<button data-formset="my-form" data-formset-q="my content" data-formset-a="javascript:this.b.value">clickme</button>
```

Then, when the button is clicked, the value of the form field `q` will be set to `my content` and the value of the form field `a` will be set to the value of the field `b` when the button was pressed (i.e. `javascript:this.b.value`).

> NOTA: in javascript, the names of the dataset attributes cannot contain dashes, and also are camel cased. So the names of the fields to set are case insensitive and cannot contain dashes.

## The programmatical way
Once you have your interface, you can use the programmatical method to add any of the functionalities to your buttons.

You can either use vanilla javascript or jQuery. In the former case, the syntax is:

```javascript
let options = {
    confirm: "Are you sure?"
};
let mybutton = document.getElementById('mybutton');
window.powerButtons('confirm', mybutton, options);
```

In the case of jQuery, the syntax is:

```javascript
let options = {
    confirm: "Are you sure?"
};
$('#mybutton').powerButtons('confirm', options);
```

The names for the available plugins can be seen in the first section of this document: _confirm_, _verify_, _showmessage_ and _formset_.

### Multiple plugins in the same button

A button can contain multiple of these functionalities at the same time. For example, a button can be a _confirm_ button and a _verify_ button at the same time. 

If using the declarative method, there is a fixed order:

1. _verify_
2. _confirm_
3. _showmessage_
4. _formset_
5. the real action (i.e. `onclick` handler)

If using the programmatical method, the order in which the actions are added is the order in which they will be executed.

E.g. a button can be a _confirm_ button and a _verify_ button at the same time:

```javascript
$('#mybutton').powerButtons('confirm', options).powerButtons('showmessage', {showmessage: "The confirmation has been done"});
```

The button will first show a confirmation dialog, and if it is confirmed, it will show a message dialog, and finally it will continue with its action.

### Default values

The default values for the options can be set globally, so that any not defined value will default to the globals. The defaults are stored in `windows.powerButtons.defaults`, in an associative array where the index are the names of the plugins. As an example, `window.powerButtons.defaults['confirm']` contains the default values for the _confirm_ plugin.

The default values for each plugin are the next:

#### _verify_

```javascript
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
```

The equivalent for html5 attributes are the snake-case version of each of them, with the prefix `data-verify-`; e.g. `data-verify-button-accept`, `data-verify-title-not-verified`, etc.

#### _confirm_

```javascript
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
```

The equivalent for html5 attributes are the snake-case version of each of them, with the prefix `data-confirm-`; e.g. `data-confirm-button-confirm`, `data-confirm-title`, etc.

#### _showmessage_

```javascript
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
```

The equivalent for html5 attributes are the snake-case version of each of them, with the prefix `data-showmessage-`; e.g. `data-showmessage-button-accept`, `data-showmessage-title`, etc.

#### _formset_

```javascript
// The form whose values are to be set. If it is a string, it will be interpreted as a selector.
form: null,
// A map of field names and values to set in the form. The values can be either plain text or a HTML fragment. If the value is a function, it will be evaluated in the context of the form (i.e. this will be the form). If it is a string that starts with "javascript:", it will be evaluated as javascript code.
fields: {}
```

The equivalent for html5 attributes are `data-formset-form` for the case of the form to set, and the case-insensitive name of the each of the fields to set with the prefix `data-formset-`; e.g. `data-formset-q` to set the value for field named (or with id) `q`.

## Internationalization

The internationalization for this library can be made by means of the global configuration of the library.

**Example of changing language**

```javascript
<head>
(...)
<script>
function spanish() {
    // Modal dialog texts in Spanish
    window.powerButtons.defaults['config'] = {
        confirm: "Por favor confirme la acción",
        title: "Esta acción requiere confirmación",
        buttonConfirm: "Confirmar",
        buttonCancel: "Cancelar",
    };
}
function english() {
    // Modal dialog texts in English
    window.powerButtons.defaults['config'] = {
        confirm: "Please confirm your action",
        title: "This action requires confirmation",
        buttonConfirm: "Confirm",
        buttonCancel: "Cancel",
    };
}
function french() {
    // Modal dialog texts in French
    window.powerButtons.defaults['config'] = {
        confirm: "Veuillez confirmer votre action",
        title: "Cette action nécessite votre confirmation",
        buttonConfirm: "Confirmer",
        buttonCancel: "Annuler",
    };
}
</script>
</head>
```

And then, in the html body...

```html
<button onclick="english()" data-confirm="Want to set the texts of the library to english?">english</button>
<button onclick="spanish()" data-confirm="¿Quiere utilizar los textos de la librería en español?">español</button>
<button onclick="french()" data-confirm="Vous souhaitez utiliser les textes de la librairie en français?">français</button>
```

## Using the library in other than buttons

We can use this library in any other clickable component than buttons; e.g. `a`, `images`, `li`, etc. The usage is the same as in buttons, but using the appropriate tag. 

E.g. will ask for confirmation before following the link:

```html
<a href="https://github.com" class="btn btn-primary" data-confirm="are you sure you want to follow this link?">follow link</a>
```

E.g. will show a message when the image is clicked:

```html
<img src="https://picsum.photos/400/200" data-showmessage="Thank you for clicking">
```

## Utilities

The library exports some utility function that can be used in other javascript code. These utilities are under the namespace `window.powerButtons.utils`.

At this moment the utilities exported are related to the creation of modal dialogs. The functions are:

- `window.powerButtons.utils.confirmDialog(message, title, onConfirm, onCancel, cancellable)`: creates a modal dialog with the given options. The dialog will have a message, a title, and two buttons: _Confirm_ and _Cancel_. The _Confirm_ button will execute the function `onConfirm` and the _Cancel_ button will execute the function `onCancel`. If the dialog is cancellable, it will be closed if the user clicks outside the dialog or presses the escape key.

- `window.powerButtons.utils.alertDialog(message, title, onAccept)`: creates a modal dialog with the given options. The dialog will have a message, a title, and one button: _Accept_. The _Accept_ button will execute the function `onAccept` (if provided). The dialog will be closed if the user clicks outside the dialog or presses the escape key.