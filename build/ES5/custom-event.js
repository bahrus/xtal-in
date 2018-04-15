var defaultTagName="custom-event",canonicalTagName="xtal-in-detail",bubbles="bubbles",composed="composed",dispatch="dispatch",disabled="disabled",detail="detail",event_name="event-name",debounce_duration="debounce-duration",zoom_in="zoom-in",zoom_out="zoom-out";export function debounce(a,b,c){var d;return function(){var e=this,f=arguments,g=c&&!d;clearTimeout(d),d=setTimeout(function later(){d=null,c||a.apply(e,f)},b),g&&a.apply(e,f)}}export var XtalCustomEvent=function(a){function b(){var a;return babelHelpers.classCallCheck(this,b),a=babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments)),a._debounceDuration=0,a}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:"zoomInObject",value:function zoomInObject(a){if(!this.zoomIn)return a;for(var b,c=a,d=this.zoomIn.split("."),e=0,f=d.length;e<f;e++)if(b=d[e],c=c[b],!c)return null;return c}},{key:"zoomOutObject",value:function zoomOutObject(a){if(!this.zoomOut)return a;var b=a;return this.zoomOut.split(".").forEach(function(){b={token:b}}),b}},{key:"zoom",value:function zoom(a){return null===a?a:this.zoomInObject(this.zoomOutObject(a))}},{key:"setValue",value:function setValue(a){this._value=a;var b=new CustomEvent("value-changed",{detail:{value:a},bubbles:!0,composed:!1});this.dispatchEvent(b)}},{key:"onPropsChange",value:function onPropsChange(){this._dispatch&&this._detail&&this.eventName&&!this.disabled&&(this._debounceFunction?this._debounceFunction():this.emitEvent())}},{key:"emitEvent",value:function emitEvent(){var a=new CustomEvent(this.eventName,{detail:this._zoomedDetail,bubbles:this.bubbles,composed:this.composed});this.dispatchEvent(a),!this._isSubClass&&a.detail&&this.setValue(a.detail.value,a)}},{key:"_upgradeProperties",value:function _upgradeProperties(a){var b=this;a.forEach(function(a){if(b.hasOwnProperty(a)){var c=b[a];delete b[a],b[a]=c}})}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties(b.observedAttributes.map(function(a){return snakeToCamel(a)}))}},{key:"attributeChangedCallback",value:function attributeChangedCallback(a,b,c){var d=this;a===bubbles||a===dispatch||a===composed||a===disabled?this["_"+snakeToCamel(a)]=null!==c:a===detail?this._detail=this.zoom(JSON.parse(c)):a===debounce_duration?(this._debounceDuration=parseFloat(c),0<this._debounceDuration&&(this._debounceFunction=debounce(function(){d.emitEvent()},this._debounceDuration))):void 0,this.onPropsChange()}},{key:"bubbles",get:function get(){return this._bubbles},set:function set(a){a?this.setAttribute(bubbles,""):this.removeAttribute(bubbles)}},{key:"composed",get:function get(){return this._composed},set:function set(a){a?this.setAttribute(composed,""):this.removeAttribute(composed)}},{key:"disabled",get:function get(){return this._disabled||this.hasAttribute(disabled)},set:function set(a){a?this.setAttribute(disabled,""):this.removeAttribute(disabled)}},{key:"dispatch",get:function get(){return this._dispatch},set:function set(a){a?this.setAttribute(dispatch,""):this.removeAttribute(dispatch)}},{key:"detail",get:function get(){return this._detail},set:function set(a){this._detail=a,this._zoomedDetail=this.zoom(this._detail),this.onPropsChange()}},{key:"debounceDuration",get:function get(){return this._debounceDuration},set:function set(a){this.setAttribute(debounce_duration,a.toString())}},{key:"eventName",get:function get(){return this.getAttribute(event_name)},set:function set(a){this.setAttribute(event_name,a)}},{key:"zoomIn",get:function get(){return this.getAttribute(zoom_in)},set:function set(a){this.setAttribute(zoom_in,a)}},{key:"zoomOut",get:function get(){return this.getAttribute(zoom_out)},set:function set(a){this.setAttribute(zoom_out,a)}},{key:"value",get:function get(){return this._value}}],[{key:"observedAttributes",get:function get(){return[bubbles,composed,dispatch,detail,event_name,debounce_duration,zoom_in,zoom_out]}}]),b}(babelHelpers.wrapNativeSuper(HTMLElement));export function registerTagName(a,b){var c=document.head;if(c){var d="xtalIn"+snakeToCamel(a)+"Alias",e=a,f=c.dataset[d];f&&(e=f),customElements.define(e,b)}}export function snakeToCamel(a){return a.replace(/(\-\w)/g,function(a){return a[1].toUpperCase()})}if(!customElements.get(canonicalTagName)){registerTagName("custom-event",XtalCustomEvent);var XtalInDetail=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),b}(XtalCustomEvent);customElements.define(canonicalTagName,XtalInDetail)}