import { XtalInDetail, registerTagName } from './xtal-in-detail.js';
var defaultTagName = 'observe-attributes';
var canonicalTagName = 'xtal-in-attributes';
var filter = 'filter';

var ObserveAttributes = function (_XtalInDetail) {
    babelHelpers.inherits(ObserveAttributes, _XtalInDetail);

    function ObserveAttributes() {
        babelHelpers.classCallCheck(this, ObserveAttributes);
        return babelHelpers.possibleConstructorReturn(this, (ObserveAttributes.__proto__ || Object.getPrototypeOf(ObserveAttributes)).apply(this, arguments));
    }

    babelHelpers.createClass(ObserveAttributes, [{
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(name, oldValue, newValue) {
            babelHelpers.get(ObserveAttributes.prototype.__proto__ || Object.getPrototypeOf(ObserveAttributes.prototype), 'attributeChangedCallback', this).call(this, name, oldValue, newValue);
            switch (name) {
                case filter:
                    this._filter = JSON.parse(newValue);
                    break;
            }
        }
    }, {
        key: 'addMutationObserver',
        value: function addMutationObserver() {
            var _this2 = this;

            this.disconnect();
            if (!this._child) return;
            var config = { attributes: true, attributeFilter: this._filter };
            this._observer = new MutationObserver(function (mutationsList) {
                mutationsList.forEach(function (mutation) {
                    _this2.detail = {
                        mutation: mutation
                    };
                });
            });
            this._observer.observe(this._child, config);
        }
    }, {
        key: 'getChild',
        value: function getChild() {
            var _this3 = this;

            switch (this.childElementCount) {
                case 0:
                    setTimeout(function () {
                        _this3.getChild();
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
    }, {
        key: 'disconnect',
        value: function disconnect() {
            if (this._observer) this._observer.disconnect();
        }
    }, {
        key: 'connectedCallback',
        value: function connectedCallback() {
            babelHelpers.get(ObserveAttributes.prototype.__proto__ || Object.getPrototypeOf(ObserveAttributes.prototype), 'connectedCallback', this).call(this);
            this._upgradeProperties([filter]);
            this.getChild();
        }
    }, {
        key: 'filter',
        get: function get() {
            return this._filter;
        },
        set: function set(val) {
            this.setAttribute(filter, JSON.stringify(val));
        }
    }], [{
        key: 'observedAttributes',
        get: function get() {
            return babelHelpers.get(ObserveAttributes.__proto__ || Object.getPrototypeOf(ObserveAttributes), 'observedAttributes', this).concat([filter]);
        }
    }]);
    return ObserveAttributes;
}(XtalInDetail);

registerTagName(defaultTagName, ObserveAttributes);

var XtalInAttributes = function (_ObserveAttributes) {
    babelHelpers.inherits(XtalInAttributes, _ObserveAttributes);

    function XtalInAttributes() {
        babelHelpers.classCallCheck(this, XtalInAttributes);
        return babelHelpers.possibleConstructorReturn(this, (XtalInAttributes.__proto__ || Object.getPrototypeOf(XtalInAttributes)).apply(this, arguments));
    }

    return XtalInAttributes;
}(ObserveAttributes);

customElements.define(canonicalTagName, XtalInAttributes);
//# sourceMappingURL=observe-attributes.js.map