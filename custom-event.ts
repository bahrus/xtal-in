
export interface IXtalInDetailProperties {
    bubbles: boolean,
    composed: boolean,
    dispatch: boolean,
    detail: any,
    eventName: string,
    value: any,
}

const defaultTagName = 'custom-event';
const canonicalTagName = 'xtal-in-detail';
const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
const detail = 'detail';
const event_name = 'event-name';


export class XtalCustomEvent extends HTMLElement implements IXtalInDetailProperties {
    _bubbles: boolean;
    get bubbles() {
        return this._bubbles;
    }
    set bubbles(val) {
        if (val) {
            this.setAttribute(bubbles, '');
        } else {
            this.removeAttribute(bubbles);
        }
    }
    _composed: boolean;
    get composed() {
        return this._composed;
    }
    set composed(val) {
        if (val) {
            this.setAttribute(composed, '');
        } else {
            this.removeAttribute(composed);
        }
    }
    _dispatch: boolean;
    get dispatch() {
        return this._dispatch;
    }
    set dispatch(val) {
        if (val) {
            this.setAttribute(dispatch, '');
        } else {
            this.removeAttribute(dispatch);
        }
    }
    _detail: any;
    get detail() {
        return this._detail;
    }
    set detail(val) {
        this._detail = val;
        this.onPropsChange();
    }


    get eventName() {
        return this.getAttribute(event_name);
    }
    set eventName(val: string) {
        this.setAttribute(event_name, val);
    }

    _value: any;
    get value(){
        return this._value;
    }
    setValue(val){
        this._value = val;
        const newEvent = new CustomEvent('value-changed', {
            detail: {
                value: val
            },
            bubbles: true,
            composed: false
        } as CustomEventInit);
        this.dispatchEvent(newEvent);        
    }



    onPropsChange() {
        if (!this._dispatch || !this._detail || (!this.eventName)) return;
        this.emitEvent();
    }

    emitEvent() {
        const newEvent = new CustomEvent(this.eventName, {
            detail: this.detail,
            bubbles: this.bubbles,
            composed: this.composed
        } as CustomEventInit);
        this.dispatchEvent(newEvent);
        if(!this._isSubClass){
            this.setValue(newEvent.detail);
        }
    }

    _isSubClass : boolean; //automatic way to do this?
    // set isSubClass(val){
    //     this._isSubClass = val;
    // }

    static get observedAttributes() {
        return [bubbles, composed, dispatch, detail, event_name];
    }

    _upgradeProperties(props: string[]) {
        props.forEach(prop =>{
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        })
   
    }
    snakeToCamel(s) {
        return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
    }
    connectedCallback() {
        this._upgradeProperties(XtalCustomEvent.observedAttributes.map(attrib => this.snakeToCamel(attrib)));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            //booleans
            case bubbles:
            case dispatch:
            case composed:
                this['_' + this.snakeToCamel(name)] = newValue !== null;
                break;
            case detail:
                this._detail = JSON.parse(newValue);
                break;
        }
        this.onPropsChange();
    }
}
function registerTagNameForRealz(defaultTagName: string, cls: any){
    // const scTagName = 'npm_xtal_in_' +  defaultTagName.split('-').join('_');
    let tagName = defaultTagName;
    // const linkRef = self[scTagName] as HTMLLinkElement;
    // if(linkRef && linkRef.dataset.as){
    //     tagName = linkRef.dataset.as;
    // }
    const was = document.head.querySelector(`[data-was="${defaultTagName}"][data-package="npm.xtal-in"]`) as HTMLScriptElement;
    if(was){
        const is = was.dataset.is;
        if(is) tagName = is;
    }
    if(customElements.get(tagName)) return;
    customElements.define(tagName, cls);
}
export function registerTagName(defaultTagName: string, cls: any){
    if (document.readyState !== "loading") {
       registerTagNameForRealz(defaultTagName, cls);
    } else {
        document.addEventListener("DOMContentLoaded", e => {
            registerTagNameForRealz(defaultTagName, cls);
        });
    }
}
if(!customElements.get(canonicalTagName)) {
    registerTagName(defaultTagName, XtalCustomEvent);
    class XtalInDetail extends XtalCustomEvent{}
    customElements.define(canonicalTagName, XtalInDetail);
}
