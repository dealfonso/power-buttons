/**

Copyright 2021 Carlos de Alfonso (https://github.com/dealfonso)


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

/**
 * 
 * This file enables to create buttons that show a confirmation modal prior to executing the function that they should execute
 *  The basic syntax is
 *      <button confirm="Are you sure?">Execute</button>
 * 
 *  The button will show a modal using bootstrap's $(...).modal() function prior to executing the function that the button should 
 *  execute. Any listener in the button will be executed only if the modal is confirmed.
 * 
 *  The full list of options is:
 *      confirm: The message to show in the modal
 *      data-texttarget: The selector to use to put the confirm message in the modal. Default: "p.confirm-text"
 *      data-confirmbtn: The selector to use to get the confirm button (this is needed to work properly; if not found the confirmation
 *          cannot be detected). Default: "button.confirm"
 *      data-cancelbtn: The selector to use to get the cancel button (this is not needed if the modal can be cancelled using other means
 *          like esc-key). Default: "button.cancel"
 *      data-dialog: The selector to use to get the dialog. If not provided or not found, a default dialog will be created to confirm
 *          and destroyed once the modal is closed.
 *      data-canceltxt: The text to show in the cancel button. It is only valid if data-dialog is not used. Default: "Cancel". 
 *      data-confirmtxt: The text to show in the confirm button. It is only valid if data-dialog is not used. Default: "Confirm". 
 */

// This is a "on" replacement to prepend an event to any other of its type
$.fn.prependon = function(evtype, fnc) {
    $(this).each(function() {
        let $this = $(this);
        $this.on(evtype, fnc);
        let events = $._data(this, 'events');
        if (events && events[evtype]) {
            events[evtype].unshift(events[evtype].pop());
        }
    })
}

