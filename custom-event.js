const defaultTagName = 'custom-event';
const canonicalTagName = 'xtal-in-detail';
const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
const detail = 'detail';
const event_name = 'event-name';
const debounce_duration = 'debounce-duration';
// Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
    var timeout;
    return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
;
export class XtalCustomEvent extends HTMLElement {
    constructor() {
        super(...arguments);
        this._debounceDuration = 0;
    }
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
    get debounceDuration() {
        return this._debounceDuration;
    }
    set debounceDuration(val) {
        this.setAttribute(debounce_duration, val.toString());
    }
    get eventName() {
        return this.getAttribute(event_name);
    }
    set eventName(val) {
        this.setAttribute(event_name, val);
    }
    get value() {
        return this._value;
    }
    setValue(val) {
        this._value = val;
        const newEvent = new CustomEvent('value-changed', {
            detail: {
                value: val
            },
            bubbles: true,
            composed: false
        });
        this.dispatchEvent(newEvent);
    }
    onPropsChange() {
        if (!this._dispatch || !this._detail || (!this.eventName))
            return;
        console.log('debounce duration = ' + this._debounceDuration);
        if (this._deboundFunction) {
            this._deboundFunction();
        }
        else {
            this.emitEvent();
        }
    }
    emitEvent() {
        const newEvent = new CustomEvent(this.eventName, {
            detail: this.detail,
            bubbles: this.bubbles,
            composed: this.composed
        });
        this.dispatchEvent(newEvent);
        if (!this._isSubClass) {
            this.setValue(newEvent.detail);
        }
    }
    // set isSubClass(val){
    //     this._isSubClass = val;
    // }
    static get observedAttributes() {
        return [bubbles, composed, dispatch, detail, event_name, debounce_duration];
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
            case debounce_duration:
                this._debounceDuration = parseFloat(newValue);
                if (this._debounceDuration > 0) {
                    this._deboundFunction = debounce(() => {
                        this.emitEvent();
                    }, this._debounceDuration);
                }
                break;
        }
        this.onPropsChange();
    }
}
function registerTagNameForRealz(defaultTagName, cls) {
    // const scTagName = 'npm_xtal_in_' +  defaultTagName.split('-').join('_');
    let tagName = defaultTagName;
    // const linkRef = self[scTagName] as HTMLLinkElement;
    // if(linkRef && linkRef.dataset.as){
    //     tagName = linkRef.dataset.as;
    // }
    const was = document.head.querySelector(`[data-was="${defaultTagName}"][data-package="npm.xtal-in"]`);
    if (was) {
        const is = was.dataset.is;
        if (is)
            tagName = is;
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
if (!customElements.get(canonicalTagName)) {
    registerTagName(defaultTagName, XtalCustomEvent);
    class XtalInDetail extends XtalCustomEvent {
    }
    customElements.define(canonicalTagName, XtalInDetail);
}
//# sourceMappingURL=custom-event.js.map