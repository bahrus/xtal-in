import { AddEventListener } from './add-event-listener.js';
const passTo = 'pass-to';
class XtalBinder extends AddEventListener {
    static get is() { return 'xtal-binder'; }
    get passTo() {
        return this._passTo || this.getAttribute(passTo);
    }
    set passTo(val) {
        this.setAttribute(passTo, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([passTo]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case passTo:
                this._passTo = newValue;
                this.parsePassTo();
                break;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties(['passTo']);
    }
    parsePassTo() {
        const iPosOfOpenBrace = this._passTo.lastIndexOf('{');
        if (iPosOfOpenBrace < 0)
            return;
        this._cssSelector = this._passTo.substr(0, iPosOfOpenBrace);
        const propMapperString = this._passTo.substring(iPosOfOpenBrace + 1, this._passTo.length - 1);
        const tokens = propMapperString.split(';');
        this._propMapper = {};
        tokens.forEach(token => {
            const nameValuePair = token.split(':');
            this._propMapper[nameValuePair[0]] = nameValuePair[1].split('.');
        });
    }
    setValue(val, e) {
        super.setValue(val, e);
        this._lastEvent = e;
        this.cascade(e);
    }
    // handleEvent(e: Event) {
    // }
    cascade(e) {
        if (!this._cssSelector || !this._propMapper)
            return;
        this.qsa(this._cssSelector, this.parentElement).forEach(target => {
            for (var key in this._propMapper) {
                const pathSelector = this._propMapper[key];
                let context = e;
                pathSelector.forEach(path => {
                    if (context)
                        context = context[path];
                });
                target[key] = context;
            }
        });
    }
}
if (!customElements.get(XtalBinder.is)) {
    customElements.define(XtalBinder.is, XtalBinder);
}
//# sourceMappingURL=xtal-binder.js.map