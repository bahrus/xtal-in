import { XtalCustomEvent, IXtalInDetailProperties, registerTagName } from './custom-event.js';
export interface IAddEventListener extends IXtalInDetailProperties {
    //detailFn: (detail: any, ref: IAddEventListener) => any;
    valueProps: string;
    stopPropagation: boolean,
    on: string,
    ifMatches: string,
    disabledAttributeMatcher: string,
}
export interface IEventPacket {
    context: any,
    values: any,
    value: any
}

const stopPropagation = 'stop-propagation';
const on = 'on';
const ifMatches = 'if-matches';
const valueProps = 'value-props';
const disabledAttributeMatcher = 'disabled-attribute-matcher';
//const cascadeDown = 'cascade-down';

const defaultTagName_addEventListener = 'add-event-listener';
const canonicalTagName_XtalInCurry = 'xtal-in-curry';

export function getParent(el: HTMLElement){
    const parent = el.parentNode as HTMLElement;
    if(parent.nodeType === 11){
        return parent['host'];
    }
    return parent;
}

export class AddEventListener extends XtalCustomEvent implements IAddEventListener {
    constructor() {
        super();
        this._isSubClass = true;
    }

    _stopPropagation: boolean;
    get stopPropagation() {
        return this._stopPropagation || this.hasAttribute(stopPropagation);
    }
    set stopPropagation(val) {
        if (val) {
            this.setAttribute(stopPropagation, '');
        } else {
            this.removeAttribute(stopPropagation);
        }
    }

    _disabledAttributeMatcher ;
    get disabledAttributeMatcher(){
        return this._disabledAttributeMatcher || this.getAttribute(disabledAttributeMatcher);
    }
    set(val){
        if(val){
            this.setAttribute(disabledAttributeMatcher, '');
        }else{
            this.removeAttribute(disabledAttributeMatcher);
        }
    }

    _on: string;
    get on() {
        return this._on;
    }
    set on(val: string) {
        this.setAttribute(on, val);
    }

    _ifMatches: string;
    get ifMatches() {
        return this._ifMatches || this.getAttribute(ifMatches);
    }
    set ifMatches(val: string) {
        this.setAttribute(ifMatches, val);
    }
    _valueProps: string;
    get valueProps() {
        return this._valueProps || this.getAttribute(valueProps);
    }
    set valueProps(val) {
        this.setAttribute(valueProps, val.toString());
    }



