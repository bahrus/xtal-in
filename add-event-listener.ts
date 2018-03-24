declare var xtal_ize_event;
import { XtalInDetail, IXtalInDetailProperties, registerTagName } from './xtal-in-detail.js';
export interface IAddEventListener extends IXtalInDetailProperties {
    detailFn: (detail: any, ref: IAddEventListener) => any;
    stopPropagation: boolean,
    on: string,
    ifMatches: string,
}


//const href = 'href';
////const resolvedUrl = 'resolved-url';
const stopPropagation = 'stop-propagation';
//const fileName = 'file-name';
const on = 'on';
const ifMatches = 'if-matches';

//const t = (document.currentScript as HTMLScriptElement).dataset.as;
//const tagName = t ? t : 'add-event-listener';
const defaultTagName = 'add-event-listener';
class AddEventListener extends XtalInDetail implements IAddEventListener {

    _detailFn: (detail: any, ref: IAddEventListener) => any;
    get detailFn() {
        return this._detailFn;
    }
    set detailFn(val) {
        this._detailFn = val;
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
            case on:
                this._on = newValue;
                if (this._on) {
                    this._boundHandleEvent = this.handleEvent.bind(this);
                    this.parentElement.addEventListener(this._on, this._boundHandleEvent);
                } else {
                    this.disconnect();
                }
                break;
        }
    }
    _boundHandleEvent;
    handleEvent(e: Event) {
        if(this._ifMatches){
            if(!(e.target as HTMLElement).matches(this._ifMatches)) return;
        }
        if (this.stopPropagation) e.stopPropagation();
        if (this.detailFn) {
            this.detail = this.detailFn(e, this);
        }else{
            this.detail = {};
        }
        //this.dispatch = true;
        // window.requestAnimationFrame(() => {
        //     this.dispatch = false;
        // })
    }
    disconnect() {
        this.parentElement.removeEventListener(this._on, this._boundHandleEvent);
    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties(['on', 'stopPropagation', 'detailFn'])
    }
    disconnectedCallback() {
        super.connectedCallback();
        this.disconnect();
    }

}
registerTagName(defaultTagName, AddEventListener);

