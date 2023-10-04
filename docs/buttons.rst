.. _button list:

Actions in the library
======================

The library adds the following types of actions to the buttons:

* **verify** verifies that one condition is valid prior to executing the function that it should execute (:ref:`see details <verify button>`).

* **confirm** makes a button show a confirmation modal dialog prior to executing the function that it should execute (:ref:`see details <confirm button>`).

* **asynctask** shows a modal dialog and executes an asynchronous task prior to executing its real action (:ref:`see details <asynctask button>`).

* **showmessage** shows a modal information dialog prior to executing its real action (:ref:`see details <showmessage button>`).

* **formset** sets the values of a form fields prior to executing its real action (:ref:`see details <formset button>`).

* **formbutton** substitutes the button by a form that will contain the button and its action (:ref:`see details <formbutton button>`).

.. toctree::
    :maxdepth: 1
    :caption: Actions in the library
    
    buttons/verify-button
    buttons/confirm-button
    buttons/asynctask-button
    buttons/showmessage-button
    buttons/formset-button
    buttons/formbutton-button
