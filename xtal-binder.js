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
        const config = { childList: true, subtree: true };
        this._observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    this.cascade(this._lastEvent, node);
                });
            });
        });
        this._observer.observe(this.parentElement, config);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._observer)
            this._observer.disconnect();
    }
    parsePassTo() {
        // const iPosOfOpenBrace = this._passTo.lastIndexOf('{');
        // if(iPosOfOpenBrace < 0) return;
        this.cssKeyMappers = [];
        const endsWithBrace = this._passTo.endsWith('}');
        const adjustedPassTo = this._passTo + (endsWithBrace ? ';' : '');
        const splitPassTo = adjustedPassTo.split('};');
        splitPassTo.forEach(passTo => {
            const splitPassTo2 = passTo.split('{');
            const tokens = splitPassTo2[1].split(';');
            const propMapper = {};
            tokens.forEach(token => {
                const nameValuePair = token.split(':');
                propMapper[nameValuePair[0]] = nameValuePair[1].split('.');
            });
            this.cssKeyMappers.push({
                cssSelector: splitPassTo2[0],
                propMapper: propMapper
            });
        });
        // this._cssSelector = this._passTo.substr(0, iPosOfOpenBrace);
        // const propMapperString = this._passTo.substring(iPosOfOpenBrace + 1, this._passTo.length - 1);
    }
    setResult(val, e) {
        super.setResult(val, e);
        this._lastEvent = e;
        this.cascade(e, this.parentElement);
    }
    // handleEvent(e: Event) {
    // }
    cascade(e, refElement) {
        if (!this.cssKeyMappers)
            return;
        this.cssKeyMappers.forEach(cssKeyMapper => {
            this.qsa(cssKeyMapper.cssSelector, refElement).forEach(target => {
                for (var key in cssKeyMapper.propMapper) {
                    const pathSelector = cssKeyMapper.propMapper[key];
                    let context = e;
                    pathSelector.forEach(path => {
                        if (context)
                            context = context[path];
                    });
                    target[key] = context;
                }
            });
        });
    }
}
if (!customElements.get(XtalBinder.is)) {
    customElements.define(XtalBinder.is, XtalBinder);
}
//# sourceMappingURL=xtal-binder.js.map