    static get observedAttributes() {
        return super.observedAttributes.concat([stopPropagation, on, ifMatches, valueProps, disabledAttributeMatcher]);
    }
    qsa(css, from?: HTMLElement | Document) : HTMLElement[]{
        return  [].slice.call((from ? from : this).querySelectorAll(css));
    }
    attributeChangedCallback(name, oldValue, newValue: string) {
       
        switch (name) {
            // case href:
            //     this._href = newValue;
            //     break;
            case stopPropagation:
                this._stopPropagation = newValue !== null;
                break;

            case valueProps:
                this._valueProps = newValue;
                // if (newValue === null) {
                //     this._valueProps = null;
                // } else {
                //     if (newValue.startsWith('[')) {
                //         this._valueProps = JSON.parse(newValue);
                //     } else {
                //         this._valueProps = newValue;
                //     }
                // }
            case ifMatches:
                this._ifMatches = newValue;
                break;
            case disabledAttributeMatcher:
                this._disabledAttributeMatcher = newValue !== null;
                //bba
            case on:
                this._on = newValue;
                const parent = getParent(this);
                let bundledAllHandlers = parent[canonicalTagName_XtalInCurry];
                if (this._on) {

                    if (!bundledAllHandlers) {

                        bundledAllHandlers = parent[canonicalTagName_XtalInCurry] = {};
                    }
                    let bundledHandlersForSingleEventType = bundledAllHandlers[this._on];
                    if (!bundledHandlersForSingleEventType) {
                        bundledHandlersForSingleEventType = bundledAllHandlers[this._on] = [];
                        parent.addEventListener(this._on, this.handleEvent);
                    }
                    bundledHandlersForSingleEventType.push(this);
                    //this._boundHandleEvent = this.handleEvent.bind(this);
                    //this.parentElement.addEventListener(this._on, this._boundHandleEvent);
                    // this.qsa('[xtal-in-able]', parent).forEach((el : HTMLElement) =>{
                    //     el.removeAttribute('disabled');
                    // });
                    this.enableElements();
                    if (document.readyState === "loading") {
                        document.addEventListener("DOMContentLoaded", e => {
                            this.enableElements();;
                        });
                    } 

                    
                    
                } else {
                    this.disconnect();
                }
                break;


        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
    enableElements(){
        if(this.disabledAttributeMatcher){
            this.setAttribute('attached', '');
            const parent = getParent( this);
            if(this.qsa(`:not(attached)[${this.disabledAttributeMatcher}]`, parent).length > 0) return;
            this.qsa(`[disabled="${this.disabledAttributeMatcher}"]`, parent).forEach((el:HTMLElement) =>{
                el.removeAttribute('disabled');
            })
        }
    }
    modifyEvent(e: Event, subscriber: AddEventListener){
        if (subscriber.stopPropagation) e.stopPropagation();

    }



    handleEvent(e: Event) {

        const bundledHandlers = this['xtal-in-curry'][e.type] as AddEventListener[];
        bundledHandlers.forEach(subscriber => {
            const target = e.target;
            if (subscriber.ifMatches) {
                if (!(target as HTMLElement).matches(subscriber.ifMatches)) return;
            }
            subscriber.modifyEvent(e, subscriber);
            if (this.valueProps) {
                let values;
                let hasMultipleValues = false;
                if (this.valueProps.indexOf(',') > -1) {
                    hasMultipleValues = true;
                    values = {};
                    const parsedValueProps = this.valueProps.split(',');
                    parsedValueProps.forEach(prop => {
                        values[prop] = target[prop]
                    });
                } else {
                    values = target[this._valueProps];
                }
                const eventObj = {} as IEventPacket;
                // if(subscriber._zoomedDetail){
                //     eventObj.context = subscriber._zoomedDetail
                // }
                if(values){
                    if(hasMultipleValues){
                        eventObj.values = values;
                    }else{
                        eventObj.value = values;
                    }
                    eventObj.context = e['detail'];
                }else{
                    Object.assign(eventObj, e['detail']);
                }
                subscriber.detail = eventObj;
            }else{
                subscriber.detail = Object.assign({}, e['detail']);
            }
            const value = Object.assign({}, subscriber.detail);
            subscriber.setValue(value, e);
            // if(subscriber.cascadeDown){
            //     subscriber.propagateDown();
            // }
        })

        //this.dispatch = true;
        // window.requestAnimationFrame(() => {
        //     this.dispatch = false;
        // })
    }
    removeElement(array, element) {
        //https://blog.mariusschulz.com/2016/07/16/removing-elements-from-javascript-arrays
        const index = array.indexOf(element);

        if (index !== -1) {
            array.splice(index, 1);
        }
    }
    disconnect() {
        const parent = getParent(this);
        let bundledAllHandlers = parent[canonicalTagName_XtalInCurry];
        const bundledHandlersForSingleEventType = bundledAllHandlers[this._on] as CustomEvent[];
        this.removeElement(bundledHandlersForSingleEventType, this);
        if (bundledHandlersForSingleEventType.length === 0) {
            parent.removeEventListener(this._on, this.handleEvent);
        }

    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties(['on', 'stopPropagation', 'valueProps'])
    }
    disconnectedCallback() {
        //super.disconnectedCallback();
        this.disconnect();
    }

}
if(!customElements.get(canonicalTagName_XtalInCurry)){
    registerTagName(defaultTagName_addEventListener, AddEventListener);
    class XtalInCurry extends AddEventListener { }
    customElements.define(canonicalTagName_XtalInCurry, XtalInCurry);
}


