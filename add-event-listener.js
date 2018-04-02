import { XtalCustomEvent, registerTagName } from './custom-event.js';
const stopPropagation = 'stop-propagation';
const on = 'on';
const ifMatches = 'if-matches';
const valueProps = 'value-props';
const cascadeDown = 'cascade-down';
const defaultTagName_addEventListener = 'add-event-listener';
const canonicalTagName_XtalInCurry = 'xtal-in-curry';
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
    get cascadeDown() {
        return this._cascadeDown;
    }
    set cascadeDown(val) {
        if (val) {
            this.setAttribute(cascadeDown, '');
        }
        else {
            this.removeAttribute(cascadeDown);
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
        return super.observedAttributes.concat([stopPropagation, on, ifMatches, valueProps, cascadeDown]);
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
            case cascadeDown:
                this._cascadeDown = newValue !== null;
                if (this._cascadeDown) {
                    this.propagateDown();
                }
                break;
            case on:
                this._on = newValue;
                const parent = this.parentElement;
                let bundledAllHandlers = parent[canonicalTagName_XtalInCurry];
                if (this._on) {
                    if (!bundledAllHandlers) {
                        bundledAllHandlers = parent[canonicalTagName_XtalInCurry] = {};
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
    propagateDown() {
        if (!this.eventName)
            return;
        const targetAttr = this.eventName + '-props';
        const targets = this.parentElement.querySelectorAll('[' + targetAttr + ']');
        for (let i = 0, ii = targets.length; i < ii; i++) {
            const target = targets[i];
            const props = target.getAttribute(targetAttr).split(',');
            props.forEach(prop => {
                target[prop] = this.value;
            });
        }
    }
    handleEvent(e) {
        const bundledHandlers = this['xtal-in-curry'][e.type];
        bundledHandlers.forEach(subscriber => {
            const target = e.target;
            if (subscriber._ifMatches) {
                if (!target.matches(subscriber._ifMatches))
                    return;
            }
            subscriber.modifyEvent(e, subscriber);
            if (this._valueProps) {
                let values;
                let hasMultipleValues = false;
                if (Array.isArray(this._valueProps)) {
                    hasMultipleValues = true;
                    values = {};
                    this._valueProps.forEach(prop => {
                        values[prop] = target[prop];
                    });
                }
                else {
                    values = target[this._valueProps];
                }
                const eventObj = {};
                // if(subscriber._zoomedDetail){
                //     eventObj.context = subscriber._zoomedDetail
                // }
                if (values) {
                    if (hasMultipleValues) {
                        eventObj.values = values;
                    }
                    else {
                        eventObj.value = values;
                    }
                    eventObj.context = e['detail'];
                }
                else {
                    Object.assign(eventObj, e['detail']);
                }
                subscriber.detail = eventObj;
            }
            else {
                subscriber.detail = Object.assign({}, e['detail']);
            }
            const value = Object.assign({}, subscriber.detail);
            subscriber.setValue(value);
            if (subscriber.cascadeDown) {
                subscriber.propagateDown();
            }
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
        let bundledAllHandlers = parent[canonicalTagName_XtalInCurry];
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
if (!customElements.get(canonicalTagName_XtalInCurry)) {
    registerTagName(defaultTagName_addEventListener, AddEventListener);
    class XtalInCurry extends AddEventListener {
    }
    customElements.define(canonicalTagName_XtalInCurry, XtalInCurry);
}
//# sourceMappingURL=add-event-listener.js.map