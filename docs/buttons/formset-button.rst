.. _formset button:

*FormSet* action
^^^^^^^^^^^^^^^^

The **formset** action makes that a button that sets the values of a set of form fields prior to executing its real action. 
It is useful for (e.g.) setting a hidden field in a form prior to submitting it, or pre-filling a form.

The basic syntax to use this **formset** button pluggin is to include the attribute ``data-formset`` in the button tag such as the next one:

.. code-block:: html

    <form name="testform1">
        <input type="text" name="testinput1" class="form-control">
        <input type="text" name="testinput2" class="form-control">
    </form>
    <button type="button" data-formset="testform1" data-formset-testinput1="value for field 1" data-formset-testinput2="javascript:'value for field 2 taken from field 1 using javascript expression: ' + this.testinput1.value">test formset</button>


Then, whenever the button is pushed the values of the fields that start with the prefix ``data-formset-`` will be set to the values in the attributes.

Take into account that the values to set can be either plain text or javascript expressions (provided that the value to set starts with ``javascript:``). 
These expressions will be evaluated in the context of the form (i.e. ``this`` will be the form), at the moment of clicking the button.

.. note::

    In the case of the example, when the button is clicked, the values of the fields ``testinput1`` and ``testinput2`` will be set to the values in the attributes ``data-formset-testinput1`` and ``data-formset-testinput2`` respectively.

.. note::

    In javascript, the names of the dataset attributes cannot contain dashes, and also are camel cased. So the names of the fields to set are case insensitive and cannot contain dashes.


HTML Attributes
---------------

The **formset** button only accepts one fixed attribute (``data-formset``) that is the selector for the form to set (it can also be any html5 object in the DOM). 
The rest of the attributes are the names of the fields to set (with the prefix ``data-formset-``), and the values to set in them (as in the example above).

Javascript Options object
-------------------------

The function to apply the plugin to the element accepts an object to configure the action. It can have the following options:

.. code-block:: javascript

    // The form whose values are to be set. If it is a string, it will be interpreted as a selector.
    form: null,
    // A map of field names and values to set in the form. The values can be either plain text or a HTML fragment. If the value is a function, it will be evaluated in the context of the form (i.e. this will be the form). If it is a string that starts with "javascript:", it will be evaluated as javascript code.
    fields: {}

The fields parameter contains a dictionary of field names and values to set in the form. The values can be either
strings, functions or javascript code (i.e. string starting with ``javascript:``). If the value is a function (or javascript 
code), it will be evaluated in the context of the form (i.e. ``this`` will be the form) at the moment of clicking the button. 
Otherwise it will be set as the value of the field.

.. note::

    The equivalent for html5 attributes are ``data-formset-form`` for the case of the form to set, and the case-insensitive name 
    of the each of the fields to set with the prefix ``data-formset-``; e.g. ``data-formset-q`` to set the value for 
    field named (or with id) ``q``.