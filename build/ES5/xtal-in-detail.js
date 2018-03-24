define(["require", "exports"], function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    // (function () {
    var tagName = 'xtal-in-detail';
    var bubbles = 'bubbles';
    var composed = 'composed';
    var dispatch = 'dispatch';
    var detail = 'detail';
    var event_name = 'event-name';
    //const href = 'href';

    var XtalInDetail = function (_HTMLElement) {
        babelHelpers.inherits(XtalInDetail, _HTMLElement);

        function XtalInDetail() {
            babelHelpers.classCallCheck(this, XtalInDetail);
            return babelHelpers.possibleConstructorReturn(this, (XtalInDetail.__proto__ || Object.getPrototypeOf(XtalInDetail)).apply(this, arguments));
        }

        babelHelpers.createClass(XtalInDetail, [{
            key: "onPropsChange",

            // get href(){
            //     return this.getAttribute(href);
            // }
            // set href(val: string){
            //     this.setAttribute(href, val);
            // }
            value: function onPropsChange() {
                if (!this.dispatch || !this._detail || !this.eventName) return;
                this.emitEvent();
            }
        }, {
            key: "emitEvent",
            value: function emitEvent() {
                var newEvent = new CustomEvent(this.eventName, {
                    detail: this.detail,
                    bubbles: this.bubbles,
                    composed: this.composed
                });
                this.dispatchEvent(newEvent);
            }
        }, {
            key: "_upgradeProperty",
            value: function _upgradeProperty(prop) {
                if (this.hasOwnProperty(prop)) {
                    var value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            }
        }, {
            key: "snakeToCamel",
            value: function snakeToCamel(s) {
                return s.replace(/(\-\w)/g, function (m) {
                    return m[1].toUpperCase();
                });
            }
        }, {
            key: "connectedCallback",
            value: function connectedCallback() {
                var _this2 = this;

                XtalInDetail.observedAttributes.forEach(function (attrib) {
                    _this2._upgradeProperty(_this2.snakeToCamel(attrib));
                });
            }
        }, {
            key: "attributeChangedCallback",
            value: function attributeChangedCallback(name, oldValue, newValue) {
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
                }
                this.onPropsChange();
            }
        }, {
            key: "bubbles",
            get: function get() {
                return this._bubbles;
            },
            set: function set(val) {
                if (val) {
                    this.setAttribute(bubbles, '');
                } else {
                    this.removeAttribute(bubbles);
                }
            }
        }, {
            key: "composed",
            get: function get() {
                return this._composed;
            },
            set: function set(val) {
                if (val) {
                    this.setAttribute(composed, '');
                } else {
                    this.removeAttribute(composed);
                }
            }
        }, {
            key: "dispatch",
            get: function get() {
                return this._dispatch;
            },
            set: function set(val) {
                if (val) {
                    this.setAttribute(dispatch, '');
                } else {
                    this.removeAttribute(dispatch);
                }
            }
        }, {
            key: "detail",
            get: function get() {
                return this._detail;
            },
            set: function set(val) {
                this._detail = val;
                this.onPropsChange();
            }
        }, {
            key: "eventName",
            get: function get() {
                return this.getAttribute(event_name);
            },
            set: function set(val) {
                this.setAttribute(event_name, val);
            }
        }], [{
            key: "observedAttributes",
            get: function get() {
                return [bubbles, composed, dispatch, detail, event_name];
            }
        }]);
        return XtalInDetail;
    }(HTMLElement);

    exports.XtalInDetail = XtalInDetail;
    if (customElements.get(tagName)) {
        customElements.define(tagName, XtalInDetail);
    }
});
// })();
//# sourceMappingURL=xtal-in-detail.js.map