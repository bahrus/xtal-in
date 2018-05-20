
//@ts-check
(function () {
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
function debounce(func, wait, immediate) {
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
class XtalCustomEvent extends HTMLElement {
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
function registerTagName(defaultTagName, cls) {
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
function snakeToCamel(s) {
    return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
}
if (!customElements.get(canonicalTagName)) {
    registerTagName(defaultTagName, XtalCustomEvent);
    class XtalInDetail extends XtalCustomEvent {
    }
    customElements.define(canonicalTagName, XtalInDetail);
}
//# sourceMappingURL=custom-event.js.map
const defaultTagName_xtal_in_attributes = 'observe-attributes';
const canonicalTagName_xtal_in_attributes = 'xtal-in-attributes';
const filter = 'filter';
class ObserveAttributes extends XtalCustomEvent {
    get filter() {
        return this._filter;
    }
    set filter(val) {
        this.setAttribute(filter, JSON.stringify(val));
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([filter]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case filter:
                this._filter = JSON.parse(newValue);
                break;
        }
    }
    getValues(attributes) {
        const attribs = {};
        attributes.forEach(attrib => {
            attribs[attrib] = this._child[attrib];
        });
        return attribs;
    }
    addMutationObserver() {
        this.disconnect();
        if (!this._child)
            return;
        const config = { attributes: true, attributeFilter: this._filter };
        this._observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                this.detail = {
                    mutation
                };
            });
            const attribs = this.filter ? this.getValues(this.filter) : this._child.attributes;
            this.setResult(attribs, null);
        });
        this._observer.observe(this._child, config);
    }
    getChild() {
        switch (this.childElementCount) {
            case 0:
                setTimeout(() => {
                    this.getChild();
                }, 100);
                return;
            case 1:
                this._child = this.firstElementChild;
                this.addMutationObserver();
                break;
            default:
                console.error("This component only supports a single element child");
        }
    }
    disconnect() {
        if (this._observer)
            this._observer.disconnect();
    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties([filter]);
        this.getChild();
    }
}
registerTagName(defaultTagName_xtal_in_attributes, ObserveAttributes);
class XtalInAttributes extends ObserveAttributes {
}
customElements.define(canonicalTagName_xtal_in_attributes, XtalInAttributes);
//# sourceMappingURL=observe-attributes.js.map
const defaultTagName_xtal_in_children = 'observe-children';
const canonicalTagName_xtal_in_children = 'xtal-in-children';
const watchSubtree = 'watch-subtree';
class ObserveChildren extends XtalCustomEvent {
    constructor() {
        super();
        this._mutationCount = 0;
        this._isSubClass = true;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([watchSubtree]);
    }
    get watchSubtree() {
        return this.hasAttribute(watchSubtree);
        ;
    }
    set watchSubtree(val) {
        if (val) {
            this.setAttribute(watchSubtree, '');
        }
        else {
            this.removeAttribute(watchSubtree);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case watchSubtree:
                this._watchSubtree = newValue !== null;
                this.disconnect();
                this.addMutationObserver();
                break;
        }
    }
    disconnect() {
        if (this._observer)
            this._observer.disconnect();
    }
    addMutationObserver() {
        const config = { childList: true, subtree: this._watchSubtree };
        this._observer = new MutationObserver((mutationsList) => {
            this.detail = mutationsList;
            this._mutationCount++;
            this.setResult(this._mutationCount, null);
        });
        this.setResult(this._mutationCount, null);
        this._observer.observe(this.parentElement, config);
    }
    connectedCallback() {
        super.connectedCallback();
        this.disconnect();
        this.addMutationObserver();
    }
    disconnedCallback() {
        this.disconnect();
    }
}
registerTagName(defaultTagName_xtal_in_children, ObserveChildren);
class XtalInChildren extends ObserveChildren {
}
customElements.define(canonicalTagName_xtal_in_children, XtalInChildren);
//# sourceMappingURL=observe-children.js.map
const mediaQueryString = 'media-query-string';
const canonicalTagName_XtalInMedia = 'xtal-in-media';
const matchesMediaQuery = 'matches-media-query';
class MatchMedia extends XtalCustomEvent {
    static get is() { return 'match-media'; }
    get mediaQueryString() {
        return this._mediaQueryString;
    }
    set mediaQueryString(val) {
        this.setAttribute(mediaQueryString, val);
    }
    static get observedAttributes() {
        return [
            mediaQueryString,
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case mediaQueryString:
                this.disconnect();
                this._mediaQueryString = newValue;
                if (newValue !== null) {
                    this._mql = window.matchMedia(this._mediaQueryString);
                    this._boundMediaQueryHandler = this.handleMediaQueryChange.bind(this);
                    this.connect();
                }
        }
    }
    connect() {
        this._mql.addListener(this._boundMediaQueryHandler);
    }
    disconnect() {
        if (this._mql)
            this._mql.removeListener(this._boundMediaQueryHandler);
    }
    handleMediaQueryChange(e) {
        if (e.matches) {
            this.setAttribute(matchesMediaQuery, '');
        }
        else {
            this.removeAttribute(matchesMediaQuery);
        }
        this.detail = e;
        this.setResult(e.matches, null);
    }
    connectedCallback() {
        this._upgradeProperties(['mediaQueryString']);
    }
    disconnectedCallback() {
        this.disconnect();
    }
}
if (!customElements.get(canonicalTagName_XtalInMedia)) {
    registerTagName(MatchMedia.is, MatchMedia);
    class XtalInMedia extends MatchMedia {
    }
    customElements.define(canonicalTagName_XtalInMedia, XtalInMedia);
}
//# sourceMappingURL=match-media.js.map
const stopPropagation = 'stop-propagation';
const on = 'on';
const ifMatches = 'if-matches';
const valueProps = 'value-props';
const disabledAttributeMatcher = 'disabled-attribute-matcher';
//const cascadeDown = 'cascade-down';
const defaultTagName_addEventListener = 'add-event-listener';
const canonicalTagName_XtalInCurry = 'xtal-in-curry';
function getParent(el) {
    const parent = el.parentNode;
    if (parent.nodeType === 11) {
        return parent['host'];
    }
    return parent;
}
class AddEventListener extends XtalCustomEvent {
    constructor() {
        super();
        this._isSubClass = true;
    }
    get stopPropagation() {
        return this._stopPropagation || this.hasAttribute(stopPropagation);
    }
    set stopPropagation(val) {
        if (val) {
            this.setAttribute(stopPropagation, '');
        }
        else {
            this.removeAttribute(stopPropagation);
        }
    }
    get disabledAttributeMatcher() {
        return this._disabledAttributeMatcher || this.getAttribute(disabledAttributeMatcher);
    }
    set(val) {
        if (val) {
            this.setAttribute(disabledAttributeMatcher, '');
        }
        else {
            this.removeAttribute(disabledAttributeMatcher);
        }
    }
    get on() {
        return this._on;
    }
    set on(val) {
        this.setAttribute(on, val);
    }
    get ifMatches() {
        return this._ifMatches || this.getAttribute(ifMatches);
    }
    set ifMatches(val) {
        this.setAttribute(ifMatches, val);
    }
    get valueProps() {
        return this._valueProps || this.getAttribute(valueProps);
    }
    set valueProps(val) {
        this.setAttribute(valueProps, val.toString());
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([stopPropagation, on, ifMatches, valueProps, disabledAttributeMatcher]);
    }
    qsa(css, from) {
        return [].slice.call((from ? from : this).querySelectorAll(css));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            // case href:
            //     this._href = newValue;
            //     break;
            case stopPropagation:
                this._stopPropagation = newValue !== null;
                break;
            case valueProps:
                this._valueProps = newValue;
            // if (newValue === null) {
            //     this._valueProps = null;
            // } else {
            //     if (newValue.startsWith('[')) {
            //         this._valueProps = JSON.parse(newValue);
            //     } else {
            //         this._valueProps = newValue;
            //     }
            // }
            case ifMatches:
                this._ifMatches = newValue;
                break;
            case disabledAttributeMatcher:
                this._disabledAttributeMatcher = newValue !== null;
            //bba
            case on:
                this._on = newValue;
                const parent = getParent(this);
                let bundledAllHandlers = parent[canonicalTagName_XtalInCurry];
                if (this._on) {
                    if (!this._boundEventHandler) {
                        this._boundEventHandler = this.handleEvent.bind(parent);
                    }
                    if (!bundledAllHandlers) {
                        bundledAllHandlers = parent[canonicalTagName_XtalInCurry] = {};
                    }
                    let bundledHandlersForSingleEventType = bundledAllHandlers[this._on];
                    if (!bundledHandlersForSingleEventType) {
                        bundledHandlersForSingleEventType = bundledAllHandlers[this._on] = [];
                        parent.addEventListener(this._on, this._boundEventHandler);
                    }
                    bundledHandlersForSingleEventType.push(this);
                    //this._boundHandleEvent = this.handleEvent.bind(this);
                    //this.parentElement.addEventListener(this._on, this._boundHandleEvent);
                    // this.qsa('[xtal-in-able]', parent).forEach((el : HTMLElement) =>{
                    //     el.removeAttribute('disabled');
                    // });
                    this.enableElements();
                    if (document.readyState === "loading") {
                        document.addEventListener("DOMContentLoaded", e => {
                            this.enableElements();
                            ;
                        });
                    }
                }
                else {
                    this.disconnect();
                }
                break;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
    enableElements() {
        if (this.disabledAttributeMatcher) {
            this.setAttribute('attached', '');
            const parent = getParent(this);
            if (this.qsa(`:not(attached)[${this.disabledAttributeMatcher}]`, parent).length > 0)
                return;
            this.qsa(`[disabled="${this.disabledAttributeMatcher}"]`, parent).forEach((el) => {
                el.removeAttribute('disabled');
            });
        }
    }
    modifyEvent(e, subscriber) {
        if (subscriber.stopPropagation)
            e.stopPropagation();
    }
    handleEvent(e) {
        const bundledHandlers = this['xtal-in-curry'][e.type];
        bundledHandlers.forEach(subscriber => {
            const target = e.target;
            if (subscriber.ifMatches) {
                if (!target.matches(subscriber.ifMatches))
                    return;
            }
            subscriber.modifyEvent(e, subscriber);
            if (this.valueProps) {
                let values;
                let hasMultipleValues = false;
                if (this.valueProps.indexOf(',') > -1) {
                    hasMultipleValues = true;
                    values = {};
                    const parsedValueProps = this.valueProps.split(',');
                    parsedValueProps.forEach(prop => {
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
                const detail = e['detail'];
                switch (typeof (detail)) {
                    case 'object':
                        subscriber.detail = Object.assign({}, detail);
                        break;
                    default:
                        subscriber.detail = detail;
                }
            }
            let receipt;
            switch (typeof (subscriber.detail)) {
                case 'object':
                    receipt = Object.assign({}, subscriber.detail);
                default:
                    receipt = subscriber.detail;
            }
            subscriber.setResult(receipt, e);
            // if(subscriber.cascadeDown){
            //     subscriber.propagateDown();
            // }
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
        const parent = getParent(this);
        let bundledAllHandlers = parent[canonicalTagName_XtalInCurry];
        const bundledHandlersForSingleEventType = bundledAllHandlers[this._on];
        this.removeElement(bundledHandlersForSingleEventType, this);
        // if (bundledHandlersForSingleEventType.length === 0) {
        //     parent.removeEventListener(this._on, this.handleEvent);
        // }
        if (bundledHandlersForSingleEventType.length === 0 && this._boundEventHandler) {
            parent.removeEventListener(this._on, this._boundEventHandler);
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
})();  
    