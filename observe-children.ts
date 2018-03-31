import { XtalCustomEvent, IXtalInDetailProperties, registerTagName } from './custom-event.js';

const defaultTagName_xtal_in_children = 'observe-children';
const canonicalTagName_xtal_in_children = 'xtal-in-children';

class ObserveChildren extends XtalCustomEvent{
    _observer: MutationObserver;
    disconnect(){
        if(this._observer)  this._observer.disconnect();
    }
    addMutationObserver(){
        var config = { childList: true, subtree: true };
        this._observer =  new MutationObserver((mutationsList: MutationRecord[]) =>{
            mutationsList.forEach(mutation =>{
                this.detail = {
                    mutation
                }
            })

        });
        this.detail = {
            status: 'observing'
        }
        this._observer.observe(this, config);

    }

    connectedCallback(){
        super.connectedCallback();
        this.addMutationObserver();
    }
    disconnedCallback(){
        this.disconnect();
    }
}

registerTagName(defaultTagName_xtal_in_children, ObserveChildren);
class XtalInChildren extends ObserveChildren { }
customElements.define(canonicalTagName_xtal_in_children, XtalInChildren);