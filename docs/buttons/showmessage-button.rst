.. _showmessage button:

*ShowMessage* action
^^^^^^^^^^^^^^^^^^^^

The **showmessage** action makes that a button shows a modal dialog with a message prior to executing its real 
action. It is useful for (e.g.) showing the user a message when he is submitting a form.

The basic syntax to use this **showmessage** button pluggin is to include the attribute ``data-showmessage`` in the button tag such as the next one:

.. code-block:: html

    <button type="button" data-showmessage="hello world" onclick="alert('now the button continues')">showmessage test</button>

Then, whenever the button is pushed, a modal dialog will be shown and, when the user clicks on the *OK* button, the real action will be executed.

.. note::
    In the case of the example, the code will show a modal dialog with the message *hello world*, and once the 
    dialog is closed, it will show an alert with the message *now the button continues* (which is the actual handler
    for the `onclick` event).

HTML Attributes
---------------

The **showmessage** button can be configured according to its specific needs. The following attributes can be set in the html5 tags:

- ``data-showmessage``: is the message to show in the modal dialog. It defaults to *This is a message*.
- ``data-showmessage-custom-content``: is a custom content to show under the message. It defaults to ``null``.
- ``data-showmessage-button-accept``: is the content for the accept button. It defaults to *Accept*.
- ``data-showmessage-title``: is the title of the modal dialog. It defaults to ``null``.
- ``data-showmessage-button-close``: if set to anything except ``false``, a close button will be shown in the modal dialog. It defaults to ``true``.
- ``data-showmessage-escape-key``: if set to anything except ``false``, the dialog can be cancelled using the escape key or pressing outside the dialog. It defaults to ``true``.
- ``data-showmessage-header``: if set to anything except ``false``, the header of the dialog will be shown. If not shown, the contents of the header (i.e. the close button) will be placed in the body of the dialog. It defaults to ``true``.
- ``data-showmessage-footer``: if set to anything except ``false``, the footer of the dialog will be shown. If not shown, the contents of the footer (i.e. the buttons) will be placed in the body of the dialog. It defaults to ``true``.

.. note::

    Each of the attributes can be either plain text or html code, so that it is possible to include images, links, etc.

Javascript Options object
-------------------------

The function to apply the plugin to the element accepts an object to configure the action. It can have the following options:

.. code-block:: javascript

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

.. note::

    Each option correspond to an html5 attribute with the same name and the prefix ``data-showmessage-``.