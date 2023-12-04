'use strict';

if (typeof exports === 'undefined') {
    var exports = window;
}

// We'll create a namespace for the plugin, that will contain the plugin itself
exports.powerButtons = function(pluginName, els = [], options = {}) {
    let elements = els;

    if (typeof(elements) === "string") {
        elements = document.querySelectorAll(elements);
    } else {
        if (elements.length === undefined) {
            elements = [ elements ];
        }
    }
    let pluginToApply = null;
    for (let actionName in PowerButtons.actionsRegistered) {
        if (pluginName.toLocaleLowerCase() === actionName.toLocaleLowerCase()) {
            pluginToApply = PowerButtons.actionsRegistered[actionName];
            break;
        }
    }
    if (pluginToApply === undefined) {
        console.error(`The action ${pluginName} is not registered`);
    } else {
        for (let el of elements) {
            pluginToApply.initialize(el, options);
        }
    }
    return els;
};

exports.powerButtons.version = '2.0.2';
exports.powerButtons.plugins = function() {
    return Object.keys(PowerButtons.actionsRegistered);
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