import { XtalCustomEvent, IXtalInDetailProperties, registerTagName } from './custom-event.js';

const defaultTagName = 'observe-children';
const canonicalTagName = 'xtal-in-children';

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

registerTagName(defaultTagName, ObserveChildren);
class XtalInChildren extends ObserveChildren { }
customElements.define(canonicalTagName, XtalInChildren);