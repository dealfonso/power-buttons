.. _plugin development:

Plugin Development
==================

If you want to develop a plugin to add other buttons to the library, you can extend the class ``Action`` and overwrite the methods that you need.

Define the name for the plugin and the default options
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

First of all, you need to define a name for your plugin (e.g. ``NewPlugin``) and define the parameters that you will accept in your class, and also define the default values for each parameter.

.. code-block:: javascript

    class NewPluginAction extends Action {
        static NAME = "NewPlugin";
        static DEFAULTS = {
            "param1": "value1",
            "param2": "value2"
        };
    }

.. note::
    Each parameter can be set as ``data-newplugin-*``. For example, if you want to set the parameter ``param1`` to the value ``value1``, you can set the attribute ``data-newplugin-param1="value1"`` to the element that will have the action.

Then, you need to implement the ``execute`` method, which will be called when the user clicks on the button. This method will receive the options that the user has provided, and the actions to execute to continue with the activity or to cancel the action chain.

Implement the execution of the action
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Now you need to implement the ``execute`` method. This method will receive the options that the user has provided, and the actions to execute to continue with the activity or to cancel the action chain.

.. js:function:: static execute(el, options, onNextAction, onCancelActions)

    Executes the action

    :param HTMLElement el: the element that has the action
    :param object options: the options to use for the execution of the action (those extracted from the data attributes and the user-provided ones)
    :param function onNextAction: the action to execute after the current one has finished (i.e. to be executed to get to the next action in the process)
    :param function onCancelActions: the actions to execute if the user cancels the current action (i.e. to stop executing actions)

Register the plugin
^^^^^^^^^^^^^^^^^^^

Finally, you need to register the plugin in the library. To do that, you need to call the method ``registerAction`` of the ``Actions`` class.

.. code-block:: javascript

    NewPluginAction.register();

Overwrite other methods
^^^^^^^^^^^^^^^^^^^^^^^

There are other static methods in the ``Action`` class that you can overwrite to change the behaviour of the action.

In particular, the ``initialize`` method is called when the element is initialized. It just adds the attribute ``powerButtons`` to the element and the action entry that implements this class, with the provided options,
but you can overwrite it if you want to change the way the action is initialized or if you need to make additional tasks.

.. js:function:: static initialize(el, [ options = {} ])

    Initializes the element by adding the sidecar attribute ``powerButtons`` and the action entry that implements this class, with the provided options.

    :param HTMLElement el: the element that has the action
    :param object options: the options to use for the initialization of the action

The next method is called to extract the options from the data attributes of the element. You can overwrite it if you want to change the way the options are extracted from the data attributes, or
if you want to change the way the data attributes are named, or if you need to make additional tasks.

.. js:function:: static extractOptions(el, [ prefix = null, [ map = null ] ])

    Extract the values of the options in the DEFAULTS of the class from the data attributes of the element
    
    *   The data attributes are assumed to be named like data-{prefix}-{option} in the HTML element, where {prefix} 
        is the prefix provided (or the name of the action) and {option} is the name of the option in the DEFAULTS of the class. 

        For example, if the prefix is "verify" and the option is "title", the data attribute will be data-verify-title and the 
        value will be set to the option "title" in the extracted options object.

        It is important to note that the values that will be extracted from the data attributes, will be those keys that are 
        defined in the DEFAULTS of the class. If the data attribute is not defined in the DEFAULTS, it will be ignored.

    *   The map is used to map the data attribute names to the options names. 

        Reasoning: if we wanted an option named "verify" and we used the prefix "verify", the data attribute
        would be data-verify-verify, which is not very nice looking. So, we can use the map to map the data 
        key to the expected data attribute name. If the map is { 'verify': 'verify' }, to fill the key 'verify'
        in the resulting options object, the data attribute will be data-verify, instead of data-verify-verify.
        This also works for renaming the data attribute, so if we set a map { 'form': 'formset' }, to fill the 
        key 'form' in the options object, the data attribute to use will be data-formset.
