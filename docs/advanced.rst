Use cases
--------------

Here we can see some additional things that we can do with the library.

Multiple plugins in the same button
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A button can contain multiple of these functionalities at the same time. For example, a button can be a *confirm*
button and a *verify* button at the same time. 

If using the declarative method, there is a fixed order:

#. *verify*
#. *confirm*
#. *asynctask*
#. *showmessage*
#. *formset*
#. *formbutton* (set the field values that depend on a function)
#. the real action (i.e. ``onclick`` handler)

E.g. a button that verifies that value of field ``name`` is not empty, and then asks for confirmation before submitting the form:

.. code-block:: html

    <button type="submit" data-confirm data-verify="javascript: this.name.value != ''" data-verify-form="my-form">send</button>

.. note::

    In this case, the verification happens before the confirmation because of the fixed order.

If using the programmatical method, the order in which the actions are added is the order in which they will be 
executed.

E.g. a button can be a *confirm* button and a *verify* button at the same time:

.. code-block:: javascript

    $('#mybutton').powerButtons('confirm', options).powerButtons('showmessage', {showmessage: "The confirmation has been done"});

The button will first show a confirmation dialog, and if it is confirmed, it will show a message dialog, and finally it will continue with its action.

Complex workflow
^^^^^^^^^^^^^^^^

Here we can see a full example of a complex workflow that can be done with this library.

.. code-block:: html

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

In this example we have a form. When the user submits it...

#. the button verifies that the fields ``name`` and ``email`` are not empty. If they are empty, a modal dialog is shown to the user with the message *please fill all the fields*. 
#. If the fields are not empty, a confirmation dialog is shown to the user with the message *are you sure you want to submit this form?*. 
#. If the user confirms, a message dialog is shown to the user with the message *thank you for submitting the form*. 
#. And finally, the values of the fields ``name`` and ``email`` are set in the hidden field ``payload`` in the form, in JSON format.
#. ...and the form is submitted (it was its first purpose).

And we did all this without writing a single line of javascript code except for the validation and the creation of the derived values in the payload.

Using the library in other than buttons
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

We can use this library in any other clickable component than buttons; e.g. ``a``, ``images``, ``li``, etc. The usage is the same as in buttons, but using the appropriate tag. 

E.g. will ask for confirmation before following the link:

.. code-block:: html

    <a href="https://github.com" class="btn btn-primary" data-confirm="are you sure you want to follow this link?">follow link</a>

E.g. will show a message when the image is clicked:

.. code-block:: html

    <img src="https://picsum.photos/400/200" data-showmessage="Thank you for clicking">


Internationalization
^^^^^^^^^^^^^^^^^^^^

The internationalization for this library can be made by means of the global configuration of the library.

**Example of changing language**

.. code-block:: javascript

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

And then, in the html body...

.. code-block:: html

    <button onclick="english()" data-confirm="Want to set the texts of the library to english?">english</button>
    <button onclick="spanish()" data-confirm="¿Quiere utilizar los textos de la librería en español?">español</button>
    <button onclick="french()" data-confirm="Vous souhaitez utiliser les textes de la librairie en français?">français</button>

Utilities
^^^^^^^^^

The library exports some utility function that can be used in other javascript code. These utilities are under
the namespace ``window.powerButtons.utils``.

At this moment the utilities exported are related to the creation of modal dialogs. The functions are:

- ``window.powerButtons.utils.confirmDialog(message, title, onConfirm, onCancel, cancellable)``: creates a modal 
  dialog with the given options. The dialog will have a message, a title, and two buttons: *Confirm* and *Cancel*. 
  The *Confirm* button will execute the function ``onConfirm`` and the *Cancel* button will execute the function 
  ``onCancel``. If the dialog is cancellable, it will be closed if the user clicks outside the dialog or presses the escape key.

- ``window.powerButtons.utils.alertDialog(message, title, onAccept)``: creates a modal dialog with the given 
  options. The dialog will have a message, a title, and one button: *Accept*. The *Accept* button will execute 
  the function ``onAccept`` (if provided). The dialog will be closed if the user clicks outside the dialog or 
  presses the escape key.