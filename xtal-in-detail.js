//const t = (document.currentScript as HTMLScriptElement).dataset.as;
//const tagName = t ? t : 'xtal-in-detail'; 
const defaultTagName = 'xtal-in-detail';
const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
const detail = 'detail';
const event_name = 'event-name';
export class XtalInDetail extends HTMLElement {
    get bubbles() {
        return this._bubbles;
    }
    set bubbles(val) {
        if (val) {
            this.setAttribute(bubbles, '');
        }
        else {
            this.removeAttribute(bubbles);
        }
    }
    get composed() {
        return this._composed;
    }
    set composed(val) {
        if (val) {
            this.setAttribute(composed, '');
        }
        else {
            this.removeAttribute(composed);
        }
    }
    get dispatch() {
        return this._dispatch;
    }
    set dispatch(val) {
        if (val) {
            this.setAttribute(dispatch, '');
        }
        else {
            this.removeAttribute(dispatch);
        }
    }
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
    set eventName(val) {
        this.setAttribute(event_name, val);
    }
    // get href(){
    //     return this.getAttribute(href);
    // }
    // set href(val: string){
    //     this.setAttribute(href, val);
    // }
    onPropsChange() {
        if (!this._dispatch || !this._detail || (!this.eventName))
            return;
        this.emitEvent();
    }
    emitEvent() {
        const newEvent = new CustomEvent(this.eventName, {
            detail: this.detail,
            bubbles: this.bubbles,
            composed: this.composed
        });
        this.dispatchEvent(newEvent);
    }
    static get observedAttributes() {
        return [bubbles, composed, dispatch, detail, event_name];
    }
    _upgradeProperties(props) {
        props.forEach(prop => {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        });
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
function registerTagNameForRealz(defaultTagName, cls) {
    const scTagName = 'npm_xtal_in_' + defaultTagName.split('-').join('_');
    let tagName = defaultTagName;
    const linkRef = self[scTagName];
    if (linkRef && linkRef.dataset.as) {
        tagName = linkRef.dataset.as;
    }
    if (customElements.get(tagName))
        return;
    customElements.define(tagName, cls);
}
export function registerTagName(defaultTagName, cls) {
    if (document.readyState !== "loading") {
        registerTagNameForRealz(defaultTagName, cls);
    }
    else {
        document.addEventListener("DOMContentLoaded", e => {
            registerTagNameForRealz(defaultTagName, cls);
        });
    }
}
registerTagName(defaultTagName, XtalInDetail);
// })();
//# sourceMappingURL=xtal-in-detail.js.map