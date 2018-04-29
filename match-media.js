import { XtalCustomEvent, registerTagName } from './custom-event.js';
const mediaQueryString = 'media-query-string';
const canonicalTagName_XtalInMedia = 'xtal-in-media';
const matchesMediaQuery = 'matches-media-query';
class MatchMedia extends XtalCustomEvent {
    static get is() { return 'match-media'; }
    get mediaQueryString() {
        return this._mediaQueryString;
    }
    set mediaQueryString(val) {
        this.setAttribute(mediaQueryString, val);
    }
    static get observedAttributes() {
        return [
            mediaQueryString,
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case mediaQueryString:
                this.disconnect();
                this._mediaQueryString = newValue;
                if (newValue !== null) {
                    this._mql = window.matchMedia(this._mediaQueryString);
                    this._boundMediaQueryHandler = this.handleMediaQueryChange.bind(this);
                    this.connect();
                }
        }
    }
    connect() {
        this._mql.addListener(this._boundMediaQueryHandler);
    }
    disconnect() {
        if (this._mql)
            this._mql.removeListener(this._boundMediaQueryHandler);
    }
    handleMediaQueryChange(e) {
        if (e.matches) {
            this.setAttribute(matchesMediaQuery, '');
        }
        else {
            this.removeAttribute(matchesMediaQuery);
        }
        this.detail = e;
        this.setResult(e.matches, null);
    }
    connectedCallback() {
        this._upgradeProperties(['mediaQueryString']);
    }
    disconnectedCallback() {
        this.disconnect();
    }
}
if (!customElements.get(canonicalTagName_XtalInMedia)) {
    registerTagName(MatchMedia.is, MatchMedia);
    class XtalInMedia extends MatchMedia {
    }
    customElements.define(canonicalTagName_XtalInMedia, XtalInMedia);
}
//# sourceMappingURL=match-media.js.map