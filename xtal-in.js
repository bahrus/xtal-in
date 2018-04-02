
//@ts-check
(function () {
const defaultTagName = 'custom-event';
const canonicalTagName = 'xtal-in-detail';
const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
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
        if (!this._isSubClass) {
            this.setValue(newEvent.detail);
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
function registerTagName(defaultTagName, cls) {
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
            this.setValue(attribs);
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
        return this._watchSubtree;
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
        var config = { childList: true, subtree: this._watchSubtree };
        this._observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                this.detail = {
                    mutation
                };
            });
            this._mutationCount++;
            this.setValue(this._mutationCount);
        });
        this.detail = {
            status: 'observing'
        };
        this.setValue(this._mutationCount);
        this._observer.observe(this, config);
    }
    connectedCallback() {
        super.connectedCallback();
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
const stopPropagation = 'stop-propagation';
const on = 'on';
const ifMatches = 'if-matches';
const valueProps = 'value-props';
const cascadeDown = 'cascade-down';
const defaultTagName_addEventListener = 'add-event-listener';
const canonicalTagName_XtalInCurry = 'xtal-in-curry';
class AddEventListener extends XtalCustomEvent {
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
    get cascadeDown() {
        return this.getAttribute(cascadeDown);
    }
    set cascadeDown(val) {
        this.setAttribute(cascadeDown, val);
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
                this.propagateDown();
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
                if (subscriber._zoomedDetail) {
                    eventObj.context = subscriber._zoomedDetail;
                }
                if (values) {
                    if (hasMultipleValues) {
                        eventObj.values = values;
                    }
                    else {
                        eventObj.value = values;
                    }
                }
                subscriber.detail = eventObj;
            }
            else {
                subscriber.detail = subscriber._zoomedDetail;
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
})();  
    