import { define } from "./node_modules/xtal-latx/define.js";
import { observeCssSelector } from "./node_modules/xtal-latx/observeCssSelector.js";
export var XtalIn =
/*#__PURE__*/
function (_observeCssSelector) {
  babelHelpers.inherits(XtalIn, _observeCssSelector);

  function XtalIn() {
    babelHelpers.classCallCheck(this, XtalIn);
    return babelHelpers.possibleConstructorReturn(this, (XtalIn.__proto__ || Object.getPrototypeOf(XtalIn)).apply(this, arguments));
  }

  babelHelpers.createClass(XtalIn, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.style.display = 'none';
      this._conn = true;
      this.onPropsChange(); //this._syncRangedb =  debounce((srp) => this.syncRange(srp), 50);
    }
  }, {
    key: "insertListener",
    value: function insertListener(e) {
      var _this = this;

      if (e.animationName === XtalIn.is) {
        var target = e.target;
        setTimeout(function () {
          _this.addWatch(target);
        }, 0);
      }
    }
  }, {
    key: "onPropsChange",
    value: function onPropsChange() {
      if (!this._conn) return;
      this.addCSSListener(XtalIn.is, "[data-dispatch-on]", this.insertListener);
    }
  }, {
    key: "toLHSRHS",
    value: function toLHSRHS(s) {
      var pos = s.indexOf(':');
      return {
        lhs: s.substr(0, pos),
        rhs: s.substr(pos + 1)
      };
    }
  }, {
    key: "_hndEv",
    value: function _hndEv(e) {
      var ct = e.currentTarget || e.target;
      var eRules = ct.__xtlinRules[e.type];
      eRules.forEach(function (rule) {
        if (!rule.noblock) e.stopPropagation();
        var evt = new CustomEvent(rule.type, {
          bubbles: rule.bubbles,
          composed: rule.composed,
          detail: e.detail
        });
        ct.dispatchEvent(evt);
      });
    }
  }, {
    key: "addWatch",
    value: function addWatch(target) {
      var _this2 = this;

      var attr = target.dataset.dispatchOn;
      var rules = {};
      var rule;
      attr.split(' ').forEach(function (tkn) {
        var token = tkn.trim();

        if (token.endsWith(':')) {
          var evtName = token.substr(0, token.length - 1);
          if (!rules[evtName]) rules[evtName] = [];
          rule = {};
          rules[evtName].push(rule);
        } else {
          if (token.startsWith('if(')) {
            rule.if = token.substring(3, token.length - 1);
          } else {
            switch (token) {
              case 'bubbles':
              case 'composed':
              case 'noblock':
                rule[token] = true;
                break;

              default:
                if (token.startsWith('if(')) {
                  rule.if = token.substring(3, token.length - 1);
                } else {
                  var lhsRHS = _this2.toLHSRHS(token);

                  switch (lhsRHS.lhs) {
                    case 'type':
                      rule.type = lhsRHS.rhs;
                      break;
                  }
                }

            }
          }
        }
      });
      target.__xtlinRules = rules;

      for (var t in rules) {
        target.addEventListener(t, this._hndEv);
      }
    }
  }], [{
    key: "is",
    get: function get() {
      return 'xtal-in';
    }
  }]);
  return XtalIn;
}(observeCssSelector(HTMLElement));
define(XtalIn); //# sourceMappingURL=xtal-in.js.map