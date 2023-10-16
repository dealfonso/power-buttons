.. _asynctask button:

*AsyncTask* action
^^^^^^^^^^^^^^^^^^

The **asynctask** action makes that a button executes an asynchronous task prior to executing its real action, and it will show a modal dialog while it is being executed. When the tasks finishes, the modal dialog will be closed and the real action will be executed.

The basic syntax to use this **asynctask** button pluggin is to include the attribute ``data-asynctask`` in the button tag such as the next one:

.. code-block:: html

    <button data-asynctask="fetch('https://hub.dummyapis.com/delay?seconds=5', {mode:'no-cors'})">async task</button>

Then, whenever the button is pushed the asynchronous task will be executed and the modal dialog will be shown.

.. note::

    In the case of the example, the code inside the ``data-asynctask`` attribute will be evaluated into an async function and, the modal dialog will be shown until the evaluation of the code finalizes.

Notes on the tasks to execute
-----------------------------

It is important that the code inside the ``data-asynctask`` will be waited for its finalization. So the code executed as the asynctask must be either a synchronous function or a promise. If it is a promise, it will be awaited for its finalization. If it is a function, it will be executed and awaited for its finalization.

E.g. the next code (which is similar to the previous example, but delayed in time) will not work as expected:

.. code-block:: html

    <button data-asynctask="setTimeout(() => fetch('https://hub.dummyapis.com/delay?seconds=5', {mode:'no-cors'}), 1000)">async task</button>

In this case, the function returns inmediately and so the modal dialog will be shown and closed immediately. The correct way to do it is to return a promise that will be resolved when the timeout is finished:

.. code-block:: html

    <button data-asynctask="new Promise((resolve) => setTimeout(() => fetch('https://hub.dummyapis.com/delay?seconds=5', {mode:'no-cors'}).then(resolve),  1000))">async task</button>

If the code is synchronous, it will be executed and awaited for its finalization. E.g. the next code will work as expected:

.. code-block:: html

    <button data-asynctask="let now = performance.now(); while (performance.now() - now < 5000) {}">async task</button>

.. note::

    This code simply runs an unuseful loop for 5 seconds before returning. The modal dialog will be shown until the code returns.

Cancellable tasks
-----------------

If your task can be aborted, it is possible to set a **cancel callback** to the ``asynctask`` by means of the ``data-asynctask-cancel`` attribute. If the callback is provided, a cancel button will appear in the modal dialog and, if pressed, the code will be evaluated when the cancel button is pressed.

Have in mind that the execution of the cancellation code will not make the dialog to be hidden: the dialog will be hidden when the code returns. So your function needs to be cancellation-aware. This is made in this way to protect the execution of the original code.

E.g. the next code is a very simple example of a cancellation-aware function:

.. code-block:: html
    
    <script>
    var abort = null;
    function runningtask() {
        return new Promise((resolve, reject) => {
            abort = reject;
            setTimeout(() => { resolve(); }, 5000);
        });
    }
    </script>
    <button data-asynctask="runningtask()" data-asynctask-cancel="abort()" >async task</button>

.. note::

    This example does not efectively end the task. You can find a much better example in the ``examples.html`` file.

HTML Attributes
---------------

The **asynctask** button can be configured according to its specific needs. The following attributes can be set in the html5 tags:

- ``data-asynctask``: is the javascript code to evaluate as the asynchronous task.
- ``data-asynctask-title``: is the title of the modal dialog. It defaults to *Please wait*.
- ``data-asynctask-message``: is the message to show in the modal dialog. It defaults to *Please wait while the task is being executed*.
- ``data-asynctask-custom-content``: is a custom content to show under the message. It defaults to ``null``.
- ``data-asynctask-button-cancel``: if needed, the content of the button to cancel the task. It defaults to *Cancel*.
- ``data-asynctask-cancel``: the code to execute if the task is cancelled (i.e. the cancel button is pressed). If it is not set, the task will not be cancellable and so the cancel button will not be shown. It defaults to ``null``.
- ``data-asynctask-header``: if set to anything except ``false``, the header of the dialog will be shown. It defaults to ``true``.
- ``data-asynctask-footer``: if set to anything except ``false``, the footer of the dialog will be shown. If there is no footer and the cancel button needs to appear, it will be placed inside the body of the dialog. It defaults to ``true``.

.. note::

    Each of the attributes can be either plain text or html code, so that it is possible to include images, links, etc.

Javascript Options object
-------------------------

The function to apply the plugin to the element accepts an object to configure the action. It can have the following options:

.. code-block:: javascript

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

.. note::
    The ``task`` and ``cancel`` parameters may be either functions, promises or strings containing javascript code. 
    If they are functions, they will be executed. If they are promises, they will be awaited for their finalization. 
    If they are strings, they will be evaluated as javascript code.
