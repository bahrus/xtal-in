module xtal.elements{
    interface IXtalInProperties{
        bubbles: boolean | polymer.PropObjectType,
        composed: boolean | polymer.PropObjectType,
        debounceDuration: number | polymer.PropObjectType,
        detailOut: object | polymer.PropObjectType,
        //dispatch: boolean | polymer.PropObjectType,
        fileName: string | polymer.PropObjectType,
        href: string | polymer.PropObjectType,
        resolvedUrl: string | polymer.PropObjectType,
        stopPropagation: boolean | polymer.PropObjectType,
        dispatchTypeArg: string | polymer.PropObjectType,
        whenClick: boolean | polymer.PropObjectType,
        whenInput: boolean | polymer.PropObjectType
    }
    function initXtalIn(){
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
        class XtalIn  extends Polymer.Element  implements IXtalInProperties{
            dispatch: boolean; bubbles: boolean; composed: boolean; href: string;
            dispatchTypeArg; string; whenClick: boolean; whenInput: boolean; fileName; resolvedUrl; 
            detailOut : object; stopPropagation: boolean; debounceDuration: number;
            __inputDebouncer;
            static get is(){return 'xtal-in';}
            static get properties() : IXtalInProperties{
                return{
                    /**
                     * https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
                     * A Boolean indicating whether the event bubbles. The default is false.
                     */
                    bubbles: {
                        type: Boolean
                    },
                    /**
                     * https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
                     * A Boolean indicating whether the event will trigger listeners outside of a shadow root. The default is false.
                     */
                    composed:{
                        type: Boolean
                    },
                    /**
                     * Applicable only to input handler (for now)
                     */
                    debounceDuration:{
                        type: Number
                    },
                    /**
                     * A computed property that can be used to uniquely identify events
                     */
                    fileName:{
                        type: String,
                        computed: 'computeFileName(resolvedUrl)'
                    },
                    /**
                     * A computed property that can be used to uniquely identify events
                     */
                    resolvedUrl:{
                        type: String,
                        computed: 'resolveUrl(href)'
                    },
                    /**
                     * A pointer to a resouce that can be used to uniquely identify events
                     */
                    href:{
                        type: String
                    },
                    stopPropagation:{
                        type: Boolean
                    },
                    /**
                     * Name of the event to use with ustom event dispatching.  
                     * This is the name of the first argument as described here:  
                     * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
                     * 
                     * With a large application, naming these events so there is no confusion between different meaning events 
                     * from different elements with the same event name becomes more difficult.
                     * 
                     * To name the event in a "type-safe way" use "${this.fileName}" or "{$this.resolvedUrl}".
                     */
                    dispatchTypeArg:{
                        type: String,
                    },
                    /**
                     * Dispatch click events
                     */
                    whenClick:{
                        type: Boolean,
                        observer: 'onWhenClickChange'
                    },
                    /**
                     * Dispatch input events
                     */
                    whenInput:{
                        type: Boolean,
                        observer: 'onWhenInputChange'
                    },
                    /**
                     * An expression pointing to where to place the results of the detail object after bubbling through
                     * applicable event handlers.
                     */
                    detailOut:{
                        type: Object,
                        notify: true,
                        readOnly: true
                    }
                }
            }

            disconnectedCallback(){
                this.removeEventListener('click', this.handleClick);
                this.removeEventListener('input', this.handleInput);
            }

            onWhenClickChange(val){
                if(val){
                    this.addEventListener('click', this.handleClick)
                }else{
                    this.removeEventListener('click', this.handleClick);
                }
            }

            onWhenInputChange(val){
                if(val){
                    if(this.debounceDuration > 0){
                        if(!this.__inputDebouncer){
                            const _this = this;
                            this.__inputDebouncer = xtal.elements['debounce'](() => {
                                this.handleInput();
                            }, this.debounceDuration);
                        }
                        this.addEventListener('input', this.__inputDebouncer);
                    }else{
                        this.addEventListener('input', this.handleInput)
                    }
 
                }else{
                    if(this.debounceDuration > 0){
                         this.removeEventListener('input', this.__inputDebouncer);
                    }else{
                        this.removeEventListener('input', this.handleInput);
                    }
                    
                   
                }
            }

            getEventName(){
                switch(this.dispatchTypeArg){
                    case '${this.fileName}':
                        return this.fileName;
                    case '${this.resolvedUrl}':
                        return this.resolvedUrl;
                    default:
                        return this.dispatchTypeArg;
                }
            }


            emitEvent(detail: object){
                const newEvent = new CustomEvent(this.getEventName(), {
                    detail: detail,
                    bubbles: this.bubbles,
                    composed: this.composed
                } as CustomEventInit);
                this.dispatchEvent(newEvent);
                this['_setDetailOut'](newEvent);
            }

            handleClick(){
                if(this.stopPropagation) event.stopPropagation();
                const detail = {};
                this.emitEvent(detail);
            }

            handleInput(){
                if(this.stopPropagation) event.stopPropagation();
                const src = event.srcElement as HTMLInputElement
                const detail = {
                    name: src.name,
                    value: src.value,
                }
                this.emitEvent(detail);
            }


            computeFileName(resolvedUrl: string){
                //From: https://stackoverflow.com/questions/43638163/get-filename-from-url-and-strip-file-extension
                const fileNameWithExtension =  resolvedUrl.split('/').pop();
                return fileNameWithExtension.substr(0, fileNameWithExtension.lastIndexOf('.'));
            }

            resolveURL(href: string){
                return this.resolvedUrl(href);
            }
        }

        customElements.define(XtalIn.is, XtalIn);
    
    }
    const syncFlag = 'xtal_elements_in_sync'
    if(window[syncFlag]){
        customElements.whenDefined('poly-prep-sync').then(() => initXtalIn());
        delete window[syncFlag];
    }else{
        customElements.whenDefined('poly-prep').then(() => initXtalIn());
    }
}