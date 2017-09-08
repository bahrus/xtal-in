module xtal.elements {
    interface IXtalInProperties {
        bubbles: boolean,
        composed: boolean,
        debounceDuration,
        dispatch: boolean,
        detailOut: object,
        fileName: string,
        href: string,
        resolvedUrl: string,
        stopPropagation: boolean,
        eventName: string,
        whenClick: boolean,
        whenInput: boolean
    }
    /**
    * `xtal-in`
    * Polymer based element.  Wrap an input element like button or input in this custom element, and this curries the 
    * standard dom event with generic type, like "click," into a custom event with a semantically meaningful, or typesafe event name.
    * 
    *
    * @customElement
    * @polymer
    * @demo demo/index.html
    */
    class XtalIn extends HTMLElement implements IXtalInProperties {
        dispatch: boolean; bubbles: boolean; composed: boolean; href: string;
        detailOut: object; stopPropagation: boolean; debounceDuration: number; fileName: string;
        eventName: string; whenClick: boolean; whenInput: boolean;
        __inputDebouncer;
        static get is() { return 'xtal-in'; }
        static get observedAttributes(): string[] {
            return [
                /** @type {Boolean}
                 * https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
                 * A Boolean indicating whether the event bubbles. The default is false.
                 */
                'bubbles',
                /** @type {Boolean}
                 * https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
                 * A Boolean indicating whether the event will trigger listeners outside of a shadow root. The default is false.
                 */
                'composed',
                /** @type {Number}
                 * Applicable only to input handler (for now)
                 */
                'debounce-duration',
                // /** @type {Object}
                //  * An expression pointing to where to place the results of the detail object after bubbling through
                //  * applicable event handlers.
                //  */
                // detailOut:{
                //     type: Object,
                //     notify: true,
                //     readOnly: true
                // }
                /** @type {Boolean}
                 * Must be true for any dispatching to take place
                 */
                'dispatch',
                /** @type {String}
                 * Name of the event to use with custom event dispatching.  
                 * This is the name of the first argument as described here:  
                 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
                 * 
                 * With a large application, naming these events so there is no confusion between different meaning events 
                 * from different elements with the same event name becomes more difficult.
                 * 
                 * To name the event in a "type-safe way" use "${this.fileName}" or "{$this.resolvedUrl}".
                 */
                'event-name',
                /** @type {String}
                 * A computed property that can be used to uniquely identify events
                 */
                'file-name',
                /** @type {String}
                 * A pointer to a resouce that can be used to uniquely identify events
                 */
                'href',

                // resolvedUrl:{
                //     type: String,
                //     computed: 'resolveUrl(href)'
                // },
                /** @type {Boolean} */
                'stop-propagation',
                /** @type {Boolean}
                 * Dispatch click events
                 */
                'when-click',
                /** @type {Boolean}
                 * Dispatch input events
                 */
                'when-input',
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case 'bubbles':
                    this.bubbles = (newValue !== null);
                    break;
                case 'composed':
                    this.composed = (newValue !== null);
                    break;
                case 'debounce-duration':
                    this.debounceDuration = parseInt(newValue);
                case 'dispatch':
                    this.dispatch = (newValue !== null);
                    if(this.dispatch){
                        this.onWhenClickChange();
                        this.onWhenInputChange();
                    }
                    break;
                case 'event-name':
                    this.eventName = newValue;
                    break;
                case 'file-name':
                    this.fileName = newValue;
                    break;
                case 'href':
                    this.href = newValue;
                    break;
                case 'stop-propagation':
                    this.stopPropagation = (newValue !== null);
                    break;
                case 'when-click':
                    this.whenClick = (newValue !== null);
                    this.onWhenClickChange();
                    break;
                case 'when-input':
                    this.whenInput = (newValue !== null);
                    this.onWhenInputChange();
                    break;
            }
        }


        disconnectedCallback() {
            this.removeEventListener('click', this.handleClick);
            this.removeEventListener('input', this.handleInput);
        }

        onWhenClickChange() {
            if(!this.dispatch) return;
            if (this.whenClick) {
                this.addEventListener('click', this.handleClick)
            } else {
                this.removeEventListener('click', this.handleClick);
            }
        }

        /**
        * A computed property that can be used to uniquely identify events
        */
        get resolvedUrl() {
            return this.resolvedUrl(this.href);
        }

        debounce(func, wait, immediate?) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                }, wait);
                if (immediate && !timeout) func.apply(context, args);
            };
        }

        onWhenInputChange() {
            if (!this.dispatch) return;
            if (this.whenInput) {
                if (this.debounceDuration > 0) {
                    if (!this.__inputDebouncer) {
                        const _this = this;
                        this.__inputDebouncer = this.debounce(() => {
                            _this.handleInput();
                        }, this.debounceDuration);
                    }
                    this.addEventListener('input', this.__inputDebouncer);
                } else {
                    this.addEventListener('input', this.handleInput)
                }

            } else {
                if (this.debounceDuration > 0) {
                    this.removeEventListener('input', this.__inputDebouncer);
                } else {
                    this.removeEventListener('input', this.handleInput);
                }


            }
        }

        getEventName() {
            switch (this.eventName) {
                case '${this.fileName}':
                    return this.fileName;
                case '${this.resolvedUrl}':
                    return this.resolvedUrl;
                default:
                    return this.eventName;
            }
        }


        emitEvent(detail: object) {
            const newEvent = new CustomEvent(this.getEventName(), {
                detail: detail,
                bubbles: this.bubbles,
                composed: this.composed
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
            //this['_setDetailOut'](newEvent);
        }

        handleClick() {
            if (this.stopPropagation) event.stopPropagation();
            const detail = {};
            this.emitEvent(detail);
        }

        handleInput() {
            if (this.stopPropagation) event.stopPropagation();
            const src = event.srcElement as HTMLInputElement
            const detail = {
                name: src.name,
                value: src.value,
            }
            this.emitEvent(detail);
        }


        computeFileName(resolvedUrl: string) {
            //From: https://stackoverflow.com/questions/43638163/get-filename-from-url-and-strip-file-extension
            const fileNameWithExtension = resolvedUrl.split('/').pop();
            return fileNameWithExtension.substr(0, fileNameWithExtension.lastIndexOf('.'));
        }


    }

    customElements.define(XtalIn.is, XtalIn);


}