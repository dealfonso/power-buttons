.. _using the library:

Using the library
=================

It is possible to use *PowerButtons* in a declarative way (i.e. including parameters in the html5 tags), or programmatically in a script either using vanilla javascript or jQuery.

Using the library in a declarative way
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In most of cases the prefered method is to use the library in a declarative way, i.e. adding the parameters in the html5 tags. This is the way I use the library in my own projects, 
so that I can add the functionality to the buttons without writing any javascript code.

The following example shows how to show a message when the user clicks on a button, before submitting a form.

.. code-block:: html

    <button type="submit" data-showmessage="show a message">Send the form</button>

.. note::
    Using the library in this way has the limitation that the order of application of the plugins is fixed, and the fact that a plugin can only be applied to a button once (:ref:`see details <multiple actions>`). 
    In case of complex requirements, it is better to use the library programmatically.


Vanilla javascript API
^^^^^^^^^^^^^^^^^^^^^^

The library can also be used programmatically using vanilla javascript. Using this method, the library can be used in a more flexible way, but it requires a bit of code to add the
functionality to the buttons.

The library exports a global function called ``window.powerButtons``:

.. js:function:: window.powerButtons(pluginName, els = [], options = {})

    This function is used to add actions to the buttons programmatically. In particular, it applies the plugin ``pluginName`` to the elements ``els`` with the options ``options``.

    :param string pluginName: the name of the plugin to apply (e.g. ``confirm``, ``showmessage``, etc.)
    :param string|HTMLElement|array[HTMLElement]|array[string] els: the elements to which the plugin will be applied. If it is a string (or an array of strings), each one is interpreted as a selector. 
        If it is an HTMLElement (or an array of HTMLElements), each element is interpreted as a single element.
    :param object options: the options to pass to the plugin (the options depend on the plugin)
    :returns: the elements to which the plugin has been applied

For example:

.. code-block:: html

    <button id="mybutton">Send the form</button>
    <script>
    powerButtons('confirm', '#mybutton', {confirm: "Are you sure?"});
    </script>


.. js:attribute:: window.powerButtons.version

    This attribute contanins the version of the library.

.. js:function:: window.powerButtons.plugins()

    This function returns the list of the available plugins.

    :returns: the list of the available plugins (in the order that they are applied)

jQuery API
^^^^^^^^^^

The library can also be used programmatically using jQuery. Using this method is similar to using the library with vanilla javascript, but it integrates with jQuery.

The library exports a jQuery function called ``jQuery.fn.powerButtons``:

.. js:function:: $.fn.powerButtons(pluginName, options = {})

    This function applies the plugin ``pluginName`` to the jQuery elements, with the options ``options``.

    :param string pluginName: the name of the plugin to apply (e.g. ``confirm``, ``showmessage``, etc.)
    :param object options: the options to pass to the plugin (the options depend on the plugin)
    :returns: the elements to which the plugin has been applied

For example:

.. code-block:: html

    <button id="mybutton">Send the form</button>
    <script>
    $('#mybutton').powerButtons('confirm', {confirm: "Are you sure?"});
    </script>

.. js:attribute:: $.fn.powerButtons.version

    This attribute contanins the version of the library.

.. js:function:: $.fn.powerButtons.plugins()

    This function returns the list of the available plugins.

    :returns: the list of the available plugins (in the order that they are applied)

.. _multiple actions:

Multiple actions in the same button
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A button can contain multiple of "powers" at the same time. For example, a button can be a **confirm** button and a **verify** button at the same time.

If using the *declarative method*, there is a fixed order:

#. ``verify``
#. ``confirm``
#. ``asynctask``
#. ``showmessage``
#. ``formset``
#. ``formbutton`` (to resolve the values that depend on javacript)
#. the real action (i.e. ``onclick`` handler)

If using the programmatical method, the order in which the actions are added is the order in which they will be executed.

E.g. a button can be a **confirm** button and a **showmessage** button at the same time:

.. code-block:: javascript

    $('#mybutton').powerButtons('confirm', options).powerButtons('showmessage', {showmessage: "The confirmation has been done"});

The button will first show a confirmation dialog, and if it is confirmed, it will show a message dialog, and finally it will continue with its action.

Moreover, it would be possible to apply the same action to the same button multiple times, e.g.:

.. code-block:: javascript

    let el = document.getElementById('mybutton');
    powerButtons('confirm', el, {confirm: "Are you sure?"});
    powerButtons('confirm', el, {confirm: "Are you really sure?"});

In this case, the button will show a confirmation dialog with the text *Are you sure?* and if it is confirmed, it will show another confirmation dialog with the text *Are you really sure?*.