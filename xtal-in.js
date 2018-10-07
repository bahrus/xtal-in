import { define } from 'xtal-latx/define.js';
import { observeCssSelector } from 'xtal-latx/observeCssSelector.js';
export class XtalIn extends observeCssSelector(HTMLElement) {
    static get is() { return 'xtal-in'; }
    connectedCallback() {
        this.style.display = 'none';
        this._conn = true;
        this.onPropsChange();
        //this._syncRangedb =  debounce((srp) => this.syncRange(srp), 50);
    }
    insertListener(e) {
        if (e.animationName === XtalIn.is) {
            const target = e.target;
            setTimeout(() => {
                this.addWatch(target);
            }, 0);
        }
    }
    onPropsChange() {
        if (!this._conn)
            return;
        this.addCSSListener(XtalIn.is, `[data-dispatch-on]`, this.insertListener);
    }
    toLHSRHS(s) {
        const pos = s.indexOf(':');
        return {
            lhs: s.substr(0, pos),
            rhs: s.substr(pos + 1),
        };
    }
    _hndEv(e) {
        const ct = (e.currentTarget || e.target);
        const eRules = ct.__xtlinRules[e.type];
        eRules.forEach(rule => {
            if (!rule.noblock)
                e.stopPropagation();
            const evt = new CustomEvent(rule.type, {
                bubbles: rule.bubbles,
                composed: rule.composed,
                detail: e.detail
            });
            ct.dispatchEvent(evt);
        });
    }
    addWatch(target) {
        const attr = target.dataset.dispatchOn;
        const rules = {};
        let rule;
        attr.split(' ').forEach(tkn => {
            const token = tkn.trim();
            if (token.endsWith(':')) {
                const evtName = token.substr(0, token.length - 1);
                if (!rules[evtName])
                    rules[evtName] = [];
                rule = {};
                rules[evtName].push(rule);
            }
            else {
                if (token.startsWith('if(')) {
                    rule.if = token.substring(3, token.length - 1);
                }
                else {
                    switch (token) {
                        case 'bubbles':
                        case 'composed':
                        case 'noblock':
                            rule[token] = true;
                            break;
                        default:
                            if (token.startsWith('if(')) {
                                rule.if = token.substring(3, token.length - 1);
                            }
                            else {
                                const lhsRHS = this.toLHSRHS(token);
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
}
define(XtalIn);
//# sourceMappingURL=xtal-in.js.map