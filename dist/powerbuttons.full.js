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

(function (exports) {
	"use strict";
	if (typeof exports === "undefined") {
		var exports = window
	}
	exports.powerButtons = function (param1, param2 = null, param3 = null) {
		let pluginName = null;
		let els = [];
		let options = {};

		function registeredPlugin(pluginName) {
			for (let actionName in PowerButtons.actionsRegistered) {
				if (pluginName.toLocaleLowerCase() === actionName.toLocaleLowerCase()) {
					return actionName
				}
			}
			return null
		}
		if (typeof param1 === "string") {
			pluginName = registeredPlugin(param1);
			if (pluginName === null) {
				els = document.querySelectorAll(param1);
				if (els.length === 0) {
					console.error(`Parameter ${param1} is neither the name of a registered plugin nor a valid selector`);
					return
				}
				if (arguments.length > 2) {
					console.warn(`Ignoring extra parameters`)
				}
				options = param2
			} else {
				let valid = false;
				if (typeof param2 === "string") {
					els = document.querySelectorAll(param2);
					valid = true
				} else if (param2 instanceof HTMLElement) {
					els = [param2];
					valid = true
				} else if (param2.length !== undefined) {
					valid = true;
					for (let e in param2) {
						if (!(param2[e] instanceof HTMLElement)) {
							valid = false;
							break
						}
					}
					if (valid) {
						els = param2
					}
				}
				if (!valid) {
					console.error(`Parameter ${param2} is neither a valid selector, a list of elements or an HTMLElement`);
					return
				}
				options = param3
			}
		} else if (param1 instanceof HTMLElement) {
			els = [param1]
		} else if (param1.length !== undefined) {
			for (let e in param1) {
				if (!(param1[e] instanceof HTMLElement)) {
					console.error(`Parameter ${param1} is neither a valid selector, a list of elements or an HTMLElement`);
					return
				}
			}
			els = param1
		} else {
			console.error(`Parameter ${param1} is neither a valid selector, a list of elements or an HTMLElement`);
			return
		}
		if (options === null) {
			options = {}
		}
		if (typeof options !== "object") {
			console.error(`Options parameter must be an object`);
			return
		}
		if (pluginName !== null) {
			let plugin = PowerButtons.actionsRegistered[pluginName];
			for (let el of els) {
				plugin.initialize(el, options)
			}
		} else {
			PowerButtons.discover(els, options)
		}
	};
	exports.powerButtons.version = "2.1.0";
	exports.powerButtons.plugins = function () {
		return Object.keys(PowerButtons.actionsRegistered)
	};
	exports.powerButtons.discoverAll = function () {
		PowerButtons.discoverAll()
	};
	exports.powerButtons.discover = function (els, options) {
		PowerButtons.discover(els, options)
	};
	if (document.addEventListener !== undefined) {
		document.addEventListener("DOMContentLoaded", function (e) {
			PowerButtons.discoverAll()
		})
	}
	if (exports.$ !== undefined) {
		exports.$.fn.powerButtons = function (pluginName, options = {}) {
			exports.powerButtons(pluginName, this, options);
			return this
		};
		exports.$.fn.powerButtons.version = exports.powerButtons.version;
		exports.$.fn.powerButtons.plugins = exports.powerButtons.plugins
	}

	function pascalToSnake(str) {
		return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_*/, "")
	}

	function pascalToKebab(str) {
		return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-*/, "")
	}

	function snakeCaseToCamel(str) {
		return str.replace(/-([a-z])/g, g => g[1].toUpperCase())
	}

	function pascalToCamel(str) {
		return str.charAt(0).toLowerCase() + str.slice(1)
	}

	function CamelToCamel(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

	function isElement(el) {
		return el instanceof Element || el instanceof HTMLDocument
	}

	function parseBoolean(value) {
		if (typeof value === "boolean") {
			return value
		}
		if (typeof value === "string") {
			value = value.toLowerCase();
			if (value === "true" || value === "yes" || value === "1") {
				return true
			}
			return false
		}
		return !!value
	}

	function createTag(tag, props = {}, html = null) {
		let parts_id = tag.split("#");
		let id = null;
		if (parts_id.length == 1) {
			tag = parts_id[0]
		} else {
			parts_id[1] = parts_id[1].split(".");
			id = parts_id[1][0];
			tag = [parts_id[0], ...parts_id[1].slice(1)].join(".")
		}
		let parts = tag.split(".");
		tag = parts[0];
		if (tag === "") {
			tag = "div"
		}
		if (typeof props === "string") {
			html = props;
			props = {}
		}
		if (html !== null) {
			props.innerHTML = html
		}
		if (id !== null) {
			props.id = id
		}
		props.className = [props.className, ...parts.slice(1)].filter(function (e) {
			return `${e}`.trim() !== ""
		}).join(" ");
		let el = document.createElement(tag);
		for (let prop in props) {
			if (el[prop] !== undefined) {
				el[prop] = props[prop]
			} else {
				el.setAttribute(prop, props[prop])
			}
		}
		return el
	}

	function appendToElement(el, ...args) {
		let filtered = args.filter(e => e !== null && e !== undefined);
		el.append(...filtered);
		return el
	}

	function searchForm(formName) {
		let formObject = null;
		if (formName !== null) {
			formObject = document.forms[formName];
			if (formObject === undefined) {
				formObject = document.querySelector(formName);
				if (formObject === null) {
					console.warn(`form ${formName} not found`)
				}
			}
		}
		if (formObject !== null) {
			if (formObject.tagName.toLowerCase() !== "form") {
				console.warn(`form ${formName} is not a form`)
			}
		}
		return formObject
	}

	function getValueWithJavascriptSupport(value, context = null) {
		if (typeof value === "function") {
			return value.bind(context)
		}
		if (typeof value === "string") {
			let internalValue = value.trim();
			if (internalValue.startsWith("javascript:")) {
				try {
					let f = internalValue.substring(11);
					value = function () {
						return eval(f)
					}.bind(context)
				} catch (e) {
					console.error(`Error executing javascript code ${internalValue.substring(11)}, error: ${e}`);
					value = null
				}
			}
		}
		return value
	}

	function promiseForEvent(el, event) {
		let resolveFunction = null;
		let promise = new Promise(resolve => {
			resolveFunction = resolve
		});
		let handler = function () {
			el.removeEventListener(event, handler);
			resolveFunction()
		};
		el.addEventListener(event, handler);
		return promise
	}

	function isEmpty(obj) {
		if (obj === null || obj === undefined) {
			return true
		}
		if (obj instanceof Array) {
			return obj.length === 0
		}
		if (obj instanceof Object) {
			return Object.keys(obj).length === 0
		}
		if (typeof obj === "string") {
			return obj.trim() === ""
		}
		return false
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
			this.onHidden = onHidden
		}
		dispose() {}
		show(onButton = null, onHidden = null) {
			if (onButton !== null) {
				this.onButton = onButton
			}
			if (onHidden !== null) {
				this.onHidden = onHidden
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
				throw `Unsupported button count ${this.buttonCount}`
			}
			if (this.onButton !== null) {
				this.onButton(this.result, {
					button: this.result,
					text: this.options.buttons[this.result]
				}, null)
			}
			if (this.onHidden !== null) {
				this.onHidden(this.result, {
					button: this.result,
					text: this.options.buttons[this.result]
				}, null)
			}
		}
	}
	class Dialog {
		static create(options = {}, onButton = null, onHidden = null) {
			if (exports.bootstrap === undefined || exports.bootstrap.Modal === undefined) {
				return new DialogLegacy(options, onButton, onHidden)
			}
			if (options.selector !== undefined && options.selector !== null || options.dialogFunction !== undefined && options.dialogFunction !== null) {
				throw new Error("not implemented, yet")
			}
			return new Dialog(options, onButton, onHidden)
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
			if (exports.bootstrap === undefined || exports.bootstrap.Modal === undefined) {
				throw new Error("Bootstrap is required to use this class")
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
					}
				} else {
					if (button.text === undefined) {
						button.text = `Button ${i}`
					}
				}
				if (button.class === undefined) {
					button.class = this.options.buttonClasses[Math.min(i, this.options.buttonClasses.length - 1)]
				}
				parsedButtons.push(button)
			}
			this.options.buttons = parsedButtons;
			this.dialog = null;
			this.modal = null;
			this.result = null;
			this.onButton = onButton;
			this.onHidden = onHidden;
			this._hiddenHandler = this._hiddenHandler.bind(this)
		}
		_hiddenHandler() {
			this.dialog.removeEventListener("hidden.bs.modal", this._hiddenHandler);
			if (this.onHidden !== null) {
				if (this.result !== null && this.result >= 0) {
					this.onHidden(this.result, {
						button: this.result,
						text: this.options.buttons[this.result]
					})
				} else {
					this.onHidden(this.result, null)
				}
			}
		}
		dispose() {
			if (this.modal !== null) {
				this.modal.dispose();
				this.modal = null
			}
			this.dialog.remove();
			this.dialog = null
		}
		show(onButton = null, onHidden = null) {
			if (this.dialog === null) {
				this.dialog = this._build_dialog(this.options)
			}
			if (this.modal === null) {
				this.modal = new bootstrap.Modal(this.dialog, {
					backdrop: this.options.escapeKeyCancels ? true : "static",
					keyboard: this.options.escapeKeyCancels
				})
			}
			this.dialog.addEventListener("hidden.bs.modal", this._hiddenHandler);
			this.result = null;
			if (onButton !== null) {
				this.onButton = onButton
			}
			if (onHidden !== null) {
				this.onHidden = onHidden
			}
			this.modal.show();
			return promiseForEvent(this.dialog, "shown.bs.modal")
		}
		hide() {
			this.modal.hide();
			return promiseForEvent(this.dialog, "hidden.bs.modal")
		}
		_handleButton(index, button, buttonObject) {
			this.result = index;
			let autoHide = true;
			if (this.onButton !== null) {
				autoHide = !(this.onButton(index, button, buttonObject) === false)
			}
			if (autoHide) {
				this.hide()
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
				closeButton.addEventListener("click", () => this._handleButton(-1, null, closeButton))
			}
			if (parseBoolean(options.header)) {
				header = createTag(".modal-header");
				if (options.title !== null) {
					header.append(appendToElement(createTag(".modal-title"), appendToElement(createTag("h5", options.title))))
				}
				if (parseBoolean(options.close)) {
					header.append(closeButton)
				}
			}
			let buttons = [];
			if (options.buttons !== null) {
				for (let i = 0; i < options.buttons.length; i++) {
					let button = options.buttons[i];
					let buttonClass = button.class.split(" ").map(e => e.trim()).filter(e => e !== "").join(".");
					if (options.footer === false) {
						buttonClass += ".mx-1"
					}
					if (buttonClass !== "") {
						buttonClass = "." + buttonClass
					}
					let buttonObject = createTag("button.btn" + buttonClass + ".button" + i, {
						type: "button"
					}, button.text);
					buttonObject.addEventListener("click", function () {
						this._handleButton(i, button, buttonObject);
						if (button.handler !== undefined && button.handler !== null) {
							button.handler(i, button, buttonObject)
						}
					}.bind(this));
					buttons.push(buttonObject)
				}
			}
			let footer = null;
			if (parseBoolean(options.footer)) {
				footer = appendToElement(createTag(".modal-footer"), ...buttons)
			}
			let body = null;
			if (parseBoolean(options.body)) {
				body = createTag(".modal-body");
				if (header === null) {
					if (parseBoolean(options.close)) {
						body.append(appendToElement(createTag(".text-end"), closeButton))
					}
				}
				if (options.message !== null) {
					body.append(createTag("p.message.text-center", options.message))
				}
				if (options.customContent !== null) {
					body.append(createTag(".custom-content.mx-auto", options.customContent))
				}
				if (footer === null) {
					let buttonPanelClasses = options.buttonPanelClasses.map(e => e.trim()).filter(e => e !== "").join(".");
					if (buttonPanelClasses !== "") {
						buttonPanelClasses = "." + buttonPanelClasses
					}
					appendToElement(body, appendToElement(createTag(".buttons" + buttonPanelClasses), ...buttons))
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
			return dialog
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
		return dialog
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
		return dialog
	}

	function loadingDialog(message, customContent = null, canCancel = null) {
		if (typeof customContent === "function") {
			canCancel = customContent;
			customContent = null
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
		return dialog
	}
	if (exports.powerButtons.utils === undefined) {
		exports.powerButtons.utils = {}
	}
	Object.assign(exports.powerButtons.utils, {
		confirmDialog: confirmDialog,
		alertDialog: alertDialog,
		loadingDialog: loadingDialog
	});
	class PowerButtons {
		static actionsRegistered = {};
		static registerAction(action) {
			this.actionsRegistered[action.NAME.toLowerCase()] = action;
			if (exports.powerButtons === undefined) {
				exports.powerButtons = {}
			}
			if (exports.powerButtons.defaults === undefined) {
				exports.powerButtons.defaults = {}
			}
			exports.powerButtons.defaults[action.NAME.toLowerCase()] = Object.assign({}, action.DEFAULTS)
		}
		static getActionSettings(action, options) {
			if (this.actionsRegistered[action.NAME.toLowerCase()] === undefined) {
				console.error(`The action ${action.NAME} is not registered`);
				return {}
			}
			let defaultsWindow = {};
			if (exports.powerButtons !== undefined && exports.powerButtons.defaults !== undefined && exports.powerButtons.defaults[action.NAME.toLowerCase()] !== undefined) {
				defaultsWindow = exports.powerButtons.defaults[action.NAME.toLowerCase()]
			}
			return Object.assign({}, action.DEFAULTS, defaultsWindow, options)
		}
		static addAction(el, options = {}) {
			let powerButton = PowerButtons.addActionSupport(el);
			powerButton.appendAction(options)
		}
		static addActionSupport(el) {
			if (el._powerButtons === undefined) {
				el._powerButtons = new PowerButtons(el)
			} else {
				el._powerButtons.reset()
			}
			return el._powerButtons
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
				el.onclick = null
			}
			el.addEventListener("click", this.handlerClick.bind(this))
		}
		appendAction(options = {}) {
			if (options.type === undefined) {
				throw "The type of the action is mandatory"
			}
			this.actions.push(options)
		}
		handlerClick(e) {
			if (this.current_action >= this.actions.length) {
				this.current_action = 0;
				if (typeof this.back_onclick === "function") {
					if (!this.back_onclick()) {
						e.preventDefault()
					}
				}
				return
			}
			let currentActionSettings = this.actions[this.current_action];
			e.preventDefault();
			e.stopImmediatePropagation();
			let onNextAction = function () {
				this.current_action++;
				if (this.current_action >= this.actions.length) {
					if (this.el.click !== undefined) {
						this.el.click()
					} else {
						this.el.dispatchEvent(new Event(e.type, e))
					}
				} else {
					this.el.dispatchEvent(new Event(e.type, e))
				}
			}.bind(this);
			let action = this.constructor.actionsRegistered[currentActionSettings.type];
			if (action === undefined) {
				throw `The action ${currentActionSettings.type} is not registered`
			}
			action.execute(this.el, currentActionSettings, onNextAction, () => this.reset())
		}
		reset() {
			this.current_action = 0
		}
		static discoverAll() {
			Object.entries(this.actionsRegistered).forEach(([key, action]) => {
				action.discoverAll()
			})
		}
		static discover(els, options = {}) {
			Object.entries(this.actionsRegistered).forEach(([key, action]) => {
				action.discover(els, options)
			})
		}
	}
	class Action {
		static NAME = null;
		static register() {
			PowerButtons.registerAction(this)
		}
		static DEFAULTS = {};
		static extractOptions(el, prefix = null, map = null) {
			if (prefix === null) {
				prefix = this.NAME.toLowerCase()
			}
			if (map === null) {
				map = {};
				map[prefix] = prefix
			}
			let options = {};
			for (let key in this.DEFAULTS) {
				let targetKey = key;
				if (map[targetKey] !== undefined) {
					targetKey = map[targetKey]
				} else {
					targetKey = prefix + CamelToCamel(targetKey)
				}
				if (el.dataset[targetKey] !== undefined) {
					options[key] = el.dataset[targetKey]
				}
			}
			return options
		}
		static initialize(el, values = {}) {
			PowerButtons.addAction(el, Object.assign({
				type: this.NAME.toLowerCase()
			}, values))
		}
		static discoverAll() {
			let prefix = this.NAME.toLowerCase();
			this.discover(document.querySelectorAll(`[data-${prefix}]`))
		}
		static discover(els, options = {}, skipInitialized = true) {
			if (els.length === undefined) {
				els = [els]
			}
			let prefix = this.NAME.toLowerCase();
			for (let el of els) {
				if (skipInitialized && el._powerButtons !== undefined && el._powerButtons._discover !== undefined && el._powerButtons._discover.indexOf(prefix) !== -1) {
					continue
				}
				if (el.dataset[prefix] === undefined) {
					continue
				}
				let currentOptions = Object.assign(this.extractOptions(el, prefix), options);
				this.initialize(el, currentOptions);
				if (el._powerButtons !== undefined) {
					if (el._powerButtons._discover === undefined) {
						el._powerButtons._discover = []
					}
					if (!el._powerButtons._discover.includes(prefix)) {
						el._powerButtons._discover.push(prefix)
					}
				}
			}
		}
		static execute(el, options, onNextAction, onCancelActions) {
			throw new Error("The execute method must be implemented by the derived class")
		}
	}
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
		static execute(el, options, onNextAction, onCancelActions) {
			let settings = PowerButtons.getActionSettings(this, options);
			let result = null;
			let bindObject = searchForm(settings.form);
			if (bindObject === null) {
				bindObject = document
			}
			try {
				if (typeof settings.verify === "function") {
					result = settings.verify.bind(bindObject)()
				} else if (typeof settings.verify === "string") {
					result = function () {
						return eval(settings.verify)
					}.bind(bindObject)()
				} else {
					result = parseBoolean(settings.verify)
				}
			} catch (e) {
				console.error("Error executing verification function", e);
				result = false
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
							onVerificationSuccess()
						}
					})
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
							onVerificationFailure()
						}
					})
				}
			}
			if (dialog !== null) {
				dialog.show()
			} else {
				if (result) {
					if (onVerificationSuccess !== null) {
						onVerificationSuccess()
					}
				} else {
					if (onVerificationFailure !== null) {
						onVerificationFailure()
					}
				}
			}
		}
	}
	ActionVerify.register();
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
		static extractOptions(el, prefix = null, map = null) {
			let options = super.extractOptions(el, prefix, map);
			if (options.confirm.trim() == "") {
				delete options.confirm
			}
			return options
		}
		static execute(el, options, onNextAction, onCancelActions) {
			let settings = PowerButtons.getActionSettings(this, options);
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
						onNextAction()
					}
				} else {
					if (onCancelActions !== null) {
						onCancelActions()
					}
				}
			});
			dialog.show()
		}
	}
	ActionConfirm.register();
	class ActionAsyncTask extends Action {
		static NAME = "AsyncTask";
		static DEFAULTS = {
			task: null,
			message: "Please wait...",
			customContent: null,
			title: null,
			buttonCancel: "Cancel",
			cancel: null,
			header: true,
			footer: true
		};
		static extractOptions(el, prefix = null, map = null) {
			return super.extractOptions(el, prefix, {
				task: "asynctask"
			})
		}
		static execute(el, options, onNextAction, onCancelActions) {
			let settings = PowerButtons.getActionSettings(this, options);
			if (settings.task === null) {
				console.error("The task to execute cannot be null");
				return
			}
			let task = null;
			if (typeof settings.task === "string") {
				task = async function () {
					return await eval(settings.task)
				}
			} else if (typeof settings.task === "function") {
				task = settings.task
			} else {
				console.error("The task to execute must be either a string or a function");
				return
			}
			let buttons = [];
			let cancelHandler = null;
			if (settings.cancel !== null) {
				buttons = [settings.buttonCancel];
				if (typeof settings.cancel === "string") {
					cancelHandler = function () {
						eval(settings.cancel)
					}
				} else if (typeof settings.cancel === "function") {
					cancelHandler = settings.cancel
				} else {
					console.error("The cancel handler must be either a string or a function")
				}
			}
			let dialog = Dialog.create({
				title: settings.title,
				message: settings.message,
				customContent: settings.customContent,
				buttons: buttons,
				escapeKeyCancels: false,
				close: false,
				header: options.header !== undefined ? settings.header : settings.title !== null && settings.title != "",
				footer: options.footer !== undefined ? settings.footer : cancelHandler !== null
			}, function () {
				cancelHandler();
				onCancelActions()
			}, function (result) {
				if (onNextAction !== null) {
					onNextAction()
				}
			});
			dialog.show().then(function () {
				task().finally(function () {
					dialog.hide()
				})
			})
		}
	}
	ActionAsyncTask.register();
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
		static execute(el, options, onNextAction, onCancelActions) {
			let settings = PowerButtons.getActionSettings(this, options);
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
					onNextAction()
				}
			});
			dialog.show()
		}
	}
	ActionShowMessage.register();
	class ActionFormset extends Action {
		static NAME = "Formset";
		static DEFAULTS = {
			form: null,
			fields: {}
		};
		static extractOptions(el, prefix = null, map = null) {
			let options = super.extractOptions(el, prefix, {
				form: "formset"
			});
			let fields = {};
			for (let key in el.dataset) {
				if (key.startsWith(prefix)) {
					let fieldname = key.substring(prefix.length);
					if (fieldname === "") {
						continue
					}
					if (fieldname[0] !== fieldname[0].toUpperCase()) {
						continue
					}
					fieldname = fieldname.toLocaleLowerCase();
					fields[fieldname] = el.dataset[key]
				}
			}
			if (options.fields === undefined) {
				options.fields = {}
			}
			Object.assign(options.fields, fields);
			return options
		}
		static execute(el, options, onNextAction, onCancelActions) {
			let settings = PowerButtons.getActionSettings(this, options);
			let formToSet = null;
			let inputFields = [];
			let elements = [];
			if (settings.form == "") {
				if (el.form !== null) {
					formToSet = el.form
				} else {
					elements = Array.from(document.querySelectorAll("input")).filter(input => input.form === null)
				}
			} else {
				formToSet = searchForm(settings.form);
				if (formToSet === null) {
					console.error(`Form not found ${settings.form}`);
					return
				}
			}
			if (formToSet !== null) {
				elements = Array.from(formToSet.elements)
			}
			elements.forEach(element => {
				if (element.name !== "") {
					inputFields[element.name.toLocaleLowerCase()] = element
				}
				if (element.id !== "") {
					inputFields[element.id.toLocaleLowerCase()] = element
				}
			});
			for (let field in settings.fields) {
				if (inputFields[field] !== undefined) {
					let value = settings.fields[field];
					let result = getValueWithJavascriptSupport(value, formToSet !== null ? formToSet : inputFields);
					if (typeof result === "function") {
						try {
							result = result()
						} catch (e) {
							console.error(`Error executing ${value}`, e);
							continue
						}
					}
					inputFields[field].value = result
				}
			}
			onNextAction()
		}
	}
	ActionFormset.register();
	class ActionFormButton extends Action {
		static NAME = "FormButton";
		static DEFAULTS = {
			formbutton: null,
			method: "post",
			formClass: "formbutton",
			convertCase: "none",
			formId: null,
			fields: {}
		};
		static extractOptions(el, prefix = null, map = null) {
			let options = super.extractOptions(el, prefix, map);
			let fields = {};
			prefix = prefix + "Field";
			for (let key in el.dataset) {
				if (key.startsWith(prefix)) {
					let fieldname = key.substring(prefix.length);
					if (fieldname === "") {
						continue
					}
					if (fieldname[0] !== fieldname[0].toUpperCase()) {
						continue
					}
					switch (options.convertCase) {
					case "kebab":
						fieldname = pascalToKebab(fieldname);
						break;
					case "snake":
						fieldname = pascalToSnake(fieldname);
						break;
					case "camel":
						fieldname = pascalToCamel(fieldname);
						break;
					case "pascal":
						break
					}
					fields[fieldname] = el.dataset[key]
				}
			}
			if (options.fields === undefined) {
				options.fields = {}
			}
			Object.assign(options.fields, fields);
			return options
		}
		static initialize(el, values = {}) {
			let settings = PowerButtons.getActionSettings(this, values);
			let form = document.createElement("form");
			form.method = settings.method;
			if (!isEmpty(settings.formbutton)) {
				form.action = settings.formbutton
			}
			if (settings.formId !== null) {
				form.id = settings.formId
			}
			let cssClasses = settings.formClass.split(" ");
			for (var i = 0; i < cssClasses.length; i++) {
				if (!isEmpty(cssClasses[i])) {
					form.classList.add(cssClasses[i])
				}
			}
			el.type = "submit";
			let fields = {};
			for (let fieldName in settings.fields) {
				fields[fieldName] = getValueWithJavascriptSupport(settings.fields[fieldName], form)
			}
			let pendingFields = {};
			for (let fieldName in fields) {
				let input = document.createElement("input");
				input.type = "hidden";
				input.name = fieldName;
				if (typeof fields[fieldName] === "function") {
					input.value = "";
					pendingFields[fieldName] = fields[fieldName]
				} else {
					input.value = fields[fieldName]
				}
				form.appendChild(input)
			}
			el.parentNode.replaceChild(form, el);
			form.appendChild(el);
			if (Object.keys(pendingFields).length > 0) {
				settings.fields = pendingFields;
				settings._formObject = form;
				super.initialize(el, settings)
			}
		}
		static execute(el, options, onNextAction, onCancelActions) {
			let settings = PowerButtons.getActionSettings(this, options);
			let error = false;
			for (let fieldName in settings.fields) {
				try {
					let value = settings.fields[fieldName]();
					settings._formObject[fieldName].value = value
				} catch (e) {
					console.error(`Error obtaining value for field ${fieldName}: ${e}`);
					error = true
				}
			}
			if (error) {
				onCancelActions()
			} else {
				onNextAction()
			}
		}
	}
	ActionFormButton.register()
})(window);
