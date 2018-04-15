import { XtalCustomEvent, registerTagName } from './custom-event.js';
const defaultTagName_xtal_in_children = 'observe-children';
const canonicalTagName_xtal_in_children = 'xtal-in-children';
const watchSubtree = 'watch-subtree';
class ObserveChildren extends XtalCustomEvent {
    constructor() {
        super();
        this._mutationCount = 0;
        this._isSubClass = true;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([watchSubtree]);
    }
    get watchSubtree() {
        return this.hasAttribute(watchSubtree);
        ;
    }
    set watchSubtree(val) {
        if (val) {
            this.setAttribute(watchSubtree, '');
        }
        else {
            this.removeAttribute(watchSubtree);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case watchSubtree:
                this._watchSubtree = newValue !== null;
                this.disconnect();
                this.addMutationObserver();
                break;
        }
    }
    disconnect() {
        if (this._observer)
            this._observer.disconnect();
    }
    addMutationObserver() {
        // debugger;
        var config = { childList: true, subtree: this._watchSubtree };
        this._observer = new MutationObserver((mutationsList) => {
            // mutationsList.forEach(mutation =>{
            //     this.detail = {
            //         mutation
            //     }
            // })
            this.detail = mutationsList;
            this._mutationCount++;
            this.setValue(this._mutationCount, null);
        });
        // this.detail = {
        //     status: 'observing'
        // }
        this.setValue(this._mutationCount, null);
        this._observer.observe(this.parentElement, config);
        //this.detail.
    }
    connectedCallback() {
        super.connectedCallback();
        this.disconnect();
        this.addMutationObserver();
    }
    disconnedCallback() {
        this.disconnect();
    }
}
registerTagName(defaultTagName_xtal_in_children, ObserveChildren);
class XtalInChildren extends ObserveChildren {
}
customElements.define(canonicalTagName_xtal_in_children, XtalInChildren);
//# sourceMappingURL=observe-children.js.map