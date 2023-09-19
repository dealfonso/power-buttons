/* Copyright 2021 Carlos A. (https://github.com/dealfonso); License: http://www.apache.org/licenses/LICENSE-2.0 */
!function(window,document){function pascalToSnake(t){t.replace(/[A-Z]/g,t=>"_"+t.toLowerCase()).replace(/^_*/,"")}function pascalToKebab(t){t.replace(/[A-Z]/g,t=>"-"+t.toLowerCase()).replace(/^-*/,"")}function snakeCaseToCamel(t){t.replace(/-([a-z])/g,t=>t[1].toUpperCase())}function pascalToCamel(t){t.charAt(0).toLowerCase(),t.slice(1)}function CamelToCamel(t){return t.charAt(0).toUpperCase()+t.slice(1)}function isElement(t){t instanceof Element||0 instanceof HTMLDocument}function flattenobjects(t,...e){var n,o={};for(n in t){o[n]=t[n];for(let t=0;t<e.length;t++)void 0!==e[t][n]&&(o[n]=e[t][n])}return o}function mergeobjectsr(...n){if(0===n.length)return{};if(1===n.length)return n[0];{var o,i={};let t=n[0],e=(void 0===t&&(t={}),n[1]);if(void 0===e&&(e={}),void 0!==t)for(var s in t)void 0!==e[s]?"object"==typeof t[s]&&"object"==typeof e[s]?i[s]=mergeobjectsr(t[s],e[s]):i[s]=e[s]:i[s]=t[s];for(o in e)void 0!==t&&void 0===t[o]&&(i[o]=e[o]);return 2===n.length?i:mergeobjectsr(i,...n.slice(2))}}function extractValues(t,e,n="",o={},i=!1){var s,l={};for(s in t){var a=s;void 0!==e[a=void 0!==o[a]?o[a]:n+CamelToCamel(a)]?l[s]=e[a]:i&&(l[s]=t[s])}return l}function parseBoolean(t){return"boolean"==typeof t?t:"string"==typeof t?"true"===(t=t.toLowerCase())||"yes"===t||"1"===t:!!t}function createTag(t,e={},n=null){var o=t.split("#");let i=null;var s,o=(t=1==o.length?o[0]:(o[1]=o[1].split("."),i=o[1][0],[o[0],...o[1].slice(1)].join("."))).split("."),l=(""===(t=o[0])&&(t="div"),"string"==typeof e&&(n=e,e={}),null!==n&&(e.innerHTML=n),null!==i&&(e.id=i),e.className=[e.className,...o.slice(1)].filter(function(t){return""!==(""+t).trim()}).join(" "),document.createElement(t));for(s in e)void 0!==l[s]?l[s]=e[s]:l.setAttribute(s,e[s]);return l}function appendToElement(t,...e){e=e.filter(t=>null!=t);return t.append(...e),t}function searchForm(t){let e=null;return null!==t&&void 0===(e=document.forms[t])&&null===(e=document.querySelector(settings.form))&&console.warn(`form ${t} not found`),null!==e&&"form"!==e.tagName.toLowerCase()&&console.warn(`form ${t} is not a form`),e}function getValueWithJavascriptSupport(value,context=null){let internalValue=value.trim();if(internalValue.startsWith("javascript:"))try{let f=internalValue.substring(11);value=function(){return eval(f)}.bind(context)()}catch(e){console.error(`Error executing javascript code ${internalValue.substring(11)}, error: `+e),value=null}return value}window.powerButtons={version:"0.1.0"};class DialogLegacy{DEFAULTS={message:"Main message",buttonCount:2};constructor(t={},e=null,n=null){this.options={...this.DEFAULTS,...t},this.buttonCount=this.options.buttons.length,this.options.buttons=["Accept","Cancel"],this.result=null,this.onButton=e,this.onHidden=n}dispose(){}show(t=null,e=null){switch(null!==t&&(this.onButton=t),null!==e&&(this.onHidden=e),this.buttonCount){case 0:case 1:alert(this.message),this.result=0;break;case 2:this.result=confirm(this.options.message)?0:1;break;default:throw"Unsupported button count "+this.buttonCount}null!==this.onButton&&this.onButton(this.result,{button:this.result,text:this.options.buttons[this.result]},null),null!==this.onHidden&&this.onHidden(this.result,{button:this.result,text:this.options.buttons[this.result]},null)}}class Dialog{static create(t={},e=null,n=null){if(void 0===window.bootstrap||void 0===window.bootstrap.Modal)return new DialogLegacy(t,e,n);if(void 0!==t.selector&&null!==t.selector||void 0!==t.dialogFunction&&null!==t.dialogFunction)throw new Error("not implemented, yet");return new Dialog(t,e,n)}DEFAULTS={title:"Title",message:"Main message",customContent:null,buttons:["Accept"],buttonClasses:["btn-primary","btn-secondary"],buttonPanelClasses:["text-end"],escapeKeyCancels:!0,header:!0,footer:!0,body:!0,close:!0};dialog=null;options=null;modal=null;onButton=null;result=null;onHidden=null;onButton=null;constructor(t={},e=null,n=null){if(void 0===window.bootstrap||void 0===window.bootstrap.Modal)throw new Error("Bootstrap is required to use this class");this.options={...this.DEFAULTS,...t};var o=[];for(let e=0;e<this.options.buttons.length;e++){let t=this.options.buttons[e];"string"==typeof t?t={text:t}:void 0===t.text&&(t.text="Button "+e),void 0===t.class&&(t.class=this.options.buttonClasses[Math.min(e,this.options.buttonClasses.length-1)]),o.push(t)}this.options.buttons=o,this.dialog=null,this.modal=null,this.result=null,this.onButton=e,this.onHidden=n,this._hiddenHandler=this._hiddenHandler.bind(this)}_hiddenHandler(){this.dialog.removeEventListener("hidden.bs.modal",this._hiddenHandler),null!==this.onHidden&&(null!==this.result&&0<=this.result?this.onHidden(this.result,{button:this.result,text:this.options.buttons[this.result]}):this.onHidden(this.result,null))}dispose(){null!==this.modal&&(this.modal.dispose(),this.modal=null),this.dialog.remove(),this.dialog=null}show(t=null,e=null){null===this.dialog&&(this.dialog=this._build_dialog(this.options)),null===this.modal&&(this.modal=new bootstrap.Modal(this.dialog,{backdrop:!!this.options.escapeKeyCancels||"static",keyboard:this.options.escapeKeyCancels})),this.dialog.addEventListener("hidden.bs.modal",this._hiddenHandler),(this.result=null)!==t&&(this.onButton=t),null!==e&&(this.onHidden=e),this.modal.show()}hide(){this.modal.hide()}_handleButton(t,e,n){this.result=t,null!==this.onButton&&!1===this.onButton(t,e,n)||this.hide()}_build_dialog(i={}){let t=null,e=null;parseBoolean(i.close)&&(e=createTag("button.close.btn-close",{type:"button","aria-label":"Close"})).addEventListener("click",()=>this._handleButton(-1,null,e)),parseBoolean(i.header)&&(t=createTag(".modal-header"),null!==i.title&&t.append(appendToElement(createTag(".modal-title"),appendToElement(createTag("h5",i.title)))),parseBoolean(i.close))&&t.append(e);var s=[];if(null!==i.buttons)for(let o=0;o<i.buttons.length;o++){let t=i.buttons[o],e=t.class.split(" ").map(t=>t.trim()).filter(t=>""!==t).join("."),n=(!1===i.footer&&(e+=".mx-1"),createTag("button.btn"+(e=""!==e?"."+e:e)+".button"+o,{type:"button"},t.text));n.addEventListener("click",function(){this._handleButton(o,t,n),void 0!==t.handler&&null!==t.handler&&t.handler(o,t,n)}.bind(this)),s.push(n)}let n=null,o=(parseBoolean(i.footer)&&(n=appendToElement(createTag(".modal-footer"),...s)),null);if(parseBoolean(i.body)&&(o=createTag(".modal-body"),null===t&&parseBoolean(i.close)&&o.append(appendToElement(createTag(".text-end"),e)),null!==i.message&&o.append(createTag("p.message.text-center",i.message)),null!==i.customContent&&o.append(createTag(".custom-content.mx-auto",i.customContent)),null===n)){let t=i.buttonPanelClasses.map(t=>t.trim()).filter(t=>""!==t).join(".");""!==t&&(t="."+t),appendToElement(o,appendToElement(createTag(".buttons"+t),...s))}return appendToElement(createTag(".modal.fade",{tabindex:"-1",role:"dialog","aria-hidden":"true","data-keyboard":"false"}),appendToElement(createTag(".modal-dialog.modal-dialog-centered",{role:"document"}),appendToElement(createTag(".modal-content"),t,o,n)))}}function confirmDialog(t,e="this action needs confirmation",n=null,o=null,i=!0){e=new Dialog({title:e,message:t,buttons:[{text:"Cancel",class:"btn-secondary",handler:o},{text:"Confirm",class:"btn-primary",handler:n}],escapeKeyCancels:i});return e.show(),e}function alertDialog(t,e="Alert",n=null){e=new Dialog({title:e,message:t,buttons:[{text:"Accept",class:"btn-primary",handler:n}],escapeKeyCancels:!0});return e.show(),e}function loadingDialog(t,e=null,n=null){"function"==typeof e&&(n=e,e=null);t=new Dialog({title:null,message:t,buttons:[{text:"Cancel",class:"btn-primary"}],customContent:e,escapeKeyCancels:!1,close:!1,header:!1,footer:!1},n);return t.show(),t}window.powerButtons=mergeobjectsr(window.powerButtons,{utils:{confirmDialog:confirmDialog,alertDialog:alertDialog,loadingDialog:loadingDialog}});class PowerButtons{static actionsRegistered={};static registerAction(t){console.debug("Registering action "+t.NAME);var e={};e["defaults"+(this.actionsRegistered[t.NAME]=t).NAME]=t.DEFAULTS,window.powerButtons=mergeobjectsr(window.powerButtons,{config:e})}static addAction(t,e={}){PowerButtons.addActionSupport(t).appendAction(e)}static addActionSupport(t){return void 0===t._powerButtons?t._powerButtons=new PowerButtons(t):t._powerButtons.reset(),t._powerButtons}el=null;current_action=0;actions=[];back_onclick=null;constructor(t){(t._powerButtons=this).el=t,this.current_action=0,this.actions=[],this.back_onclick=null,void 0!==t.onclick&&null!==t.onclick&&(this.back_onclick=t.onclick,t.onclick=null),t.addEventListener("click",this.handlerClick.bind(this))}appendAction(t={}){if(void 0===t.type)throw"The type of the action is mandatory";this.actions.push(t)}handlerClick(t){if(this.current_action>=this.actions.length)this.current_action=0,"function"!=typeof this.back_onclick||this.back_onclick()||t.preventDefault();else{var e=this.actions[this.current_action],n=(t.preventDefault(),t.stopImmediatePropagation(),function(){this.current_action++,this.current_action>=this.actions.length&&void 0!==this.el.click?this.el.click():this.el.dispatchEvent(new Event(t.type,t))}.bind(this)),o=this.constructor.actionsRegistered[e.type];if(void 0===o)throw`The action ${e.type} is not registered`;o.execute(e,n,()=>this.reset())}}reset(){this.current_action=0}static initializeAll(){Object.entries(this.actionsRegistered).forEach(([,t])=>{t.initializeAll()})}}function init(t){PowerButtons.initializeAll()}void 0!==document.addEventListener&&document.addEventListener("DOMContentLoaded",function(t){init(document)});class Action{static NAME=null;static register(t){PowerButtons.registerAction(this)}static DEFAULTS={};static extractOptions(t,e=null,n=null){return null===e&&(e=this.NAME.toLowerCase()),null===n&&((n={})[e]=e),extractValues(this.DEFAULTS,t.dataset,e,n)}static initialize(t,e={},n=null,o=null){n=this.extractOptions(t,n,o);n.type=this.NAME,PowerButtons.addAction(t,Object.assign({},n,extractValues(this.DEFAULTS,e)))}static initializeAll(t={},e=null,n=null){null===e&&(e=this.NAME.toLowerCase());for(var o of document.querySelectorAll("[data-"+e))this.initialize(o,t,e,n)}static execute(t,e,n){throw new Error("The execute method must be implemented by the derived class")}}class ActionConfirm extends Action{static NAME="Confirm";static DEFAULTS={confirm:"Please confirm this action",customContent:null,title:"The action requires confirmation",buttonConfirm:"Confirm",buttonCancel:"Cancel",buttonClose:!0,escapeKey:!0};static execute(t,e,n){t=flattenobjects(this.DEFAULTS,window.powerButtons.config.defaultsConfirm,t);Dialog.create({title:t.title,message:t.confirm,customContent:t.customContent,buttons:[t.buttonConfirm,t.buttonCancel],escapeKeyCancels:t.escapeKey,close:t.buttonClose},null,function(t){0===t?null!==e&&e():null!==n&&n()}).show()}}ActionConfirm.register();class ActionFormset extends Action{static NAME="Formset";static DEFAULTS={form:null,fields:{}};static extractOptions(e,n=null,t){null===n&&(n=this.NAME.toLowerCase());var o,i=super.extractOptions(e,n,{form:"formset"}),s={};for(o in e.dataset)if(o.startsWith(n)){let t=o.substring(n.length);""!==t&&t[0]===t[0].toUpperCase()&&(s[t=t.toLocaleLowerCase()]=e.dataset[o])}return i.fields=mergeobjectsr(i.fields,s),i}static execute(t,e,n){var o=flattenobjects(this.DEFAULTS,window.powerButtons.config.defaultsFormset,t),i=searchForm(o.form);if(null===i)console.error("Form not found "+o.form);else{for(var s,l,a={},r=0;r<i.elements.length;r++){var c=i.elements[r];""!==c.name&&(a[c.name.toLocaleLowerCase()]=c.name),""!==c.id&&(a[c.id.toLocaleLowerCase()]=c.id)}for(s in o.fields)void 0!==a[s]&&(l=o.fields[s],i[a[s]].value=getValueWithJavascriptSupport(l,i));e()}}}ActionFormset.register();class ActionShowMessage extends Action{static NAME="ShowMessage";static DEFAULTS={showmessage:"This is a message",customContent:null,title:null,buttonAccept:"Accept",escapeKey:!0,buttonClose:!0,header:!0,footer:!0};static execute(t,e,n){var o=flattenobjects(this.DEFAULTS,window.powerButtons.config.defaultsShowMessage,t);Dialog.create({title:o.title,message:o.showmessage,customContent:o.customContent,buttons:[o.buttonAccept],escapeKeyCancels:o.escapeKey,close:o.buttonClose,header:void 0!==t.header?o.header:null!==o.title&&""!=o.title,footer:void 0!==t.footer?o.footer:null!==o.buttonAccept&&""!=o.buttonAccept},null,function(t){null!==e&&e()}).show()}}ActionShowMessage.register();class ActionVerify extends Action{static NAME="Verify";static DEFAULTS={verify:null,form:null,verified:null,notVerified:"The condition for this action is not met",customContentVerified:null,customContentNotVerified:null,titleNotVerified:"The action requires verification",titleVerified:null,buttonAccept:"Accept",buttonClose:!1,escapeKey:!0,header:!0,footer:!0};static execute(options,onNextAction,onCancelActions){let settings=flattenobjects(this.DEFAULTS,window.powerButtons.config.defaultsVerify,options),result=null,bindObject=searchForm(settings.form);null===bindObject&&(bindObject=document);try{result="function"==typeof settings.verify?settings.verify.bind(bindObject)():"string"==typeof settings.verify?function(){return eval(settings.verify)}.bind(bindObject)():parseBoolean(settings.verify)}catch(e){console.error("Error executing verification function",e),result=!1}let dialog=null,onVerificationSuccess=onNextAction,onVerificationFailure=onCancelActions;result?null===settings.verified&&null===settings.customContentVerified&&null===settings.titleVerified||(dialog=Dialog.create({title:settings.titleVerified,message:settings.verified,customContent:settings.customContentVerified,buttons:[settings.buttonAccept],escapeKeyCancels:settings.escapeKey,close:settings.buttonClose},null,function(t){null!==onVerificationSuccess&&onVerificationSuccess()})):null===settings.notVerified&&null===settings.customContentNotVerified&&null===settings.titleNotVerified||(dialog=Dialog.create({title:settings.titleNotVerified,message:settings.notVerified,customContent:settings.customContentNotVerified,buttons:[settings.buttonAccept],escapeKeyCancels:settings.escapeKey,close:settings.buttonClose},null,function(t){null!==onVerificationFailure&&onVerificationFailure()})),null!==dialog?dialog.show():result?null!==onVerificationSuccess&&onVerificationSuccess():null!==onVerificationFailure&&onVerificationFailure()}}ActionVerify.register()}(window,document);
