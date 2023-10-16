.. _getting the library:

Getting the library
-------------------

You can either use this library from a CDN, or serve it from your own servers.

Getting from a CDN
^^^^^^^^^^^^^^^^^^

You can use this library directly from jsdelivr CDN

This is the recommended method, so you don't have to worry about updating the library.

It is possible to use either the latest version, or a specific version. The recommendation is to use the latest minor version, so you get the latest bug fixes and features, but you don't get breaking changes. 

.. code-block:: html

    <script src="https://cdn.jsdelivr.net/gh/dealfonso/power-buttons@2.0/dist/powerbuttons.min.js"></script>

Using a specific version
~~~~~~~~~~~~~~~~~~~~~~~~

If you want to use a specific version, you can use the following syntax:

.. code-block:: html

    <script src="https://cdn.jsdelivr.net/gh/dealfonso/power-buttons@2.0.0/dist/powerbuttons.min.js"></script>

But if you want to use a less specific version, that includes the updates of the minor version, you can use the following syntax:

.. code-block:: html

    <script src="https://cdn.jsdelivr.net/gh/dealfonso/power-buttons@2.0/dist/powerbuttons.min.js"></script>

Using the latest version
~~~~~~~~~~~~~~~~~~~~~~~~

If you want to use the latest version, you can use the following syntax. This is not recommended, as it can break your code if there are breaking changes in major releases.

.. code-block:: html

    <script src="https://cdn.jsdelivr.net/gh/dealfonso/power-buttons/dist/powerbuttons.min.js"></script>

Serving from your servers
^^^^^^^^^^^^^^^^^^^^^^^^^

You can clone this repo and copy the main file into the appropriate folder, to serve using your server:

.. code-block:: bash

    $ git clone https://github.com/dealfonso/power-buttons.git
    $ cp power-buttons/dist/power-buttons.js /path/to/my/html/folder

And then you can use it in your html file:

.. code-block:: html

    <script src="/path/to/my/html/folder/power-buttons.js"></script>

.. note::

   You can get the source of **PowerButtons** at `GitHub <https://github.com/dealfonso/power-buttons>`_.

