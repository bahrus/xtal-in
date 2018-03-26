import { XtalInDetail, IXtalInDetailProperties, registerTagName } from './xtal-in-detail.js';

const defaultTagName = 'observe-attributes';
const canonicalTagName = 'xtal-in-attributes';
const filter = 'filter';
export interface IObserveMutationsProperties {
    filter: string[]

}
class ObserveAttributes extends XtalInDetail implements IObserveMutationsProperties {
    _filter: string[]
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
    onPropsChange(){
        this.disconnect();
        if(!this._child) return;
        const config : MutationObserverInit = { attributes: true, attributeFilter: this._filter };
        this._observer =  new MutationObserver(this.handleAttributeChange);
        this._observer.observe(this._child, config);

    }
    handleAttributeChange(mutationsList: MutationRecord[]){
        // this.detail = {
        //     mutationsList[0]
        // }
        mutationsList.forEach(mutation =>{
            this.detail = {
                mutation
            }
        })
    }
    _child: Element;
    getChild(){
        switch(this.childElementCount){
            case 0:
                setTimeout(() => {
                    this.getChild();
                }, 100);
                return;
            case 1:
                this._child = this.firstElementChild;
                this.onPropsChange();
                break;
            default:
                console.error("This component only supports a single element child");
        }
        
    }
    _observer: MutationObserver;
    disconnect(){
        if(this._observer)  this._observer.disconnect();
    }
    connectedCallback(){
        super.connectedCallback();
        this._upgradeProperties([filter]);
        this.getChild();
    }
}

registerTagName(defaultTagName, ObserveAttributes);
class XtalInAttributes extends ObserveAttributes { }
customElements.define(canonicalTagName, XtalInAttributes);