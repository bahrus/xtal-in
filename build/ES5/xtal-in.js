(function(){function a(a,b){var c=a,d=document.head.querySelector('[data-was="'+a+'"][data-package="npm.xtal-in"]');if(d){var e=d.dataset.is;e&&(c=e)}customElements.get(c)||customElements.define(c,b)}function b(b,c){'loading'===document.readyState?document.addEventListener('DOMContentLoaded',function(){a(b,c)}):a(b,c)}var c='xtal-in-detail',d='bubbles',e='composed',f='dispatch',g='detail',h='event-name',i=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'setValue',value:function setValue(a){this._value=a;var b=new CustomEvent('value-changed',{detail:{value:a},bubbles:!0,composed:!1});this.dispatchEvent(b)}},{key:'onPropsChange',value:function onPropsChange(){this._dispatch&&this._detail&&this.eventName&&this.emitEvent()}},{key:'emitEvent',value:function emitEvent(){var a=new CustomEvent(this.eventName,{detail:this.detail,bubbles:this.bubbles,composed:this.composed});this.dispatchEvent(a),this._isSubClass||this.setValue(a.detail)}},{key:'_upgradeProperties',value:function _upgradeProperties(a){var b=this;a.forEach(function(a){if(b.hasOwnProperty(a)){var c=b[a];delete b[a],b[a]=c}})}},{key:'snakeToCamel',value:function snakeToCamel(a){return a.replace(/(\-\w)/g,function(a){return a[1].toUpperCase()})}},{key:'connectedCallback',value:function connectedCallback(){var a=this;this._upgradeProperties(b.observedAttributes.map(function(b){return a.snakeToCamel(b)}))}},{key:'attributeChangedCallback',value:function attributeChangedCallback(a,b,c){a===d||a===f||a===e?this['_'+this.snakeToCamel(a)]=null!==c:a===g?this._detail=JSON.parse(c):void 0,this.onPropsChange()}},{key:'bubbles',get:function get(){return this._bubbles},set:function set(a){a?this.setAttribute(d,''):this.removeAttribute(d)}},{key:'composed',get:function get(){return this._composed},set:function set(a){a?this.setAttribute(e,''):this.removeAttribute(e)}},{key:'dispatch',get:function get(){return this._dispatch},set:function set(a){a?this.setAttribute(f,''):this.removeAttribute(f)}},{key:'detail',get:function get(){return this._detail},set:function set(a){this._detail=a,this.onPropsChange()}},{key:'eventName',get:function get(){return this.getAttribute(h)},set:function set(a){this.setAttribute(h,a)}},{key:'value',get:function get(){return this._value}}],[{key:'observedAttributes',get:function get(){return[d,e,f,g,h]}}]),b}(HTMLElement);if(!customElements.get(c)){b('custom-event',i);var w=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),b}(i);customElements.define(c,w)}var j='filter',k=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'attributeChangedCallback',value:function attributeChangedCallback(a,c,d){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'attributeChangedCallback',this).call(this,a,c,d),a===j?this._filter=JSON.parse(d):void 0}},{key:'getValues',value:function getValues(a){var b=this,c={};return a.forEach(function(a){c[a]=b._child[a]}),c}},{key:'addMutationObserver',value:function addMutationObserver(){var a=this;if(this.disconnect(),!!this._child){var b={attributes:!0,attributeFilter:this._filter};this._observer=new MutationObserver(function(b){b.forEach(function(b){a.detail={mutation:b}});var c=a.filter?a.getValues(a.filter):a._child.attributes;a.setValue(c)}),this._observer.observe(this._child,b)}}},{key:'getChild',value:function getChild(){var a=this;switch(this.childElementCount){case 0:return void setTimeout(function(){a.getChild()},100);case 1:this._child=this.firstElementChild,this.addMutationObserver();break;default:console.error('This component only supports a single element child');}}},{key:'disconnect',value:function disconnect(){this._observer&&this._observer.disconnect()}},{key:'connectedCallback',value:function connectedCallback(){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'connectedCallback',this).call(this),this._upgradeProperties([j]),this.getChild()}},{key:'filter',get:function get(){return this._filter},set:function set(a){this.setAttribute(j,JSON.stringify(a))}}],[{key:'observedAttributes',get:function get(){return babelHelpers.get(b.__proto__||Object.getPrototypeOf(b),'observedAttributes',this).concat([j])}}]),b}(i);b('observe-attributes',k);var l=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),b}(k);customElements.define('xtal-in-attributes',l);var m='watch-subtree',n=function(a){function b(){babelHelpers.classCallCheck(this,b);var a=babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return a._mutationCount=0,a._isSubClass=!0,a}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'attributeChangedCallback',value:function attributeChangedCallback(a,c,d){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'attributeChangedCallback',this).call(this,a,c,d),a===m?(this._watchSubtree=null!==d,this.disconnect(),this.addMutationObserver()):void 0}},{key:'disconnect',value:function disconnect(){this._observer&&this._observer.disconnect()}},{key:'addMutationObserver',value:function addMutationObserver(){var a=this,b={childList:!0,subtree:this._watchSubtree};this._observer=new MutationObserver(function(b){b.forEach(function(b){a.detail={mutation:b}}),a._mutationCount++,a.setValue(a._mutationCount)}),this.detail={status:'observing'},this.setValue(this._mutationCount),this._observer.observe(this,b)}},{key:'connectedCallback',value:function connectedCallback(){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'connectedCallback',this).call(this),this.addMutationObserver()}},{key:'disconnedCallback',value:function disconnedCallback(){this.disconnect()}},{key:'watchSubtree',get:function get(){return this._watchSubtree},set:function set(a){a?this.setAttribute(m,''):this.removeAttribute(m)}}],[{key:'observedAttributes',get:function get(){return babelHelpers.get(b.__proto__||Object.getPrototypeOf(b),'observedAttributes',this).concat([m])}}]),b}(i);b('observe-children',n);var o=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),b}(n);customElements.define('xtal-in-children',o);var p='stop-propagation',q='on',r='if-matches',s='value-props',t='xtal-in-curry',u=function(a){function b(){babelHelpers.classCallCheck(this,b);var a=babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return a._isSubClass=!0,a}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'attributeChangedCallback',value:function attributeChangedCallback(a,c,d){switch(babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'attributeChangedCallback',this).call(this,a,c,d),a){case p:this._stopPropagation=null!==d;break;case s:this._valueProps=null===d?null:d.startsWith('[')?JSON.parse(d):d;case r:this._ifMatches=d;break;case q:this._on=d;var e=this.parentElement,f=e[t];if(this._on){f||(f=e[t]={});var g=f[this._on];g||(g=f[this._on]=[],this.parentElement.addEventListener(this._on,this.handleEvent)),g.push(this)}else this.disconnect();}}},{key:'handleEvent',value:function handleEvent(a){var b=this,c=this['xtal-in-curry'][a.type];c.forEach(function(c){var d=a.target;if(!c._ifMatches||d.matches(c._ifMatches)){c.stopPropagation&&a.stopPropagation();var e,f={context:c.detail};b._valueProps&&(Array.isArray(b._valueProps)?(e={},b._valueProps.forEach(function(a){e[a]=d[a]})):e=d[b._valueProps],f.values=e),c.detail=f,c.setValue(e)}})}},{key:'removeElement',value:function removeElement(a,b){var c=a.indexOf(b);-1!==c&&a.splice(c,1)}},{key:'disconnect',value:function disconnect(){var a=this.parentElement,b=a[t],c=b[this._on];this.removeElement(c,this),0===c.length&&this.parentElement.removeEventListener(this._on,this.handleEvent)}},{key:'connectedCallback',value:function connectedCallback(){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'connectedCallback',this).call(this),this._upgradeProperties(['on','stopPropagation','valueProps'])}},{key:'disconnectedCallback',value:function disconnectedCallback(){this.disconnect()}},{key:'stopPropagation',get:function get(){return this._stopPropagation},set:function set(a){a?this.setAttribute(p,''):this.removeAttribute(p)}},{key:'on',get:function get(){return this._on},set:function set(a){this.setAttribute(q,a)}},{key:'ifMatches',get:function get(){return this._ifMatches},set:function set(a){this.setAttribute(r,a)}},{key:'valueProps',get:function get(){return this._valueProps},set:function set(a){this.setAttribute(s,a.toString())}}],[{key:'observedAttributes',get:function get(){return babelHelpers.get(b.__proto__||Object.getPrototypeOf(b),'observedAttributes',this).concat([p,q,r,s])}}]),b}(i);b('add-event-listener',u);var v=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),b}(u);customElements.define(t,v)})();