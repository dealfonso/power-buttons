function pascalToSnake(str) { return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_*/,'') };
function pascalToKebab(str) { return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-*/,''); }
function snakeCaseToCamel(str) { return str.replace(/-([a-z])/g, g => g[1].toUpperCase()); }
function pascalToCamel(str) { return str.charAt(0).toLowerCase() + str.slice(1); }
function CamelToCamel(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function isElement(el) { return el instanceof Element || el instanceof HTMLDocument; }

/**
 * Flattens several objects, returning a new object with the keys of the first object. If a property is present in multiple objects,
 * the value of the latter object will be used.
 * 
 * This is much of the case of Object.assign, but this function will not modify the first object, and will return a new object.
 *  Moreover this function only considers the keys in the first object, so if the second object has more keys, they will be ignored.
 * 
 * (*) is oriented to create a full "settings" object from the user-provided settings
 * 
 * @param {*} o1, the first object
 * @param {*} o2, the second object
 * ...
 * @returns the merged object
 */
function flattenobjects(o1, ...objects) {
    let result = {};
    for (let key in o1) {
        result[key] = o1[key];
        for (let i = 0; i < objects.length; i++) {
            if (objects[i][key] !== undefined) {
                result[key] = objects[i][key];
            }
        }
    }
    return result;
}

/**
 * Merges objects recursively, returning a new object with the keys of all objects. If a property is present in multiple objects,
 *  the value of the latter object will be used.
 * @param {*} ...objects, the objects to merge
 * @returns the merged object
 */
function mergeobjectsr(...objects) {
    if (objects.length === 0) {
        return {};
    } else if (objects.length === 1) {
        return objects[0];
    } else {
        let result = {};
        let o1 = objects[0];
        if (o1 === undefined) {
            o1 = {};
        }
        let o2 = objects[1];
        if (o2 === undefined) {
            o2 = {};
        }
        if (o1 !== undefined) {
            for (let key in o1) {
                if (o2[key] !== undefined) {
                    if (typeof(o1[key]) === "object" && typeof(o2[key]) === "object") {
                        result[key] = mergeobjectsr(o1[key], o2[key]);
                        continue;
                    } else {
                        result[key] = o2[key];
                    }
                } else {
                    result[key] = o1[key];
                }
            }
        }
        for (let key in o2) {
            if (o1 !== undefined) {
                if (o1[key] === undefined) {
                    result[key] = o2[key];
                } else {
                    // It has already been merged
                }
            }
        }
        if (objects.length === 2) {
            return result;
        } else {
            return mergeobjectsr(result, ...objects.slice(2));
        }
    }
}

/**
 * Exctracts the values from an object, using the defaults as a reference. Each key in the defaults object will 
 *  be used to extract the value from the dataset of the object.
 * 
 * The values are expressed like 
 *  <div data-operation1-value1="1" data-operation1-value2="2" ...></div>
 * 
 * If we want to extract "value1" and "value2" from the dataset of the div for operation "operation1", we'll have a defaults
 *  object like this:
 *  { value1 : 0, value2 : 0 }
 * 
 * The prefix will be "operation1", that will be prepended to the key in the defaults, and so the name of the keys in the 
 *  dataset will be: operation1Value1 and operation1Value2.
 * 
 * The map is used to map the keys in the defaults object to the keys in the dataset. For example, if we want to map the
 *  key "value1" to "name", we'll have a map like this: { value1 : "name" }
 * 
 * We may also provide a set of "values" to override the values in the dataset. 
 * 
 * @param {*} defaults, the defaults object (the resulting settings will contain all the keys in this object)
 * @param {*} values, the actual values for the settings (that will override the values in the dataset)
 * @param {*} prefix, the prefix to prepend to the keys in the defaults object to get the keys in the dataset
 * @param {*} map, the map to rename the keys in the defaults object to the keys in the dataset
 * @param {*} include_defaults, if true, the resulting settings will contain all the keys in the defaults object, even if
 *                             they are not present in the dataset (they will have the value in the defaults object)
 * @returns the settings object that will contain (at least) all the keys in the defaults object with the values
 *          extracted from the dataset (or the values object, or the defaults object)
 */
function extractValues(defaults, values, prefix = "", map = {}, include_defaults = false) {
    let options = {};
    for (let key in defaults) {
        let targetKey = key;
        if (map[targetKey] !== undefined) {
            targetKey = map[targetKey];
        } else {
            targetKey = prefix + CamelToCamel(targetKey);
        }
        if (values[targetKey] !== undefined) {
            options[key] = values[targetKey];
        } else {
            if (include_defaults) {
                options[key] = defaults[key];
            }
        }
    }
    return options;
}

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
            formObject = document.querySelector(settings.form);
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