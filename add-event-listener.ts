declare var xtal_ize_event;
import { XtalInDetail, IXtalInDetailProperties, registerTagName } from './xtal-in-detail.js';
export interface IAddEventListener extends IXtalInDetailProperties {
    //detailFn: (detail: any, ref: IAddEventListener) => any;
    valueProps: string | string[];
    stopPropagation: boolean,
    on: string,
    ifMatches: string,
}
export interface IEventPacket{
    context : any,
    values : any,
}

const stopPropagation = 'stop-propagation';
const on = 'on';
const ifMatches = 'if-matches';
const valueProps = 'value-props';

const defaultTagName = 'add-event-listener';
const canonicalTagName = 'xtal-in-curry';
class AddEventListener extends XtalInDetail implements IAddEventListener {
    constructor(){
        super();
        this._isSubClass = true;
    }

    _stopPropagation: boolean;
    get stopPropagation() {
        return this._stopPropagation;
    }
    set stopPropagation(val) {
        if (val) {
            this.setAttribute(stopPropagation, '');
        } else {
            this.removeAttribute(stopPropagation);
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
        return this._ifMatches;
    }
    set ifMatches(val: string) {
        this.setAttribute(ifMatches, val);
    }
    _valueProps: string | string[];
    get valueProps(){
        return this._valueProps;
    }
    set valueProps(val: string | string[]){
        this.setAttribute(valueProps, val.toString());
    }

    static get observedAttributes() {
        return super.observedAttributes.concat([stopPropagation, on, ifMatches, valueProps]);
    }
    attributeChangedCallback(name, oldValue, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            // case href:
            //     this._href = newValue;
            //     break;
            case stopPropagation:
                this._stopPropagation = newValue !== null;
                break;
            case valueProps:
                if(newValue === null){
                    this._valueProps = null;
                }else{
                    if(newValue.startsWith('[')){
                        this._valueProps = JSON.parse(newValue);
                    }else{
                        this._valueProps = newValue;
                    }
                }
            case ifMatches:
                this._ifMatches = newValue;
                break;
            case on:
                this._on = newValue;
                const parent = this.parentElement;
                let bundledAllHandlers = parent[canonicalTagName];
                if (this._on) {

                    if (!bundledAllHandlers) {

                        bundledAllHandlers = parent[canonicalTagName] = {};
                    }
                    let bundledHandlersForSingleEventType = bundledAllHandlers[this._on];
                    if (!bundledHandlersForSingleEventType) {
                        bundledHandlersForSingleEventType = bundledAllHandlers[this._on] = [];
                        this.parentElement.addEventListener(this._on, this.handleEvent);
                    }
                    bundledHandlersForSingleEventType.push(this);
                    //this._boundHandleEvent = this.handleEvent.bind(this);
                    //this.parentElement.addEventListener(this._on, this._boundHandleEvent);


                } else {
                    this.disconnect();
                }
                break;
        
        
            }
    }
    //_boundHandleEvent;


    handleEvent(e: Event) {
        const bundledHandlers = this['xtal-in-curry'][e.type] as XtalInCurry[];
        bundledHandlers.forEach(subscriber => {
            const target = e.target;
            if (subscriber._ifMatches) {
                if (!(target as HTMLElement).matches(subscriber._ifMatches)) return;
            }
            if (subscriber.stopPropagation) e.stopPropagation();
            const eventObj = {
                context: subscriber.detail
            } as IEventPacket;
            let values;
            if(this._valueProps){
                if(Array.isArray(this._valueProps)){
                    values = {};
                    this._valueProps.forEach(prop =>{
                        values[prop] = target[prop]
                    });
                }else{
                    values = target[this._valueProps];
                }
                eventObj.values = values;
            }
            subscriber.detail = eventObj;
            subscriber.setValue(values);
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
        const parent =this.parentElement;
        let bundledAllHandlers = parent[canonicalTagName];
        const bundledHandlersForSingleEventType = bundledAllHandlers[this._on] as XtalInDetail[];
        this.removeElement( bundledHandlersForSingleEventType, this);
        if(bundledHandlersForSingleEventType.length === 0){
            this.parentElement.removeEventListener(this._on, this.handleEvent);
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
registerTagName(defaultTagName, AddEventListener);
class XtalInCurry extends AddEventListener { }
customElements.define(canonicalTagName, XtalInCurry);

