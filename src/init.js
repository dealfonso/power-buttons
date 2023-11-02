'use strict';

// We'll create a namespace for the plugin, that will contain the plugin itself
window.powerButtons = function(pluginName, els = [], options = {}) {
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

window.powerButtons.version = '2.0.1';
window.powerButtons.plugins = function() {
    return Object.keys(PowerButtons.actionsRegistered);
}

// Now we add the plugin to jQuery, if it has been loaded
if (window.$ !== undefined) {
    window.$.fn.powerButtons = function(pluginName, options = {}) {
        window.powerButtons(pluginName, this, options);
        return this;
    }
    window.$.fn.powerButtons.version = window.powerButtons.version;
    window.$.fn.powerButtons.plugins = window.powerButtons.plugins;
}