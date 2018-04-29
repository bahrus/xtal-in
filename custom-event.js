const defaultTagName = 'custom-event';
const canonicalTagName = 'xtal-in-detail';
const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
const disabled = 'disabled';
const detail = 'detail';
const event_name = 'event-name';
const debounce_duration = 'debounce-duration';
const zoom_in = 'zoom-in';
const zoom_out = 'zoom-out';
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
    get disabled() {
        return this._disabled || this.hasAttribute(disabled);
    }
    set disabled(val) {
        if (val) {
            this.setAttribute(disabled, '');
        }
        else {
            this.removeAttribute(disabled);
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
        this._zoomedDetail = this.zoom(this._detail);
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
    get zoomIn() {
        return this.getAttribute(zoom_in);
    }
    set zoomIn(val) {
        this.setAttribute(zoom_in, val);
    }
    get zoomOut() {
        return this.getAttribute(zoom_out);
    }
    set zoomOut(val) {
        this.setAttribute(zoom_out, val);
    }
    zoomInObject(obj) {
        if (!this.zoomIn)
            return obj;
        let returnObj = obj;
        const split = this.zoomIn.split('.');
        for (let i = 0, ii = split.length; i < ii; i++) {
            const selector = split[i];
            returnObj = returnObj[selector];
            if (!returnObj)
                return null;
        }
        return returnObj;
    }
    zoomOutObject(obj) {
        if (!this.zoomOut)
            return obj;
        let returnObj = obj;
        this.zoomOut.split('.').forEach(token => {
            returnObj = {
                token: returnObj
            };
        });
        return returnObj;
    }
    zoom(obj) {
        if (obj === null)
            return obj;
        return this.zoomInObject(this.zoomOutObject(obj));
    }
    get result() {
        return this._result;
    }
    setResult(val, e) {
        this._result = val;
        const newEvent = new CustomEvent('result-changed', {
            detail: {
                value: val
            },
            bubbles: true,
            composed: false
        });
        this.dispatchEvent(newEvent);
    }
    onPropsChange() {
        if (!this._dispatch || !this._detail || (!this.eventName) || this.disabled)
            return;
        if (this._debounceFunction) {
            this._debounceFunction();
        }
        else {
            this.emitEvent();
        }
    }
    emitEvent() {
        const newEvent = new CustomEvent(this.eventName, {
            detail: this._zoomedDetail,
            bubbles: this.bubbles,
            composed: this.composed
        });
        this.dispatchEvent(newEvent);
        if (!this._isSubClass && newEvent.detail) {
            this.setResult(newEvent.detail.value, newEvent);
        }
    }
    // set isSubClass(val){
    //     this._isSubClass = val;
    // }
    static get observedAttributes() {
        return [bubbles, composed, dispatch, detail, event_name, debounce_duration, zoom_in, zoom_out];
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
    connectedCallback() {
        this._upgradeProperties(XtalCustomEvent.observedAttributes.map(attrib => snakeToCamel(attrib)));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            //booleans
            case bubbles:
            case dispatch:
            case composed:
            case disabled:
                this['_' + snakeToCamel(name)] = newValue !== null;
                break;
            case detail:
                this._detail = this.zoom(JSON.parse(newValue));
                break;
            case debounce_duration:
                this._debounceDuration = parseFloat(newValue);
                if (this._debounceDuration > 0) {
                    this._debounceFunction = debounce(() => {
                        this.emitEvent();
                    }, this._debounceDuration);
                }
                break;
        }
        this.onPropsChange();
    }
}
export function registerTagName(defaultTagName, cls) {
    const h = document.head;
    if (!h)
        return;
    const scTagName = 'xtalIn' + snakeToCamel(defaultTagName) + 'Alias';
    let tagName = defaultTagName;
    const alias = h.dataset[scTagName];
    if (alias) {
        tagName = alias;
    }
    customElements.define(tagName, cls);
}
export function snakeToCamel(s) {
    return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
}
if (!customElements.get(canonicalTagName)) {
    registerTagName(defaultTagName, XtalCustomEvent);
    class XtalInDetail extends XtalCustomEvent {
    }
    customElements.define(canonicalTagName, XtalInDetail);
}
//# sourceMappingURL=custom-event.js.map