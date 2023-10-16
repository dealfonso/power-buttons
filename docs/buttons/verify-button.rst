.. _verify button:

*Verify* action
^^^^^^^^^^^^^^^

The **verify** action makes that a button verifies that one condition is valid prior to executing the function that it should execute. And if the condition is not met, it enables
to show a modal dialog to inform the user and interrupt its action. Alternatively it can be configured to show a modal dialog when the condition is met.

The basic syntax to use this verify button pluggin is to include the attribute ``data-verify`` in the button tag such as the next one:

.. code-block:: html

    <button type="button" data-verify="window.prompt('insert a text to fail') == ''" data-verify-not-verified="you introduced a text" onclick="alert('continue because you left the text blank')">test verify</button>

Then, whenever the button is pushed, the code inside the ``data-verify`` attribute will be evaluated and, if it did not return ``true``, the default action for the element will be cancelled. 

.. note::
    In the case of the example, the code will show a prompt dialog to the user, and if the user does not leave the text blank, the verification will fail and the default action will be cancelled.

HTML Attributes
---------------

The ``verify`` button can be configured according to its specific needs. The following attributes can be set in the html5 tags:

- ``data-verify``: is the javascript code to evaluate. If it returns ``true``, the verification will succeed.
- ``data-verify-form``: is the selector for the form to verify (it can also be any html5 object in the DOM). If it is set, the function will be evaluated in the context of the form (i.e. ``this`` will be the form).
- ``data-verify-verified``: is the message to show in the modal dialog if the verification succeeds. If set to null, no dialog will be shown. It defaults to ``null``.
- ``data-verify-not-verified``: is the message to show in the modal dialog if the verification fails. If set to null, no dialog will be shown. It defaults to *The condition for this action is not met*.
- ``data-verify-custom-content-verified``: is a custom content to show to the user under the message when verified. It defaults to ``null``.
- ``data-verify-custom-content-not-verified``: is a custom content to show to the user under the message when not verified. It defaults to ``null``.
- ``data-verify-title-verified``: is the title of the modal dialog if the verification succeeds. It defaults to ``null``.
- ``data-verify-title-not-verified``: is the title of the modal dialog if the verification fails. It defaults to *The action requires verification*.
- ``data-verify-button-accept``: is the content for the confirmation button. It defaults to *Accept*.
- ``data-verify-button-close``: if set to anything except ``false``, a close button will be shown in the modal dialog. It defaults to ``false``.
- ``data-verify-escape-key``: if set to anything except ``false``, the dialog can be cancelled using the escape key or pressing outside the dialog. It defaults to ``true``.
- ``data-verify-header``: if set to anything except ``false``, the header of the dialog will be shown. If not shown, the contents of the header (i.e. the close button) will be placed in the body of the dialog. It defaults to ``true``. 
- ``data-verify-footer``: if set to anything except ``false``, the footer of the dialog will be shown. If not shown, the contents of the footer (i.e. the buttons) will be placed in the body of the dialog. It defaults to ``true``.

.. note::

    Each of the attributes can be either plain text or html code, so that it is possible to include images, links, etc.

Options in Javascript
---------------------

The same options can be set in javascript, when applying the plugin to the element. The object passed to the plugin can have the following properties:

.. code-block:: javascript

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

.. note::

    Each option correspond to an html5 attribute with the same name and the prefix ``data-verify-``. For example, the option ``verified`` corresponds to the attribute ``data-verify-verified``.