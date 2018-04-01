import { XtalCustomEvent, registerTagName } from './custom-event.js';
const stopPropagation = 'stop-propagation';
const on = 'on';
const ifMatches = 'if-matches';
const valueProps = 'value-props';
const defaultTagName1 = 'add-event-listener';
const canonicalTagName2 = 'xtal-in-curry';
export class AddEventListener extends XtalCustomEvent {
    constructor() {
        super();
        this._isSubClass = true;
    }
    get stopPropagation() {
        return this._stopPropagation;
    }
    set stopPropagation(val) {
        if (val) {
            this.setAttribute(stopPropagation, '');
        }
        else {
            this.removeAttribute(stopPropagation);
        }
    }
    get on() {
        return this._on;
    }
    set on(val) {
        this.setAttribute(on, val);
    }
    get ifMatches() {
        return this._ifMatches;
    }
    set ifMatches(val) {
        this.setAttribute(ifMatches, val);
    }
    get valueProps() {
        return this._valueProps;
    }
    set valueProps(val) {
        this.setAttribute(valueProps, val.toString());
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([stopPropagation, on, ifMatches, valueProps]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            // case href:
            //     this._href = newValue;
            //     break;
            case stopPropagation:
                this._stopPropagation = newValue !== null;
                break;
            case valueProps:
                if (newValue === null) {
                    this._valueProps = null;
                }
                else {
                    if (newValue.startsWith('[')) {
                        this._valueProps = JSON.parse(newValue);
                    }
                    else {
                        this._valueProps = newValue;
                    }
                }
            case ifMatches:
                this._ifMatches = newValue;
                break;
            case on:
                this._on = newValue;
                const parent = this.parentElement;
                let bundledAllHandlers = parent[canonicalTagName2];
                if (this._on) {
                    if (!bundledAllHandlers) {
                        bundledAllHandlers = parent[canonicalTagName2] = {};
                    }
                    let bundledHandlersForSingleEventType = bundledAllHandlers[this._on];
                    if (!bundledHandlersForSingleEventType) {
                        bundledHandlersForSingleEventType = bundledAllHandlers[this._on] = [];
                        this.parentElement.addEventListener(this._on, this.handleEvent);
                    }
                    bundledHandlersForSingleEventType.push(this);
                    //this._boundHandleEvent = this.handleEvent.bind(this);
                    //this.parentElement.addEventListener(this._on, this._boundHandleEvent);
                }
                else {
                    this.disconnect();
                }
                break;
        }
    }
    //_boundHandleEvent;
    modifyEvent(e, subscriber) {
        if (subscriber.stopPropagation)
            e.stopPropagation();
    }
    handleEvent(e) {
        const bundledHandlers = this['xtal-in-curry'][e.type];
        bundledHandlers.forEach(subscriber => {
            const target = e.target;
            if (subscriber._ifMatches) {
                if (!target.matches(subscriber._ifMatches))
                    return;
            }
            this.modifyEvent(e, subscriber);
            const eventObj = {
                context: subscriber.detail
            };
            let values;
            if (this._valueProps) {
                if (Array.isArray(this._valueProps)) {
                    values = {};
                    this._valueProps.forEach(prop => {
                        values[prop] = target[prop];
                    });
                }
                else {
                    values = target[this._valueProps];
                }
                eventObj.values = values;
            }
            subscriber.detail = eventObj;
            subscriber.setValue(values);
        });
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
        const parent = this.parentElement;
        let bundledAllHandlers = parent[canonicalTagName2];
        const bundledHandlersForSingleEventType = bundledAllHandlers[this._on];
        this.removeElement(bundledHandlersForSingleEventType, this);
        if (bundledHandlersForSingleEventType.length === 0) {
            this.parentElement.removeEventListener(this._on, this.handleEvent);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties(['on', 'stopPropagation', 'valueProps']);
    }
    disconnectedCallback() {
        //super.disconnectedCallback();
        this.disconnect();
    }
}
if (!customElements.get(canonicalTagName2)) {
    registerTagName(defaultTagName1, AddEventListener);
    class XtalInCurry extends AddEventListener {
    }
    customElements.define(canonicalTagName2, XtalInCurry);
}
//# sourceMappingURL=add-event-listener.js.map