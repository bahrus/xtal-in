import { XtalInDetail, registerTagName } from './xtal-in-detail.js';
//const href = 'href';
////const resolvedUrl = 'resolved-url';
var stopPropagation = 'stop-propagation';
//const fileName = 'file-name';
var on = 'on';
var ifMatches = 'if-matches';
//const t = (document.currentScript as HTMLScriptElement).dataset.as;
//const tagName = t ? t : 'add-event-listener';
var defaultTagName = 'add-event-listener';
var canonicalTagName = 'xtal-in-curry';

var AddEventListener = function (_XtalInDetail) {
    babelHelpers.inherits(AddEventListener, _XtalInDetail);

    function AddEventListener() {
        babelHelpers.classCallCheck(this, AddEventListener);
        return babelHelpers.possibleConstructorReturn(this, (AddEventListener.__proto__ || Object.getPrototypeOf(AddEventListener)).apply(this, arguments));
    }

    babelHelpers.createClass(AddEventListener, [{
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(name, oldValue, newValue) {
            babelHelpers.get(AddEventListener.prototype.__proto__ || Object.getPrototypeOf(AddEventListener.prototype), 'attributeChangedCallback', this).call(this, name, oldValue, newValue);
            switch (name) {
                // case href:
                //     this._href = newValue;
                //     break;
                case stopPropagation:
                    this._stopPropagation = newValue !== null;
                    break;
                case ifMatches:
                    this._ifMatches = newValue;
                    break;
                case on:
                    this._on = newValue;
                    var parent = this.parentElement;
                    var bundledAllHandlers = parent[canonicalTagName];
                    if (this._on) {
                        if (!bundledAllHandlers) {
                            bundledAllHandlers = parent[canonicalTagName] = {};
                        }
                        var bundledHandlersForSingleEventType = bundledAllHandlers[this._on];
                        if (!bundledHandlersForSingleEventType) {
                            bundledHandlersForSingleEventType = bundledAllHandlers[this._on] = [];
                            this.parentElement.addEventListener(this._on, this.handleEvent);
                        }
                        bundledHandlersForSingleEventType.push(this);
                        //this._boundHandleEvent = this.handleEvent.bind(this);
                        //this.parentElement.addEventListener(this._on, this._boundHandleEvent);
                    } else {
                        this.disconnect();
                    }
                    break;
            }
        }
        //_boundHandleEvent;

    }, {
        key: 'handleEvent',
        value: function handleEvent(e) {
            var _this3 = this;

            var bundledHandlers = this['xtal-in-curry'][e.type];
            bundledHandlers.forEach(function (_this) {
                if (_this._ifMatches) {
                    if (!e.target.matches(_this._ifMatches)) return;
                }
                if (_this.stopPropagation) e.stopPropagation();
                if (_this.detailFn) {
                    _this.detail = _this.detailFn(e, _this3);
                } else {
                    _this.detail = {};
                }
            });
            //this.dispatch = true;
            // window.requestAnimationFrame(() => {
            //     this.dispatch = false;
            // })
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            this.parentElement.removeEventListener(this._on, this.handleEvent);
        }
    }, {
        key: 'connectedCallback',
        value: function connectedCallback() {
            babelHelpers.get(AddEventListener.prototype.__proto__ || Object.getPrototypeOf(AddEventListener.prototype), 'connectedCallback', this).call(this);
            this._upgradeProperties(['on', 'stopPropagation', 'detailFn']);
        }
    }, {
        key: 'disconnectedCallback',
        value: function disconnectedCallback() {
            babelHelpers.get(AddEventListener.prototype.__proto__ || Object.getPrototypeOf(AddEventListener.prototype), 'connectedCallback', this).call(this);
            this.disconnect();
        }
    }, {
        key: 'detailFn',
        get: function get() {
            return this._detailFn;
        },
        set: function set(val) {
            this._detailFn = val;
        }
    }, {
        key: 'stopPropagation',
        get: function get() {
            return this._stopPropagation;
        },
        set: function set(val) {
            if (val) {
                this.setAttribute(stopPropagation, '');
            } else {
                this.removeAttribute(stopPropagation);
            }
        }
    }, {
        key: 'on',
        get: function get() {
            return this._on;
        },
        set: function set(val) {
            this.setAttribute(on, val);
        }
    }, {
        key: 'ifMatches',
        get: function get() {
            return this._ifMatches;
        },
        set: function set(val) {
            this.setAttribute(ifMatches, val);
        }
    }], [{
        key: 'observedAttributes',
        get: function get() {
            return babelHelpers.get(AddEventListener.__proto__ || Object.getPrototypeOf(AddEventListener), 'observedAttributes', this).concat([stopPropagation, on, ifMatches]);
        }
    }]);
    return AddEventListener;
}(XtalInDetail);

registerTagName(defaultTagName, AddEventListener);

var XtalInCurry = function (_AddEventListener) {
    babelHelpers.inherits(XtalInCurry, _AddEventListener);

    function XtalInCurry() {
        babelHelpers.classCallCheck(this, XtalInCurry);
        return babelHelpers.possibleConstructorReturn(this, (XtalInCurry.__proto__ || Object.getPrototypeOf(XtalInCurry)).apply(this, arguments));
    }

    return XtalInCurry;
}(AddEventListener);

customElements.define(canonicalTagName, XtalInCurry);
//# sourceMappingURL=add-event-listener.js.map