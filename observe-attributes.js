import { XtalCustomEvent, registerTagName } from './custom-event.js';
const defaultTagName_xtal_in_attributes = 'observe-attributes';
const canonicalTagName_xtal_in_attributes = 'xtal-in-attributes';
const filter = 'filter';
class ObserveAttributes extends XtalCustomEvent {
    get filter() {
        return this._filter;
    }
    set filter(val) {
        this.setAttribute(filter, JSON.stringify(val));
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([filter]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case filter:
                this._filter = JSON.parse(newValue);
                break;
        }
    }
    getValues(attributes) {
        const attribs = {};
        attributes.forEach(attrib => {
            attribs[attrib] = this._child[attrib];
        });
        return attribs;
    }
    addMutationObserver() {
        this.disconnect();
        if (!this._child)
            return;
        const config = { attributes: true, attributeFilter: this._filter };
        this._observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                this.detail = {
                    mutation
                };
            });
            const attribs = this.filter ? this.getValues(this.filter) : this._child.attributes;
            this.setValue(attribs, null);
        });
        this._observer.observe(this._child, config);
    }
    getChild() {
        switch (this.childElementCount) {
            case 0:
                setTimeout(() => {
                    this.getChild();
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
    disconnect() {
        if (this._observer)
            this._observer.disconnect();
    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties([filter]);
        this.getChild();
    }
}
registerTagName(defaultTagName_xtal_in_attributes, ObserveAttributes);
class XtalInAttributes extends ObserveAttributes {
}
customElements.define(canonicalTagName_xtal_in_attributes, XtalInAttributes);
//# sourceMappingURL=observe-attributes.js.map