import { XtalInDetail, registerTagName } from './xtal-in-detail.js';
//const href = 'href';
////const resolvedUrl = 'resolved-url';
const stopPropagation = 'stop-propagation';
//const fileName = 'file-name';
const on = 'on';
const ifMatches = 'if-matches';
//const t = (document.currentScript as HTMLScriptElement).dataset.as;
//const tagName = t ? t : 'add-event-listener';
const defaultTagName = 'add-event-listener';
const canonicalTagName = 'xtal-in-curry';
class AddEventListener extends XtalInDetail {
    get detailFn() {
        return this._detailFn;
    }
    set detailFn(val) {
        this._detailFn = val;
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
    static get observedAttributes() {
        return super.observedAttributes.concat([stopPropagation, on, ifMatches]);
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
                }
                else {
                    this.disconnect();
                }
                break;
        }
    }
    //_boundHandleEvent;
    handleEvent(e) {
        const bundledHandlers = this['xtal-in-curry'][e.type];
        bundledHandlers.forEach(_this => {
            if (_this._ifMatches) {
                if (!e.target.matches(_this._ifMatches))
                    return;
            }
            if (_this.stopPropagation)
                e.stopPropagation();
            if (_this.detailFn) {
                _this.detail = _this.detailFn(e, this);
            }
            else {
                _this.detail = {};
            }
        });
        //this.dispatch = true;
        // window.requestAnimationFrame(() => {
        //     this.dispatch = false;
        // })
    }
    disconnect() {
        this.parentElement.removeEventListener(this._on, this.handleEvent);
    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties(['on', 'stopPropagation', 'detailFn']);
    }
    disconnectedCallback() {
        super.connectedCallback();
        this.disconnect();
    }
}
registerTagName(defaultTagName, AddEventListener);
class XtalInCurry extends AddEventListener {
}
customElements.define(canonicalTagName, XtalInCurry);
//# sourceMappingURL=add-event-listener.js.map