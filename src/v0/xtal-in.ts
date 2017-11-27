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
        getHost(){
            let parentElement = this.parentElement;
            while(parentElement){
                if(parentElement.shadowRoot) return parentElement;
                parentElement = parentElement.parentElement;
            }
        }
        getTarget(selector: string){
            if(!selector) return null;
            switch(selector){
                case '_self':
                    return this;
                case '_parent':
                    return this.parentElement;
                case '_host':
                    return this.getHost();
            }
        }
        _whenClickOn: string;
        set whenClickOn(val: string){
            this.setAttribute('when-click-on', val);
        }

        _whenInputtingOn: string;
        set whenInputtingOn(val: string){
            this.setAttribute('when-inputting-on', val);
        }

        _whenAttributeMutates: string;
        set whenAttributeMutates(val: string){
            this.setAttribute('when-attribute-mutates', val);
        }

        _eventDetail: object;
        set eventDetail(val){
            this._eventDetail = val;
        }

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
                /** @type {String} 
                 * Specify a target to watch click events oh
                */
                'when-clicking-on',
                /** @type {String} 
                 * Specify a target to watch input events on
                */
                'when-inputting-on',
                /** @type {String} 
                 * Specify a target to watch for attribute changes
                */

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

        changeTarget(){
            this.removeAllEventListeners();

        }

        removeAllEventListeners(){
            this.removeEventListener('click', this.handleClick);
            this.removeEventListener('input', this.handleInput);
        }
        _mutationObserver: MutationObserver;
        connectAllEventListeners(){
            this.onWhenClickChange();
            this.onWhenInputChange();
            const clickOn = this.getTarget(this.whenClickOn);
            if(clickOn){
                clickOn.addEventListener('click', this.handleClick);
            }
            const inputOn = this.getTarget(this.whenInputtingOn);
            if(inputOn){
                inputOn.addEventListener('input', this.handleInput);
            }
            const attributeMutationTarget = this.getTarget(this.whenAttributeMutates);
            if(attributeMutationTarget){
                this._mutationObserver = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                      const detail = {
                         attributeName: mutation.attributeName,
                         attributeValue: attributeMutationTarget.getAttribute(mutation.attributeName),
                      }
                      let name = (attributeMutationTarget.id || '') + '-';
                      name += mutation.attributeName + '-changed';
                      this.emitEvent(detail, name);
                    });    
                  });
                  const config = { attributes: true};
                  
                 // pass in the target node, as well as the observer options
                 this._mutationObserver.observe(attributeMutationTarget, config);
            }
        }
        disconnectedCallback() {
            this.removeAllEventListeners();
            this._mutationObserver.disconnect();
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


        emitEvent(detail: object, name: string) {
            if(!detail) detail  = {};
            if(this.eventDetail){
                for(let key in this.eventDetail){
                    detail[key] = this.eventDetail[key];
                }
            }
            let possibleName = this.getEventName();
            if(!possibleName) possibleName = name;
            const newEvent = new CustomEvent(possibleName, {
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
            this.emitEvent(detail, null);
        }

        handleInput() {
            if (this.stopPropagation) event.stopPropagation();
            const src = event.srcElement as HTMLInputElement
            const detail = {
                name: src.name,
                value: src.value,
            }
            this.emitEvent(detail, null);
        }


        computeFileName(resolvedUrl: string) {
            //From: https://stackoverflow.com/questions/43638163/get-filename-from-url-and-strip-file-extension
            const fileNameWithExtension = resolvedUrl.split('/').pop();
            return fileNameWithExtension.substr(0, fileNameWithExtension.lastIndexOf('.'));
        }


    }

    customElements.define(XtalIn.is, XtalIn);


}