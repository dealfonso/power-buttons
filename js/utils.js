function pascalToSnake(str) { return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_*/,'') };
function pascalToKebab(str) { return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-*/,''); }
function snakeCaseToCamel(str) { return str.replace(/-([a-z])/g, g => g[1].toUpperCase()); }
function pascalToCamel(str) { return str.charAt(0).toLowerCase() + str.slice(1); }
function CamelToCamel(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function isElement(el) { return el instanceof Element || el instanceof HTMLDocument; }

/**
 * Parses a boolean value from a string or a boolean value (e.g. "true" => true, "false" => false, "yes" => true, 
 *  "no" => false, "1" => true, "0" => false)
 * @param {*} value 
 * @returns 
 */
function parseBoolean(value) {
    if (typeof(value) === "boolean") {
        return value;
    }
    if (typeof(value) === "string") {
        value = value.toLowerCase();
        if (value === "true" || value === "yes" || value === "1") {
            return true;
        }
        return false;
    }
    return !!value;
}

/**
 * This function creates a tag object using a notation like the one used for query selectors (e.g. div#myid.myclass.myclass2)
 *   if ommited the tag name, it will be considered as a div (e.g. #myid.myclass1.myclass2 or .myclass1.myclass2)
 * @param {*} tag tag to create in the form '<tag>#<id>.<class1>.<class2>'
 * @param {*} props other properties to set to the element (e.g. attributes) ** if is a text, it will be interpreted as the text param
 * @param {*} html html content to set to the element (if prop is set to a string, this param will be ignored)
 * @returns the objet
 */
function createTag(tag, props = {}, html = null) {
    let parts_id = tag.split('#');

    let id = null;
    if (parts_id.length == 1) {
        tag = parts_id[0];
    } else {
        parts_id[1] = parts_id[1].split('.')
        id = parts_id[1][0];
        tag = [ parts_id[0], ...parts_id[1].slice(1) ].join('.');
    }

    let parts = tag.split('.');
    tag = parts[0];
    if (tag === "") {
        tag = "div";
    }

    if (typeof(props) === "string") {
        html = props;
        props = {};
    }

    if (html !== null) {
        props.innerHTML = html;
    }

    if (id !== null) {
        props.id = id;
    }

    props.className = [ props.className, ...parts.slice(1) ].filter(function(e) {
        return `${e}`.trim() !== "";
    }).join(" ");

    let el = document.createElement(tag);
    for (let prop in props) {
        if (el[prop] !== undefined) {
            el[prop] = props[prop];
        } else {
            el.setAttribute(prop, props[prop]);
        }
    }
    return el;
}

/**
 * This function is a proxy to Element.append, but it returns the object, to enable to chain actions
 * @param {*} el The element to append to
 * @param  {...any} args The objects to append to the element
 * @returns the element
 */
function appendToElement(el, ...args) {
    let filtered = args.filter((e) => e !== null && e !== undefined);
    el.append(...filtered);
    return el;
}

/**
 * This function searches for a form in the document. It first tries to find the form by name, and if it fails, it tries
 *  to find the form assuming that the parameter was a query selector.
 * If the form is not found, it will return null
 *  (*) If a selector is provided, we are checking if the HTML Element is actually a form, but we are only issuing a warning;
 *      the object is returned anyway just in case it is useful for the caller
 * @param {*} formName, the name of the form to search for (or the query selector)
 * @returns an HTMLElement or null if the form was not found
 */
function searchForm(formName) {
    let formObject = null;
    if (formName !== null) {
        // first we are assuming that the form is a name
        formObject = document.forms[formName];

        if (formObject === undefined) {
            // if it was not a form name (or ID) let's assume that the form is a selector
            formObject = document.querySelector(formName);
            if (formObject === null) {
                console.warn(`form ${formName} not found`);
            }
        }    
    }
    if (formObject !== null) {
        if (formObject.tagName.toLowerCase() !== "form") {
            console.warn(`form ${formName} is not a form`);
        }
    }
    return formObject;
}

/**
 * Checks wether a value is a javascript expression or not, because it starts with "javascript:". If it is, it executes
 *  the expression and returns the result. If not, it returns the value as it is.
 * @param {*} value, the value to check
 * @param {*} context, the context to use when executing the javascript code (i.e. the this object)
 * @returns the value or the result of the javascript code
 */
function getValueWithJavascriptSupport(value, context = null) {
    let internalValue = value.trim();
    // If the value starts with javascript:, we'll execute the code and use the result as value
    if (internalValue.startsWith("javascript:")) {
        try {
            let f = internalValue.substring(11);
            value = function() {
                return eval(f)
            }.bind(context)();
        } catch (e) {
            console.error(`Error executing javascript code ${internalValue.substring(11)}, error: ${e}`);
            value = null;
        }
    }
    return value
}

/**
 * Returns a promise that will be resolved when the event is triggered in the element
 * @param {HTMLElement} el, the element to wait for the event
 * @param {string} event, the event name to wait for
 * @returns a promise that will be resolved when the event is triggered
 */
function promiseForEvent(el, event) {
    let resolveFunction = null;
    let promise = new Promise((resolve) => {
        resolveFunction = resolve;
    });
    let handler = function() {
        el.removeEventListener(event, handler);
        resolveFunction();
    }
    el.addEventListener(event, handler);
    return promise;
}
