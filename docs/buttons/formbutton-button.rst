.. _formbutton button:

*FormButton* action
^^^^^^^^^^^^^^^^^^^

The **formbutton** action substitutes the button by a form that will contain the button. It can also add hidden fields to the form, to be submitted along with the button.

The basic syntax to use this **formbutton** button pluggin is to include the attribute ``data-formbutton`` in the button tag such as the next one:

.. code-block:: html

    <button type="button" data-formbutton data-formbutton-field-x1="valueforx1" name="my-form-button" value="1">form button</button>

Then, the button will be substituted by a form with the following structure:

.. code-block:: html

    <form>
        <input type="hidden" name="x1" value="valueforx1">
        <button type="button" name="my-form-button" value="1">
    </form>

Additionally, the values of the fields can be javascript expressions. For example: ``javascript: this.x1.value``. In that case
the value of the field will be evaluated at the moment of clicking the button (not statically).

.. note::
    I find that it is very useful to avoid the need of creating unnecessary forms in the 
    html code. For example, a web app with a control panels with many buttons and each of
    them may submit to different urls or with different parameters.

HTML Attributes
---------------

The **formbutton** button can be configured according to its specific needs. The following attributes can be set in the html5 tags:

- ``data-formbutton``: the URL to submit the form to. If it is not set to anything, the form will be submitted to the same URL as the current page.
- ``data-formbutton-method``: the method to use for the form. It defaults to *post*.
- ``data-formbutton-form-class``: the class to use for the form. It defaults to *formbutton*.
- ``data-formbutton-form-id``: the id to use for the form. It defaults to ``null``.
- ``data-formbutton-field-*``: the additional fields to add to the form, along with their values. The name of the field is the name of the attribute without the prefix ``data-formbutton-field-``. The value of the field can be either plain text or javascript expressions (provided that the value to set starts with ``javascript:``). These expressions will be evaluated in the context of the form (i.e. ``this`` will be the form), at the moment of clicking the button.
- ``data-formbutton-convert-case``: because of how html and the DOM work, the name of the fields will arrive to the library in camel case. This attribute allows to convert the case of the field names that are being created to kebab-case, snake_case, camelCase or PascalCase. The possible values are ``kebab``, ``snake``, ``camel`` or ``pascal``. It defaults to *snake*.

Javascript Options object
-------------------------

The function to apply the plugin to the element accepts an object to configure the action. It can have the following options:

.. code-block:: javascript

    // The URL to submit the form
    formbutton: null,
    // The method to use for the form
    method: 'post',
    // The class to use for the form
    formClass: 'formbutton',
    // Wether to convert the case of the payload names to kebab-case, snake_case, camelCase or PascalCase
    convertCase: 'none',
    // The id to use for the form
    formId: null,
    // The additional fields to add to the form, along with their values
    fields: {}

.. note::

    Each option correspond to an html5 attribute with the same name and the prefix ``data-formbutton-``.