import { XtalCustomEvent, IXtalInDetailProperties, registerTagName } from './custom-event.js';

const defaultTagName_xtal_in_children = 'observe-children';
const canonicalTagName_xtal_in_children = 'xtal-in-children';
const watchSubtree = 'watch-subtree';
class ObserveChildren extends XtalCustomEvent{
    constructor(){
        super();
        this._isSubClass = true;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([watchSubtree]);
    }
    _watchSubtree: boolean;
    get watchSubtree(){
        return this.hasAttribute(watchSubtree);;
    }
    set watchSubtree(val){
        if(val){
            this.setAttribute(watchSubtree, '');
        }else{
            this.removeAttribute(watchSubtree)
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
    _observer: MutationObserver;
    disconnect(){
        if(this._observer)  this._observer.disconnect();
    }
    _mutationCount = 0;
    addMutationObserver(){
        const config = { childList: true, subtree: this._watchSubtree };
        this._observer =  new MutationObserver((mutationsList: MutationRecord[]) =>{
            this.detail = mutationsList;
            this._mutationCount++;
            this.setValue(this._mutationCount, null);
        });
        this.setValue(this._mutationCount, null);
        this._observer.observe(this.parentElement, config);
    }

    connectedCallback(){
        super.connectedCallback();
        this.disconnect();
        this.addMutationObserver();
    }
    disconnedCallback(){
        this.disconnect();
    }
}

registerTagName(defaultTagName_xtal_in_children, ObserveChildren);
class XtalInChildren extends ObserveChildren { }
customElements.define(canonicalTagName_xtal_in_children, XtalInChildren);