define(["require", "exports", "xtal-in-detail.js"], function (require, exports, xtal_in_detail_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //const href = 'href';
    ////const resolvedUrl = 'resolved-url';
    const stopPropagation = 'stop-propagation';
    //const fileName = 'file-name';
    const on = 'on';
    const tagName = xtal_in_detail_js_1.getTagName('xtal-ize-event');
    class XtalIzeEvent extends xtal_in_detail_js_1.XtalInDetail {
        get detailFn() {
            return this._reviseDetailFn;
        }
        set detailFn(val) {
            this._reviseDetailFn = val;
        }
        get stopPropagation() {
            return this._stopPropagation;
        }
        set stopPropagation(val) {
            if (val) {
                this.setAttribute(stopPropagation, '');
            }
            else {
                this.removeAttribute(stopPropagation);
            }
        }
        get on() {
            return this._on;
        }
        set on(val) {
            this.setAttribute(on, val);
        }
        static get observedAttributes() {
            return super.observedAttributes.concat([stopPropagation, on]);
        }
        attributeChangedCallback(name, oldValue, newValue) {
            super.attributeChangedCallback(name, oldValue, newValue);
            switch (name) {
                // case href:
                //     this._href = newValue;
                //     break;
                case stopPropagation:
                    this._stopPropagation = newValue !== null;
                    break;
                case on:
                    this._on = newValue;
                    if (this._on) {
                        this.addEventListener(this._on, this.handleEvent);
                    }
                    else {
                        this.disconnect();
                    }
                    break;
            }
        }
        handleEvent() {
        }
        disconnect() {
            this.removeEventListener(this._on, this.handleEvent);
        }
        // connectedCallback(){
        // }
        disconnectedCallback() {
            this.disconnect();
        }
    }
    if (!customElements.get(tagName)) {
        customElements.define(tagName, XtalIzeEvent);
    }
});
//# sourceMappingURL=xtal-ize-event.js.map