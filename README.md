# jsconfirm-buttons
This is a plugin for [jQuery](https://jquery.com) that depends on [Bootstrap](https://getbootstrap.com). The plugin does not need any specific version of each of them.

The plugin makes that any button show a confirmation modal dialog prior to executing the function that it should execute. It is useful for (e.g.) confirm submitting a dialog or deleting entries in a database.

The basic syntax to use this plugin is to include a tag such as the next one:
```html
<button confirm="Are you sure?">clickme</button>
```

Then, when the button is clicked, a modal dialog such as the next one will be shown.
![confirmation dialog](img/confirm1.png)

# Setup

## Serving from your servers
You can clone this repo and copy the main file into the appropriate folder, to serve using your server:

```console
$ git clone https://github.com/dealfonso/jsconfirm-buttons
$ cp jsconfirm-buttons/confirmbutton.js /path/to/my/html/folder
```

And in your html file
```html
<script src="confirmbutton.js"></script>
```

## Using a CDN

You can use this library directly from jsdelivr CDN

```html
<script src="https://cdn.jsdelivr.net/gh/dealfonso/jsconfirm-buttons/confirmbutton.min.js"></script>
```

# Using

It is possible to use _jsconfirm-buttons_ in a declarative way (i.e. including parameters in the html5 tags), or programmatically in a script.

## The declarative way
The basic syntax to use this plugin is to include the attribute _confirm_ in the button tag such as the next one:
```html
<button confirm="Are you sure?">clickme</button>
```

Then, when the button is clicked, a modal dialog such as the next one will be shown:
![confirmation dialog](img/confirm1.png)

> _jsconfirm-buttons_ can also be used for links, by adding _confirm_ attribute to the `<a>` tag. Moreover it may also be used in any other components (such as images or list items).

Once the _Confirm_ button is clicked, the dialog will be closed and the activity in the button will continue (i.e. submit or execute any other click handler).

In case that the dialog is closed by other means but the _Confirm_ button, the activit in the button will not continue (i.e. the submission will be cancelled, and any other click handler will not be executed).

## The programmatical way
Once you have your interface, you can use the programmatical method to add confirmation to your components.

```html
<button id="mybutton">clickme</button>
<script>
    $(function() {
        let options = {
            confirm: "Are you sure?"
        };
        $('#mybutton').confirmButton(options);
    })
</script>
```

The result is the same than the previous one, but in this case, the `confirm` attribute is not set to the `<button>` tag and we initialize the button programmatically once the document is ready.

## Examples

### A button that has a onclick event handler

```html
<button confirm="Are you sure?" onclick="alert('confirmed')">clickme</button>
 ```

Once the button is clicked, a confirmation dialog (like in the previous image) will be shown. If the user clicks the _Confirm_ button, an alert will be shown.

[See at codepen](https://codepen.io/dealfonso/pen/GRvGagx)

 ### A button that has a jquery event handler

 ```html
<button confirm="Are you sure?" id="mybutton">clickme</button>
<script>
  $(function() {
    $("#mybutton").on('click', function() {
      alert('confirmed in a event handler');
    });
  })
</script>
```

Once the button is clicked, a confirmation dialog will be shown. If the user clicks the _Confirm_ button, the other handler will be executed, and so an alert will be shown.

[See at codepen](https://codepen.io/dealfonso/pen/RwZBmBy)


### A button that submits a form

```html
<form>
<input type="text" name="q">
<button confirm="Are you sure to submit?" type="submit">Send</button>
</form>
```

When the button _Submit_ is clicked, a confirmation dialog will be shown. If the user clicks the _Confirm_ button, the form will be submitted.

[See at codepen](https://codepen.io/dealfonso/pen/XWaBwxK)

### Using a custom modal dialog

```html
<div class="modal" tabindex="-1" id="myconfirmdlg" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <h3>Are you sure you want to save data?</h3>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary save">Save changes</button>
        </div>
        </div>
    </div>
</div>
<form>
    <input type="text" name="q">
    <button confirm data-dialog="#myconfirmdlg" data-confirmbtn="button.save" type="submit">Send</button>
</form>
```

[See at codepen](https://codepen.io/dealfonso/pen/BadPeqv)

The user provides a custom bootstrap modal dialog, and then sets the values for the `button` tag: 
- `confirm` attribute is set to blank, because the message is already in my dialog
- `data-dialog` is set to a selector that obtains the modal dialog that is wanted to show.
- `data-confirmbtn` is set to a selector that obtains the _Save_ button in the dialog (which will act as "confirm").


### Using in a link
```html
<a href="https://www.google.com" confirm="Want to go to google?" target="_blank">clickme</a>
```

The `confirm` attribute is set to the `<a>` tag. So the confirmation dialog will be show upon clicking and (if confirmed), the link will act and redirect to google.com.

[See at codepen](https://codepen.io/dealfonso/pen/LYjBoXz)

### Using in a any html component (e.g. `<li>`, `<img>`, etc.)
```html
<ul>
    <li confirm="Confirm item 1">item 1</li>
    <li confirm="Confirm item 2">item 2</li>
    <li confirm="Confirm item 3">item 3</li>
</ul>
```

The `confirm` attribute is set to the `<li>` tag. So the confirmation dialog will be show upon clicking and (if confirmed), the rest of handlers (if existing) will be invoked.

[See at codepen, in \<li> items](https://codepen.io/dealfonso/pen/KKvBLJK)

[See at codepen, in an \<image>](https://codepen.io/dealfonso/pen/OJjwYdr)

## Options

Each button can be configured according to its specific needs. If using the programmatical way, the following structure may be used as a parameter to the buttons (the included values are the default ones): 

```javascript
options = {
    confirm: null,
    texttarget: 'p.confirm-text',
    confirmbtn: 'button.confirm',
    cancelbtn: 'button.cancel',
    dialog: null,
    confirmtxt: null,
    canceltxt: null
};
```

In the declarative way, there exist the corresponding options (`confirm`, `data-texttarget`, `data-confirmbtn`, `data-cancelbtn`, `data-dialog`, `data-confirmtxt` and `data-canceltxt`). These attributes may be set in the html5 tags as in the example:

```html
<button confirm="Are you sure?" data-dialog="#myconfirmdlg" data-confirmbtn="button.save" type="submit">Send</button>
```

The function for each field is the next:
- **confirm (data-confirm)**: is the message to show in the modal dialog. This text will be placed as _raw html_ in the component obtained by means of _texttarget_.
- **texttarget (data-texttarget):** is the selector for the placeholder for the message in the dialog. The content of _confirm_ will be placed as raw html in the component.
- **confirmbtn (data-confirmbtn):** is the jQuery selector to obtain the confirmation button (or element).
- **cancelbtn (data-cancelbtn):** is the jQuery selector to obtain the cancel button (or element).
- **dialog (data-dialog):** is the jQuery selector to obtain the custom modal dialog to show (if not found, a generic one will be created).
- **confirmtxt (data-confirmtxt):** if provided, this text will be set inside the confirmation button as raw html (this is for internationalization purposes).
- **canceltxt (data-canceltxt):** if provided, this text will be set inside the cancel button as raw html (this is for internationalization purposes).

