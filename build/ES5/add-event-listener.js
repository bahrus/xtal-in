import{XtalCustomEvent,registerTagName}from'./custom-event.js';var stopPropagation='stop-propagation',on='on',ifMatches='if-matches',valueProps='value-props',defaultTagName='add-event-listener',canonicalTagName='xtal-in-curry',AddEventListener=function(a){function b(){babelHelpers.classCallCheck(this,b);var a=babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return a._isSubClass=!0,a}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'attributeChangedCallback',value:function attributeChangedCallback(a,c,d){switch(babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'attributeChangedCallback',this).call(this,a,c,d),a){case stopPropagation:this._stopPropagation=null!==d;break;case valueProps:this._valueProps=null===d?null:d.startsWith('[')?JSON.parse(d):d;case ifMatches:this._ifMatches=d;break;case on:this._on=d;var e=this.parentElement,f=e[canonicalTagName];if(this._on){f||(f=e[canonicalTagName]={});var g=f[this._on];g||(g=f[this._on]=[],this.parentElement.addEventListener(this._on,this.handleEvent)),g.push(this)}else this.disconnect();}}},{key:'handleEvent',value:function handleEvent(a){var b=this,c=this['xtal-in-curry'][a.type];c.forEach(function(c){var d=a.target;if(!c._ifMatches||d.matches(c._ifMatches)){c.stopPropagation&&a.stopPropagation();var e,f={context:c.detail};b._valueProps&&(Array.isArray(b._valueProps)?(e={},b._valueProps.forEach(function(a){e[a]=d[a]})):e=d[b._valueProps],f.values=e),c.detail=f,c.setValue(e)}})}},{key:'removeElement',value:function removeElement(a,b){var c=a.indexOf(b);-1!==c&&a.splice(c,1)}},{key:'disconnect',value:function disconnect(){var a=this.parentElement,b=a[canonicalTagName],c=b[this._on];this.removeElement(c,this),0===c.length&&this.parentElement.removeEventListener(this._on,this.handleEvent)}},{key:'connectedCallback',value:function connectedCallback(){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'connectedCallback',this).call(this),this._upgradeProperties(['on','stopPropagation','valueProps'])}},{key:'disconnectedCallback',value:function disconnectedCallback(){this.disconnect()}},{key:'stopPropagation',get:function get(){return this._stopPropagation},set:function set(a){a?this.setAttribute(stopPropagation,''):this.removeAttribute(stopPropagation)}},{key:'on',get:function get(){return this._on},set:function set(a){this.setAttribute(on,a)}},{key:'ifMatches',get:function get(){return this._ifMatches},set:function set(a){this.setAttribute(ifMatches,a)}},{key:'valueProps',get:function get(){return this._valueProps},set:function set(a){this.setAttribute(valueProps,a.toString())}}],[{key:'observedAttributes',get:function get(){return babelHelpers.get(b.__proto__||Object.getPrototypeOf(b),'observedAttributes',this).concat([stopPropagation,on,ifMatches,valueProps])}}]),b}(XtalCustomEvent);registerTagName(defaultTagName,AddEventListener);var XtalInCurry=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),b}(AddEventListener);customElements.define(canonicalTagName,XtalInCurry);