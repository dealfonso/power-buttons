'use strict';

if (typeof exports === 'undefined') {
    var exports = window;
}

// We'll create a namespace for the plugin, that will contain the plugin itself
exports.powerButtons = function(param1, param2 = null, param3 = null) {

    // We are going to support three different ways of calling the plugin:
    //   - powerButtons(pluginName, els, options)
    //   - powerButtons(selector, options)
    //   - powerButtons(el, options)
    //   - powerButtons(els, options)
    
    let pluginName = null;
    let els = [];
    let options = {};

    function registeredPlugin(pluginName) {
        for (let actionName in PowerButtons.actionsRegistered) {
            if (pluginName.toLocaleLowerCase() === actionName.toLocaleLowerCase()) {
                return actionName;
            }
        }
        return null;
    }

    if (typeof(param1) === "string") {
        // Let's check if the plugin is registered
        pluginName = registeredPlugin(param1);
        if (pluginName === null) {
            // If the plugin is not registered, we'll assume that it is a selector and this is powerButtons(selector, options)
            els = document.querySelectorAll(param1);
            if (els.length === 0) {
                console.error(`Parameter ${param1} is neither the name of a registered plugin nor a valid selector`);
                return;
            }

            // If the second parameter is not an object or there are three parameters, we'll raise an error
            if (arguments.length > 2) {
                console.warn(`Ignoring extra parameters`);
            }
            options = param2;
        } else {
            // If the plugin is registered, this is powerButtons(pluginName, els, options)
            let valid = false;
            if (typeof(param2) === "string") {
                els = document.querySelectorAll(param2);
                valid = true;
            } else if (param2 instanceof HTMLElement) {
                els = [ param2 ];
                valid = true;
            } else if (param2.length !== undefined) {
                valid = true;
                for (let e in param2) {
                    if (! (param2[e] instanceof HTMLElement)) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    els = param2;
                }
            }
            if (! valid) {
                console.error(`Parameter ${param2} is neither a valid selector, a list of elements or an HTMLElement`);
                return;
            }
            options = param3;
        }
    } else if (param1 instanceof HTMLElement) {
        els = [ param1 ];
    } else if (param1.length !== undefined) {
        for (let e in param1) {
            if (! (param1[e] instanceof HTMLElement)) {
                console.error(`Parameter ${param1} is neither a valid selector, a list of elements or an HTMLElement`);
                return;
            }
        }
        els = param1;
    } else {
        console.error(`Parameter ${param1} is neither a valid selector, a list of elements or an HTMLElement`);
        return;
    }

    if (options === null) {
        options = {};
    }
    if (typeof(options) !== "object") {
        console.error(`Options parameter must be an object`);
        return;
    }

    // Retrieve the keys of the registered plugins
    if (pluginName !== null) {
        let plugin = PowerButtons.actionsRegistered[pluginName];
        for (let el of els) {
            plugin.initialize(el, options);
        }
    } else {
        // We are discovering the plugins and parameters from the tag
        PowerButtons.discover(els, options);
    }
};

exports.powerButtons.version = '2.1.2';
exports.powerButtons.plugins = function() {
    return Object.keys(PowerButtons.actionsRegistered);
}

exports.powerButtons.discoverAll = function() {
    PowerButtons.discoverAll();
}

exports.powerButtons.discover = function(els, options) {
    PowerButtons.discover(els, options);
}

if (document.addEventListener !== undefined) {
    document.addEventListener('DOMContentLoaded', function(e) {
        PowerButtons.discoverAll();
    });
}

// Now we add the plugin to jQuery, if it has been loaded
if (exports.$ !== undefined) {
    exports.$.fn.powerButtons = function(pluginName, options = {}) {
        exports.powerButtons(pluginName, this, options);
        return this;
    }
    exports.$.fn.powerButtons.version = exports.powerButtons.version;
    exports.$.fn.powerButtons.plugins = exports.powerButtons.plugins;
}