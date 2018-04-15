import{XtalCustomEvent,registerTagName}from"./custom-event.js";var defaultTagName_xtal_in_children="observe-children",canonicalTagName_xtal_in_children="xtal-in-children",watchSubtree="watch-subtree",ObserveChildren=function(a){function b(){var a;return babelHelpers.classCallCheck(this,b),a=babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this)),a._mutationCount=0,a._isSubClass=!0,a}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:"attributeChangedCallback",value:function attributeChangedCallback(a,c,d){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),"attributeChangedCallback",this).call(this,a,c,d),a===watchSubtree?(this._watchSubtree=null!==d,this.disconnect(),this.addMutationObserver()):void 0}},{key:"disconnect",value:function disconnect(){this._observer&&this._observer.disconnect()}},{key:"addMutationObserver",value:function addMutationObserver(){var a=this,b={childList:!0,subtree:this._watchSubtree};this._observer=new MutationObserver(function(b){a.detail=b,a._mutationCount++,a.setValue(a._mutationCount,null)}),this.setValue(this._mutationCount,null),this._observer.observe(this.parentElement,b)}},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),"connectedCallback",this).call(this),this.disconnect(),this.addMutationObserver()}},{key:"disconnedCallback",value:function disconnedCallback(){this.disconnect()}},{key:"watchSubtree",get:function get(){return this.hasAttribute(watchSubtree)},set:function set(a){a?this.setAttribute(watchSubtree,""):this.removeAttribute(watchSubtree)}}],[{key:"observedAttributes",get:function get(){return babelHelpers.get(b.__proto__||Object.getPrototypeOf(b),"observedAttributes",this).concat([watchSubtree])}}]),b}(XtalCustomEvent);registerTagName("observe-children",ObserveChildren);var XtalInChildren=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),b}(ObserveChildren);customElements.define(canonicalTagName_xtal_in_children,XtalInChildren);