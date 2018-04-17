import {AddEventListener, IAddEventListener} from './add-event-listener.js';

export interface IXtalBinderProperties extends IAddEventListener{
    passTo: string
}

interface ICssKeyMapper{
    cssSelector: string;
    propMapper: {[key: string]: string[]}
}
const passTo = 'pass-to';
class XtalBinder extends AddEventListener implements IXtalBinderProperties{
    static get is(){return 'xtal-binder';}
    _passTo: string;
    get passTo(){
        return this._passTo || this.getAttribute(passTo);
    }
    set passTo(val){
        this.setAttribute(passTo, val);
    }

    static get observedAttributes() {
        return super.observedAttributes.concat([passTo]);
    }

    attributeChangedCallback(name, oldValue, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch(name){
            case passTo:
                this._passTo = newValue;
                this.parsePassTo();
                break;
        }
    }
    _observer: MutationObserver;
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties(['passTo']);
        const config = { childList: true, subtree: true };
        this._observer =  new MutationObserver((mutationsList: MutationRecord[]) =>{
            mutationsList.forEach(mutation =>{
                mutation.addedNodes.forEach(node =>{
                    this.cascade(this._lastEvent, node as HTMLElement);
                })
            })
        });
        this._observer.observe(this.parentElement, config);
    }
    disconnectedCallback(){
        super.disconnectedCallback();
        if(this._observer) this._observer.disconnect();
    }
    // _cssSelector: string;
    // _propMapper: {[key: string]: string[]}
    cssKeyMappers : ICssKeyMapper[];
    parsePassTo(){
        // const iPosOfOpenBrace = this._passTo.lastIndexOf('{');
        // if(iPosOfOpenBrace < 0) return;
        this.cssKeyMappers = [];
        const endsWithBrace = this._passTo.endsWith('}');
        const adjustedPassTo = this._passTo + (endsWithBrace ? ';' : '');
        const splitPassTo = adjustedPassTo.split('};');
        splitPassTo.forEach(passTo =>{
            const splitPassTo2 = passTo.split('{');
            const tokens = splitPassTo2[1].split(';');
            const propMapper = {};
            tokens.forEach(token =>{
                const nameValuePair = token.split(':');
                propMapper[nameValuePair[0]] = nameValuePair[1].split('.');
            })
            this.cssKeyMappers.push({
                cssSelector: splitPassTo2[0],
                propMapper: propMapper
            });
        })
        // this._cssSelector = this._passTo.substr(0, iPosOfOpenBrace);
        // const propMapperString = this._passTo.substring(iPosOfOpenBrace + 1, this._passTo.length - 1);
        
    }
    _lastEvent: any;
    setValue(val, e: Event){
        super.setValue(val, e);
        this._lastEvent = e;
        this.cascade(e, this.parentElement);
    }
    // handleEvent(e: Event) {

    // }
    cascade(e: Event, refElement: HTMLElement){
        if(!this.cssKeyMappers) return;
        this.cssKeyMappers.forEach(cssKeyMapper =>{
            this.qsa(cssKeyMapper.cssSelector, refElement).forEach(target =>{
                for(var key in cssKeyMapper.propMapper){
                    const pathSelector = cssKeyMapper.propMapper[key];
                    let context = e;
                    pathSelector.forEach(path =>{
                        if(context) context = context[path];
                    });
                    target[key] = context;
                }
            });
        })
        

    }

}
if(!customElements.get(XtalBinder.is)){
    customElements.define(XtalBinder.is, XtalBinder);
}