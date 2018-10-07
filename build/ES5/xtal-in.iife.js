//@ts-check
(function () {
  function define(custEl) {
    var tagName = custEl.is;

    if (customElements.get(tagName)) {
      console.warn('Already registered ' + tagName);
      return;
    }

    customElements.define(tagName, custEl);
  }

  function getHost(el) {
    var parent = el;

    while (parent = parent.parentNode) {
      if (parent.nodeType === 11) {
        return parent['host'];
      } else if (parent.tagName === 'BODY') {
        return null;
      }
    }

    return null;
  }

  function observeCssSelector(superClass) {
    var eventNames = ["animationstart", "MSAnimationStart", "webkitAnimationStart"];
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          babelHelpers.classCallCheck(this, _class);
          return babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        babelHelpers.createClass(_class, [{
          key: "addCSSListener",
          value: function addCSSListener(id, targetSelector, insertListener) {
            var _this = this;

            // See https://davidwalsh.name/detect-node-insertion
            if (this._boundInsertListener) return;
            var styleInner =
            /* css */
            "\n            @keyframes ".concat(id, " {\n                from {\n                    opacity: 0.99;\n                }\n                to {\n                    opacity: 1;\n                }\n            }\n    \n            ").concat(targetSelector, "{\n                animation-duration: 0.001s;\n                animation-name: ").concat(id, ";\n            }\n            ");
            var style = document.createElement('style');
            style.innerHTML = styleInner;
            var host = getHost(this);

            if (host !== null) {
              host.shadowRoot.appendChild(style);
            } else {
              document.body.appendChild(style);
            }

            this._boundInsertListener = insertListener.bind(this);
            var container = host ? host.shadowRoot : document;
            eventNames.forEach(function (name) {
              container.addEventListener(name, _this._boundInsertListener, false);
            }); // container.addEventListener("animationstart", this._boundInsertListener, false); // standard + firefox
            // container.addEventListener("MSAnimationStart", this._boundInsertListener, false); // IE
            // container.addEventListener("webkitAnimationStart", this._boundInsertListener, false); // Chrome + Safari
          }
        }, {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            var _this2 = this;

            if (this._boundInsertListener) {
              var host = getHost(this);
              var container = host ? host.shadowRoot : document;
              eventNames.forEach(function (name) {
                container.removeEventListener(name, _this2._boundInsertListener);
              }); // document.removeEventListener("animationstart", this._boundInsertListener); // standard + firefox
              // document.removeEventListener("MSAnimationStart", this._boundInsertListener); // IE
              // document.removeEventListener("webkitAnimationStart", this._boundInsertListener); // Chrome + Safari
            }

            if (babelHelpers.get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "disconnectedCallback", this) !== undefined) babelHelpers.get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "disconnectedCallback", this).call(this);
          }
        }]);
        return _class;
      }(superClass)
    );
  }

  var XtalIn =
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
        var _this3 = this;

        if (e.animationName === XtalIn.is) {
          var target = e.target;
          setTimeout(function () {
            _this3.addWatch(target);
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
        var _this4 = this;

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
                    var lhsRHS = _this4.toLHSRHS(token);

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

  define(XtalIn);
})();