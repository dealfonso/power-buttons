/**
   Copyright 2023 Carlos A. (https://github.com/dealfonso)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

(function (window, document) {
	"use strict";
	window.powerButtons = {
		version: "0.1.0"
	};

	function pascalToSnake(str) {
		return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_*/, "");
	}

	function pascalToKebab(str) {
		return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-*/, "");
	}

	function snakeCaseToCamel(str) {
		return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
	}

	function pascalToCamel(str) {
		return str.charAt(0).toLowerCase() + str.slice(1);
	}

	function CamelToCamel(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function isElement(el) {
		return el instanceof Element || el instanceof HTMLDocument;
	}

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
						if (typeof o1[key] === "object" && typeof o2[key] === "object") {
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
					} else {}
				}
			}
			if (objects.length === 2) {
				return result;
			} else {
				return mergeobjectsr(result, ...objects.slice(2));
			}
		}
	}

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

	function parseBoolean(value) {
		if (typeof value === "boolean") {
			return value;
		}
		if (typeof value === "string") {
			value = value.toLowerCase();
			if (value === "true" || value === "yes" || value === "1") {
				return true;
			}
			return false;
		}
		return !!value;
	}

	function createTag(tag, props = {}, html = null) {
		let parts_id = tag.split("#");
		let id = null;
		if (parts_id.length == 1) {
			tag = parts_id[0];
		} else {
			parts_id[1] = parts_id[1].split(".");
			id = parts_id[1][0];
			tag = [parts_id[0], ...parts_id[1].slice(1)].join(".");
		}
		let parts = tag.split(".");
		tag = parts[0];
		if (tag === "") {
			tag = "div";
		}
		if (typeof props === "string") {
			html = props;
			props = {};
		}
		if (html !== null) {
			props.innerHTML = html;
		}
		if (id !== null) {
			props.id = id;
		}
		props.className = [props.className, ...parts.slice(1)].filter(function (e) {
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

	function appendToElement(el, ...args) {
		let filtered = args.filter(e => e !== null && e !== undefined);
		el.append(...filtered);
		return el;
	}

	function searchForm(formName) {
		let formObject = null;
		if (formName !== null) {
			formObject = document.forms[formName];
			if (formObject === undefined) {
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

	function getValueWithJavascriptSupport(value, context = null) {
		let internalValue = value.trim();
		if (internalValue.startsWith("javascript:")) {
			try {
				let f = internalValue.substring(11);
				value = function () {
					return eval(f);
				}.bind(context)();
			} catch (e) {
				console.error(`Error executing javascript code ${internalValue.substring(11)}, error: ${e}`);
				value = null;
			}
		}
		return value;
	}
	class DialogLegacy {
		DEFAULTS = {
			message: "Main message",
			buttonCount: 2
		};
		constructor(options = {}, onButton = null, onHidden = null) {
			this.options = {
				...this.DEFAULTS,
				...options
			};
			this.buttonCount = this.options.buttons.length;
			this.options.buttons = ["Accept", "Cancel"];
			this.result = null;
			this.onButton = onButton;
			this.onHidden = onHidden;
		}
		dispose() {}
		show(onButton = null, onHidden = null) {
			if (onButton !== null) {
				this.onButton = onButton;
			}
			if (onHidden !== null) {
				this.onHidden = onHidden;
			}
			switch (this.buttonCount) {
			case 0:
			case 1:
				alert(this.message);
				this.result = 0;
				break;
			case 2:
				this.result = confirm(this.options.message) ? 0 : 1;
				break;
			default:
				throw `Unsupported button count ${this.buttonCount}`;
			}
			if (this.onButton !== null) {
				this.onButton(this.result, {
					button: this.result,
					text: this.options.buttons[this.result]
				}, null);
			}
			if (this.onHidden !== null) {
				this.onHidden(this.result, {
					button: this.result,
					text: this.options.buttons[this.result]
				}, null);
			}
		}
	}
	class Dialog {
		static create(options = {}, onButton = null, onHidden = null) {
			if (window.bootstrap === undefined || window.bootstrap.Modal === undefined) {
				return new DialogLegacy(options, onButton, onHidden);
			}
			if (options.selector !== undefined && options.selector !== null || options.dialogFunction !== undefined && options.dialogFunction !== null) {
				throw new Error("not implemented, yet");
			}
			return new Dialog(options, onButton, onHidden);
		}
		DEFAULTS = {
			title: "Title",
			message: "Main message",
			customContent: null,
			buttons: ["Accept"],
			buttonClasses: ["btn-primary", "btn-secondary"],
			buttonPanelClasses: ["text-end"],
			escapeKeyCancels: true,
			header: true,
			footer: true,
			body: true,
			close: true
		};
		dialog = null;
		options = null;
		modal = null;
		onButton = null;
		result = null;
		onHidden = null;
		onButton = null;
		constructor(options = {}, onButton = null, onHidden = null) {
			if (window.bootstrap === undefined || window.bootstrap.Modal === undefined) {
				throw new Error("Bootstrap is required to use this class");
			}
			this.options = {
				...this.DEFAULTS,
				...options
			};
			let parsedButtons = [];
			for (let i = 0; i < this.options.buttons.length; i++) {
				let button = this.options.buttons[i];
				if (typeof button === "string") {
					button = {
						text: button
					};
				} else {
					if (button.text === undefined) {
						button.text = `Button ${i}`;
					}
				}
				if (button.class === undefined) {
					button.class = this.options.buttonClasses[Math.min(i, this.options.buttonClasses.length - 1)];
				}
				parsedButtons.push(button);
			}
			this.options.buttons = parsedButtons;
			this.dialog = null;
			this.modal = null;
			this.result = null;
			this.onButton = onButton;
			this.onHidden = onHidden;
			this._hiddenHandler = this._hiddenHandler.bind(this);
		}
		_hiddenHandler() {
			this.dialog.removeEventListener("hidden.bs.modal", this._hiddenHandler);
			if (this.onHidden !== null) {
				if (this.result !== null && this.result >= 0) {
					this.onHidden(this.result, {
						button: this.result,
						text: this.options.buttons[this.result]
					});
				} else {
					this.onHidden(this.result, null);
				}
			}
		}
		dispose() {
			if (this.modal !== null) {
				this.modal.dispose();
				this.modal = null;
			}
			this.dialog.remove();
			this.dialog = null;
		}
		show(onButton = null, onHidden = null) {
			if (this.dialog === null) {
				this.dialog = this._build_dialog(this.options);
			}
			if (this.modal === null) {
				this.modal = new bootstrap.Modal(this.dialog, {
					backdrop: this.options.escapeKeyCancels ? true : "static",
					keyboard: this.options.escapeKeyCancels
				});
			}
			this.dialog.addEventListener("hidden.bs.modal", this._hiddenHandler);
			this.result = null;
			if (onButton !== null) {
				this.onButton = onButton;
			}
			if (onHidden !== null) {
				this.onHidden = onHidden;
			}
			this.modal.show();
		}
		hide() {
			this.modal.hide();
		}
		_handleButton(index, button, buttonObject) {
			this.result = index;
			let autoHide = true;
			if (this.onButton !== null) {
				autoHide = !(this.onButton(index, button, buttonObject) === false);
			}
			if (autoHide) {
				this.hide();
			}
		}
		_build_dialog(options = {}) {
			let header = null;
			let closeButton = null;
			if (parseBoolean(options.close)) {
				closeButton = createTag("button.close.btn-close", {
					type: "button",
					"aria-label": "Close"
				});
				closeButton.addEventListener("click", () => this._handleButton(-1, null, closeButton));
			}
			if (parseBoolean(options.header)) {
				header = createTag(".modal-header");
				if (options.title !== null) {
					header.append(appendToElement(createTag(".modal-title"), appendToElement(createTag("h5", options.title))));
				}
				if (parseBoolean(options.close)) {
					header.append(closeButton);
				}
			}
			let buttons = [];
			if (options.buttons !== null) {
				for (let i = 0; i < options.buttons.length; i++) {
					let button = options.buttons[i];
					let buttonClass = button.class.split(" ").map(e => e.trim()).filter(e => e !== "").join(".");
					if (options.footer === false) {
						buttonClass += ".mx-1";
					}
					if (buttonClass !== "") {
						buttonClass = "." + buttonClass;
					}
					let buttonObject = createTag("button.btn" + buttonClass + ".button" + i, {
						type: "button"
					}, button.text);
					buttonObject.addEventListener("click", function () {
						this._handleButton(i, button, buttonObject);
						if (button.handler !== undefined && button.handler !== null) {
							button.handler(i, button, buttonObject);
						}
					}.bind(this));
					buttons.push(buttonObject);
				}
			}
			let footer = null;
			if (parseBoolean(options.footer)) {
				footer = appendToElement(createTag(".modal-footer"), ...buttons);
			}
			let body = null;
			if (parseBoolean(options.body)) {
				body = createTag(".modal-body");
				if (header === null) {
					if (parseBoolean(options.close)) {
						body.append(appendToElement(createTag(".text-end"), closeButton));
					}
				}
				if (options.message !== null) {
					body.append(createTag("p.message.text-center", options.message));
				}
				if (options.customContent !== null) {
					body.append(createTag(".custom-content.mx-auto", options.customContent));
				}
				if (footer === null) {
					let buttonPanelClasses = options.buttonPanelClasses.map(e => e.trim()).filter(e => e !== "").join(".");
					if (buttonPanelClasses !== "") {
						buttonPanelClasses = "." + buttonPanelClasses;
					}
					appendToElement(body, appendToElement(createTag(".buttons" + buttonPanelClasses), ...buttons));
				}
			}
			let dialog = appendToElement(createTag(".modal.fade", {
				tabindex: "-1",
				role: "dialog",
				"aria-hidden": "true",
				"data-keyboard": "false"
			}), appendToElement(createTag(".modal-dialog.modal-dialog-centered", {
				role: "document"
			}), appendToElement(createTag(".modal-content"), header, body, footer)));
			return dialog;
		}
	}

	function confirmDialog(message, title = "this action needs confirmation", onConfirm = null, onCancel = null, cancellable = true) {
		let dialog = new Dialog({
			title: title,
			message: message,
			buttons: [{
				text: "Cancel",
				class: "btn-secondary",
				handler: onCancel
			}, {
				text: "Confirm",
				class: "btn-primary",
				handler: onConfirm
			}],
			escapeKeyCancels: cancellable
		});
		dialog.show();
		return dialog;
	}

	function alertDialog(message, title = "Alert", onAccept = null) {
		let dialog = new Dialog({
			title: title,
			message: message,
			buttons: [{
				text: "Accept",
				class: "btn-primary",
				handler: onAccept
			}],
			escapeKeyCancels: true
		});
		dialog.show();
		return dialog;
	}

	function loadingDialog(message, customContent = null, canCancel = null) {
		if (typeof customContent === "function") {
			canCancel = customContent;
			customContent = null;
		}
		let dialog = new Dialog({
			title: null,
			message: message,
			buttons: [{
				text: "Cancel",
				class: "btn-primary"
			}],
			customContent: customContent,
			escapeKeyCancels: false,
			close: false,
			header: false,
			footer: false
		}, canCancel);
		dialog.show();
		return dialog;
	}
	window.powerButtons = mergeobjectsr(window.powerButtons, {
		utils: {
			confirmDialog: confirmDialog,
			alertDialog: alertDialog,
			loadingDialog: loadingDialog
		}
	});
	class PowerButtons {
		static actionsRegistered = {};
		static registerAction(action) {
			console.debug(`Registering action ${action.NAME}`);
			this.actionsRegistered[action.NAME] = action;
			let actionConfig = {};
			actionConfig[`defaults${action.NAME}`] = action.DEFAULTS;
			window.powerButtons = mergeobjectsr(window.powerButtons, {
				config: actionConfig
			});
		}
		static addAction(el, options = {}) {
			let powerButton = PowerButtons.addActionSupport(el);
			powerButton.appendAction(options);
		}
		static addActionSupport(el) {
			if (el._powerButtons === undefined) {
				el._powerButtons = new PowerButtons(el);
			} else {
				el._powerButtons.reset();
			}
			return el._powerButtons;
		}
		el = null;
		current_action = 0;
		actions = [];
		back_onclick = null;
		constructor(el) {
			el._powerButtons = this;
			this.el = el;
			this.current_action = 0;
			this.actions = [];
			this.back_onclick = null;
			if (el.onclick !== undefined && el.onclick !== null) {
				this.back_onclick = el.onclick;
				el.onclick = null;
			}
			el.addEventListener("click", this.handlerClick.bind(this));
		}
		appendAction(options = {}) {
			if (options.type === undefined) {
				throw "The type of the action is mandatory";
			}
			this.actions.push(options);
		}
		handlerClick(e) {
			if (this.current_action >= this.actions.length) {
				this.current_action = 0;
				if (typeof this.back_onclick === "function") {
					if (!this.back_onclick()) {
						e.preventDefault();
					}
				}
				return;
			}
			let currentActionSettings = this.actions[this.current_action];
			e.preventDefault();
			e.stopImmediatePropagation();
			let onNextAction = function () {
				this.current_action++;
				if (this.current_action >= this.actions.length) {
					if (this.el.click !== undefined) {
						this.el.click();
					} else {
						this.el.dispatchEvent(new Event(e.type, e));
					}
				} else {
					this.el.dispatchEvent(new Event(e.type, e));
				}
			}.bind(this);
			let action = this.constructor.actionsRegistered[currentActionSettings.type];
			if (action === undefined) {
				throw `The action ${currentActionSettings.type} is not registered`;
			}
			action.execute(currentActionSettings, onNextAction, () => this.reset());
		}
		reset() {
			this.current_action = 0;
		}
		static initializeAll() {
			Object.entries(this.actionsRegistered).forEach(([key, action]) => {
				action.initializeAll();
			});
		}
	}

	function init(document) {
		PowerButtons.initializeAll();
	}
	if (document.addEventListener !== undefined) {
		document.addEventListener("DOMContentLoaded", function (e) {
			init(document);
		});
	}
	class Action {
		static NAME = null;
		static register(exports) {
			PowerButtons.registerAction(this);
		}
		static DEFAULTS = {};
		static extractOptions(el, prefix = null, map = null) {
			if (prefix === null) {
				prefix = this.NAME.toLowerCase();
			}
			if (map === null) {
				map = {};
				map[prefix] = prefix;
			}
			let options = extractValues(this.DEFAULTS, el.dataset, prefix, map);
			return options;
		}
		static initialize(el, values = {}, prefix = null, map = null) {
			let options = this.extractOptions(el, prefix, map);
			options.type = this.NAME;
			PowerButtons.addAction(el, Object.assign({}, options, extractValues(this.DEFAULTS, values)));
		}
		static initializeAll(values = {}, prefix = null, map = null) {
			if (prefix === null) {
				prefix = this.NAME.toLowerCase();
			}
			for (let el of document.querySelectorAll(`[data-${prefix}`)) {
				this.initialize(el, values, prefix, map);
			}
		}
		static execute(options, onNextAction, onCancelActions) {
			throw new Error("The execute method must be implemented by the derived class");
		}
	}
	class ActionConfirm extends Action {
		static NAME = "Confirm";
		static DEFAULTS = {
			confirm: "Please confirm this action",
			customContent: null,
			title: "The action requires confirmation",
			buttonConfirm: "Confirm",
			buttonCancel: "Cancel",
			buttonClose: true,
			escapeKey: true
		};
		static execute(options, onNextAction, onCancelActions) {
			let settings = flattenobjects(this.DEFAULTS, window.powerButtons.config.defaultsConfirm, options);
			let dialog = Dialog.create({
				title: settings.title,
				message: settings.confirm,
				customContent: settings.customContent,
				buttons: [settings.buttonConfirm, settings.buttonCancel],
				escapeKeyCancels: settings.escapeKey,
				close: settings.buttonClose
			}, null, function (result) {
				if (result === 0) {
					if (onNextAction !== null) {
						onNextAction();
					}
				} else {
					if (onCancelActions !== null) {
						onCancelActions();
					}
				}
			});
			dialog.show();
		}
	}
	ActionConfirm.register();
	class ActionFormset extends Action {
		static NAME = "Formset";
		static DEFAULTS = {
			form: null,
			fields: {}
		};
		static extractOptions(el, prefix = null, map = null) {
			if (prefix === null) {
				prefix = this.NAME.toLowerCase();
			}
			let options = super.extractOptions(el, prefix, {
				form: "formset"
			});
			let fields = {};
			for (let key in el.dataset) {
				if (key.startsWith(prefix)) {
					let fieldname = key.substring(prefix.length);
					if (fieldname === "") {
						continue;
					}
					if (fieldname[0] !== fieldname[0].toUpperCase()) {
						continue;
					}
					fieldname = fieldname.toLocaleLowerCase();
					fields[fieldname] = el.dataset[key];
				}
			}
			options.fields = mergeobjectsr(options.fields, fields);
			return options;
		}
		static execute(options, onNextAction, onCancelActions) {
			let settings = flattenobjects(this.DEFAULTS, window.powerButtons.config.defaultsFormset, options);
			let formToSet = searchForm(settings.form);
			if (formToSet === null) {
				console.error(`Form not found ${settings.form}`);
				return;
			}
			let nameMap = {};
			for (var i = 0; i < formToSet.elements.length; i++) {
				let element = formToSet.elements[i];
				if (element.name !== "") {
					nameMap[element.name.toLocaleLowerCase()] = element.name;
				}
				if (element.id !== "") {
					nameMap[element.id.toLocaleLowerCase()] = element.id;
				}
			}
			for (var field in settings.fields) {
				if (nameMap[field] !== undefined) {
					let value = settings.fields[field];
					formToSet[nameMap[field]].value = getValueWithJavascriptSupport(value, formToSet);
				}
			}
			onNextAction();
		}
	}
	ActionFormset.register();
	class ActionShowMessage extends Action {
		static NAME = "ShowMessage";
		static DEFAULTS = {
			showmessage: "This is a message",
			customContent: null,
			title: null,
			buttonAccept: "Accept",
			escapeKey: true,
			buttonClose: true,
			header: true,
			footer: true
		};
		static execute(options, onNextAction, onCancelActions) {
			let settings = flattenobjects(this.DEFAULTS, window.powerButtons.config.defaultsShowMessage, options);
			let dialog = Dialog.create({
				title: settings.title,
				message: settings.showmessage,
				customContent: settings.customContent,
				buttons: [settings.buttonAccept],
				escapeKeyCancels: settings.escapeKey,
				close: settings.buttonClose,
				header: options.header !== undefined ? settings.header : settings.title !== null && settings.title != "",
				footer: options.footer !== undefined ? settings.footer : settings.buttonAccept !== null && settings.buttonAccept != ""
			}, null, function (result) {
				if (onNextAction !== null) {
					onNextAction();
				}
			});
			dialog.show();
		}
	}
	ActionShowMessage.register();
	class ActionVerify extends Action {
		static NAME = "Verify";
		static DEFAULTS = {
			verify: null,
			form: null,
			verified: null,
			notVerified: "The condition for this action is not met",
			customContentVerified: null,
			customContentNotVerified: null,
			titleNotVerified: "The action requires verification",
			titleVerified: null,
			buttonAccept: "Accept",
			buttonClose: false,
			escapeKey: true,
			header: true,
			footer: true
		};
		static execute(options, onNextAction, onCancelActions) {
			let settings = flattenobjects(this.DEFAULTS, window.powerButtons.config.defaultsVerify, options);
			let result = null;
			let bindObject = searchForm(settings.form);
			if (bindObject === null) {
				bindObject = document;
			}
			try {
				if (typeof settings.verify === "function") {
					result = settings.verify.bind(bindObject)();
				} else if (typeof settings.verify === "string") {
					result = function () {
						return eval(settings.verify);
					}.bind(bindObject)();
				} else {
					result = parseBoolean(settings.verify);
				}
			} catch (e) {
				console.error("Error executing verification function", e);
				result = false;
			}
			let dialog = null;
			let onVerificationSuccess = onNextAction;
			let onVerificationFailure = onCancelActions;
			if (result) {
				if (settings.verified !== null || settings.customContentVerified !== null || settings.titleVerified !== null) {
					dialog = Dialog.create({
						title: settings.titleVerified,
						message: settings.verified,
						customContent: settings.customContentVerified,
						buttons: [settings.buttonAccept],
						escapeKeyCancels: settings.escapeKey,
						close: settings.buttonClose
					}, null, function (result) {
						if (onVerificationSuccess !== null) {
							onVerificationSuccess();
						}
					});
				}
			} else {
				if (settings.notVerified !== null || settings.customContentNotVerified !== null || settings.titleNotVerified !== null) {
					dialog = Dialog.create({
						title: settings.titleNotVerified,
						message: settings.notVerified,
						customContent: settings.customContentNotVerified,
						buttons: [settings.buttonAccept],
						escapeKeyCancels: settings.escapeKey,
						close: settings.buttonClose
					}, null, function (result) {
						if (onVerificationFailure !== null) {
							onVerificationFailure();
						}
					});
				}
			}
			if (dialog !== null) {
				dialog.show();
			} else {
				if (result) {
					if (onVerificationSuccess !== null) {
						onVerificationSuccess();
					}
				} else {
					if (onVerificationFailure !== null) {
						onVerificationFailure();
					}
				}
			}
		}
	}
	ActionVerify.register();
})(window, document);
