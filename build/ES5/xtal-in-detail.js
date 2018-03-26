//const t = (document.currentScript as HTMLScriptElement).dataset.as;
//const tagName = t ? t : 'xtal-in-detail'; 
var defaultTagName = 'xtal-in-detail';
var bubbles = 'bubbles';
var composed = 'composed';
var dispatch = 'dispatch';
var detail = 'detail';
var event_name = 'event-name';
export var XtalInDetail = function (_HTMLElement) {
    babelHelpers.inherits(XtalInDetail, _HTMLElement);

    function XtalInDetail() {
        babelHelpers.classCallCheck(this, XtalInDetail);
        return babelHelpers.possibleConstructorReturn(this, (XtalInDetail.__proto__ || Object.getPrototypeOf(XtalInDetail)).apply(this, arguments));
    }

    babelHelpers.createClass(XtalInDetail, [{
        key: 'onPropsChange',

        // get href(){
        //     return this.getAttribute(href);
        // }
        // set href(val: string){
        //     this.setAttribute(href, val);
        // }
        value: function onPropsChange() {
            if (!this._dispatch || !this._detail || !this.eventName) return;
            this.emitEvent();
        }
    }, {
        key: 'emitEvent',
        value: function emitEvent() {
            var newEvent = new CustomEvent(this.eventName, {
                detail: this.detail,
                bubbles: this.bubbles,
                composed: this.composed
            });
            this.dispatchEvent(newEvent);
        }
    }, {
        key: '_upgradeProperties',
        value: function _upgradeProperties(props) {
            var _this2 = this;

            props.forEach(function (prop) {
                if (_this2.hasOwnProperty(prop)) {
                    var value = _this2[prop];
                    delete _this2[prop];
                    _this2[prop] = value;
                }
            });
        }
    }, {
        key: 'snakeToCamel',
        value: function snakeToCamel(s) {
            return s.replace(/(\-\w)/g, function (m) {
                return m[1].toUpperCase();
            });
        }
    }, {
        key: 'connectedCallback',
        value: function connectedCallback() {
            var _this3 = this;

            this._upgradeProperties(XtalInDetail.observedAttributes.map(function (attrib) {
                return _this3.snakeToCamel(attrib);
            }));
        }
    }, {
        key: 'attributeChangedCallback',
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
        key: 'bubbles',
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
        key: 'composed',
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
        key: 'dispatch',
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
        key: 'detail',
        get: function get() {
            return this._detail;
        },
        set: function set(val) {
            this._detail = val;
            this.onPropsChange();
        }
    }, {
        key: 'eventName',
        get: function get() {
            return this.getAttribute(event_name);
        },
        set: function set(val) {
            this.setAttribute(event_name, val);
        }
    }], [{
        key: 'observedAttributes',
        get: function get() {
            return [bubbles, composed, dispatch, detail, event_name];
        }
    }]);
    return XtalInDetail;
}(HTMLElement);
function registerTagNameForRealz(defaultTagName, cls) {
    // const scTagName = 'npm_xtal_in_' +  defaultTagName.split('-').join('_');
    var tagName = defaultTagName;
    // const linkRef = self[scTagName] as HTMLLinkElement;
    // if(linkRef && linkRef.dataset.as){
    //     tagName = linkRef.dataset.as;
    // }
    var was = document.head.querySelector('[data-was="' + defaultTagName + '"][data-package="npm.xtal-in"]');
    if (was) {
        var is = was.dataset.is;
        if (is) tagName = is;
    }
    if (customElements.get(tagName)) return;
    customElements.define(tagName, cls);
}
export function registerTagName(defaultTagName, cls) {
    if (document.readyState !== "loading") {
        registerTagNameForRealz(defaultTagName, cls);
    } else {
        document.addEventListener("DOMContentLoaded", function (e) {
            registerTagNameForRealz(defaultTagName, cls);
        });
    }
}
registerTagName(defaultTagName, XtalInDetail);
// })();
//# sourceMappingURL=xtal-in-detail.js.map