$.fn.confirmButton = function(options = {}) {
    // Function that creates a simple modal dialog that contains some placeholders to include custom messages
    function createDialog() {
        let $dialog = $('<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">');
        $dialog.append(
            $('<div class="modal-dialog modal-sm modal-dialog-centered" role="document">').append(
                $('<div class="modal-content">').append(
                    $('<div class="modal-body text-center">')
                    .append($('<p class="confirm-text">'))
                ).append(
                    $('<div class="modal-footer">').append(
                        $('<button type="button" class="btn btn-secondary confirm" data-dismiss="modal">').html('Confirm'),
                        $('<button type="button" class="btn btn-secondary cancel" data-dismiss="modal">').html('Cancel')
                    )
                )
            )
        );
        return $dialog;
    }

    this.each(function() {
        if (this._back_onclick === undefined) {
            this._back_onclick = null;
        } else {
            // At this point we are not allowing confirmation chaining
            console.error("ConfirmButton: The element already has a confirmation dialog");
            return;
        }

        // First we'll remove the onclick method, if exists
        if ((this.onclick !== undefined) && (this.onclick !== null)) {
            this._back_onclick = this.onclick;
            this.onclick = null;
        }

        // Now we'll prepend the click event to the element
        $(this).prependon('click', function(e, from = null) {
            let self = $(this);

            if (((this._cjqu_click_payload !== undefined) && (this._cjqu_click_payload !== null)) || (from !== null)) {
                // Clear the payload for next calls
                this._cjqu_click_payload = null;
    
                // If there was a previous onclick event, we'll execute it
                if (typeof(this._back_onclick) === 'function') {
                    this._back_onclick();
                }
            } else {
            // if ((this._cjqu_click_payload === undefined) || (this._cjqu_click_payload === null)) {
                e.preventDefault();

                // Prevent from executing the other handlers
                e.stopImmediatePropagation();

                // Although the options are for any element, each element found can have its own options
                let defaults = {
                    confirm: null,
                    texttarget: 'p.confirm-text',
                    confirmbtn: 'button.confirm',
                    cancelbtn: 'button.cancel',
                    dialog: null,
                    canceltxt: null,
                    confirmtxt: null
                };
                let settings = $.extend({}, defaults, options);
    
                // The user can provide a dialogo selector to show, via data-dialog attribute. If it is not found, or it is 
                //  not provided, we'll create a new one.
                let dialog;
                if (options.dialog !== undefined) {
                    dialog = options.dialog;
                } else {
                    dialog = self.data('dialog');
                    if (dialog === undefined)
                        dialog = settings.dialog;
                }
                
                let dialog_created = false;
                let $dialog = $(dialog);
                if ($dialog.length === 0) {
                    $dialog = createDialog();
                    dialog_created = true;
                }
    
                // If the dialog was created by this function, we know which are the confirm and cancel buttons.
                //   Otherwise, we assume that the dialog was created by the user and he can use the same constructions 
                //   (i.e. button.confirm and button.cancel) or provide the selectors via data-cancelbtn and data-confirmbtn
                //   attributes.
                if (dialog_created) {
                    settings.confirmbtn = 'button.confirm';
                    settings.cancelbtn = 'button.cancel';
                } else {
                    if (options.cancelbtn === undefined) {
                        let cancelbtn = self.data('cancelbtn');
                        if (cancelbtn !== undefined) {
                            settings.cancelbtn = cancelbtn;
                        }
                    }
                    if (options.confirmbtn === undefined) {
                        let confirmbtn = self.data('confirmbtn');
                        if (confirmbtn !== undefined) {
                            settings.confirmbtn = confirmbtn;
                        }
                    }
                }
    
                // Find the confirmation and cancellation buttons
                let $confirmbtn = $dialog.find(settings.confirmbtn);
                let $cancelbtn = $dialog.find(settings.cancelbtn);
    
                // If we created the dialog, we'll enable to change the confirmation and cancellation texts in buttons, via data-canceltxt and data-confirmtxt attributes
                if (options.canceltxt === undefined) {
                    let canceltxt = self.data('canceltxt');
                    if (canceltxt !== undefined) {
                        settings.canceltxt = canceltxt;    
                    }
                }
                if (settings.canceltxt !== null) {
                    $cancelbtn.html(settings.canceltxt);
                }

                if (options.confirmtxt === undefined) {
                    let confirmtxt = self.data('confirmtxt');
                    if (confirmtxt !== undefined) {
                        settings.confirmtxt = confirmtxt;
                    }
                }
                if (settings.confirmtxt !== null) {
                    $confirmbtn.html(settings.confirmtxt);
                }
    
                // We'll get the text from the button that was clicked, and we'll use it to set the text of the confirmation button, via confirm attribute
                if (options.confirm === undefined) {
                    let text = self.attr("confirm");
                    if (text !== undefined) {
                        settings.confirm = text;
                    }    
                }
                if ((settings.confirm !== undefined) && (settings.confirm !== null)) {
                    if (options.texttarget === undefined) {
                        let text_target = self.data("texttarget");
                        if (text_target !== undefined) {
                            settings.texttarget = text_target
                        }
                    }
                    $dialog.find(settings.texttarget).text(settings.confirm);
                }
    
                // If the dialog was created by this function, we'll add it to the body to be able to use it (we'll dispose it later)
                if (dialog_created) {
                    $dialog.appendTo('body');
                }
    
                // Now we create a promise that will be resolved when the dialog is closed or any of the buttons is clicked
                let p = new Promise(function(resolve, reject){
                    let confirmed = false;
    
                    // Handlers for the events (although easy they are separated because we want to be able to remove the handlers)
                    function dialog_hidden(e) {
                        if (confirmed) {
                            resolve();
                        } else {
                            reject();
                        }

                        // Remove the handlers, just in case that the dialog is provided by the user
                        $confirmbtn.off('click', confirm_fnc);
                        $cancelbtn.off('click', cancel_fnc);
                        $dialog.off('hidden.bs.modal', dialog_hidden);

                        // If the dialog was created by this function, we'll dispose it
                        if (dialog_created) {
                            $dialog.remove();
                        } 
                    }
                    function confirm_fnc(e){
                        confirmed = true;
                        $dialog.modal('hide');
                    }
                    function cancel_fnc(e) {
                        $dialog.modal('hide');
                    }

                    // We'll resolver or reject the promise after the dialog is closed, so that it offers a better user experience
                    $dialog.on('hidden.bs.modal', dialog_hidden);
    
                    // If the user clicks on either confirm or cancel button, the dialog is closed to proceed with the promise
                    $confirmbtn.on('click', confirm_fnc);
                    $cancelbtn.on('click', cancel_fnc);

                    // Now show the dialog
                    $dialog.modal('show');

                }).then(function() {
                    // Continue with the action, by simulating the common click action (if it is a clickable element, let's use the 
                    //  native click event, otherwise, we'll use the submit event)
                    if (self[0].click !== undefined) {
                        self[0]._cjqu_click_payload = 'from_modal';
                        self[0].click();
                    } else {
                        self.trigger('click', ['from_modal']);
                    }
                }).catch(function() {
                    // User clicked cancel (handled to avoid errors in the console)
                });
            }
        })    
    })
}

$(function() {
    // Add a confirmation modal to any button that has the attribute confirm (either it has content or not)
    $('[confirm]').confirmButton();
})