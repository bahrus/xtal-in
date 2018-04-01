
export interface IXtalInDetailProperties {
    bubbles: boolean,
    composed: boolean,
    dispatch: boolean,
    detail: any,
    eventName: string,
    value: any,
    debounceDuration: number,
}

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
export function debounce(func, wait, immediate?) {
    var timeout;
  
    return function executedFunction() {
      var context = this;
      var args = arguments;
          
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
  
      var callNow = immediate && !timeout;
      
      clearTimeout(timeout);
  
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  };


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
        this._zoomedDetail = this.zoom(this._detail);
        this.onPropsChange();
    }
    _zoomedDetail: any;
    _debounceFunction;
    _debounceDuration: number = 0;
    get debounceDuration(){
        return this._debounceDuration;
    }
    set debounceDuration(val){
        this.setAttribute(debounce_duration, val.toString());
    }

    get eventName() {
        return this.getAttribute(event_name);
    }
    set eventName(val: string) {
        this.setAttribute(event_name, val);
    }

    get zoomIn(){
        return this.getAttribute(zoom_in);
    }
    set zoomIn(val){
        this.setAttribute(zoom_in, val);
    }
    get zoomOut(){
        return this.getAttribute(zoom_out);
    }
    set zoomOut(val){
        this.setAttribute(zoom_out, val);
    }
    zoomInObject(obj){
        if(!this.zoomIn) return obj;
        let returnObj = obj;
        const split = this.zoomIn.split('.');
        for(let i = 0, ii = split.length; i < ii; i++){
            const selector = split[i];
            returnObj = returnObj[selector];
            if(!returnObj) return null;
        }
        return returnObj;
    }
    zoomOutObject(obj){
        if(!this.zoomOut) return obj;
        let returnObj = obj;
        this.zoomOut.split('.').forEach(token =>{
            returnObj = {
                token: returnObj
            }
        })
        return returnObj;
    }
    zoom(obj){
        if(obj === null) return obj;
        return this.zoomInObject(this.zoomOutObject(obj));
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
        if(this._debounceFunction){
            this._debounceFunction();
        }else{
            this.emitEvent();
        }
        
    }

    emitEvent() {
        const newEvent = new CustomEvent(this.eventName, {
            detail: this._zoomedDetail,
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
        return [bubbles, composed, dispatch, detail, event_name, debounce_duration, zoom_in, zoom_out];
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
                this._detail = this.zoom( JSON.parse(newValue));
                break;
            case debounce_duration:
                this._debounceDuration = parseFloat(newValue);
                if(this._debounceDuration > 0){
                    this._debounceFunction = debounce(() =>{
                        this.emitEvent()
                    }, this._debounceDuration)
                }
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

