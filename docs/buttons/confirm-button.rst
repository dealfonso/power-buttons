.. _confirm button:

*Confirm* action
^^^^^^^^^^^^^^^^

The **confirm** action shows a confirmation dialog prior to executing its real action, so that the user can confirm that he really wants to execute the action.

The basic syntax to use this **confirm** button pluggin is to include the attribute ``data-confirm`` in the button tag such as the next one:

.. code-block:: html

    <button data-confirm="Are you sure?">clickme</button>

Then, whenever the button is pushed, a modal dialog will pop up to make the user to confirm the action. Once the *Confirm* button is clicked, the dialog will be closed and the activity in the button will continue (i.e. submit or execute any other click handler).

In case that the dialog is closed by other means but the *Confirm* button (i.e. using *Cancel* button, the cross button or the *escape key*), the activity in the button will not continue (i.e. the submission will be cancelled, and any other click handler will not be executed).

.. note::
    In the case of the example, the modal button will appear with the text ``Are you sure?`` and two buttons: ``Confirm`` and ``Cancel``. 
    If the user clicks on ``Confirm``, the action will continue, otherwise it will be cancelled

HTML Attributes
---------------

The **confirm** button can be configured according to its specific needs. The following attributes can be set in the html5 tags:

- ``data-confirm``: is the message to show in the modal dialog. The text will be placed as *raw html* in the dialog. It defaults to *Please confirm this action*.
- ``data-confirm-custom-content``: is a custom content to show under the message. It defaults to ``null``.
- ``data-confirm-title``: is the title of the modal dialog. It defaults to *The action requires confirmation*.
- ``data-confirm-button-confirm``: is the content for the confirmation button. It defaults to *Confirm*.
- ``data-confirm-button-cancel``: is the content for the cancel button. It defaults to *Cancel*.
- ``data-confirm-button-close``: if set to anything except ``false``, a close button will be shown in the modal dialog. It defaults to ``true``.
- ``data-confirm-escape-key``: if set to anything except ``false``, the dialog can be cancelled using the escape key or pressing outside the dialog.

.. note::

    Each of the attributes can be either plain text or html code, so that it is possible to include images, links, etc.

Javascript Options object
-------------------------

The function to apply the plugin to the element accepts an object to configure the action. It can have the following options:

.. code-block:: javascript

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

.. note::

    Each option correspond to an html5 attribute with the same name and the prefix ``data-confirm-``.