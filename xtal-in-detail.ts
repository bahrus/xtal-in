
export interface IXtalInDetailProperties {
    bubbles: boolean,
    composed: boolean,
    dispatch: boolean,
    detail: any,
    eventName: string,
}

//const t = (document.currentScript as HTMLScriptElement).dataset.as;
//const tagName = t ? t : 'xtal-in-detail'; 
const tagName = 'xtal-in-detail';
const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
const detail = 'detail';
const event_name = 'event-name';


export class XtalInDetail extends HTMLElement implements IXtalInDetailProperties {
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

    // get href(){
    //     return this.getAttribute(href);
    // }
    // set href(val: string){
    //     this.setAttribute(href, val);
    // }

    onPropsChange() {
        if (!this._dispatch || !this._detail || (!this.eventName)) return;
        this.emitEvent();
    }

    emitEvent() {
        debugger;
        const newEvent = new CustomEvent(this.eventName, {
            detail: this.detail,
            bubbles: this.bubbles,
            composed: this.composed
        } as CustomEventInit);
        this.dispatchEvent(newEvent);
    }

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
        this._upgradeProperties(XtalInDetail.observedAttributes.map(attrib => this.snakeToCamel(attrib)));
      
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
if (customElements.get(tagName)) {
    customElements.define(tagName, XtalInDetail);
}

// })();