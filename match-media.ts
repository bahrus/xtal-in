import { XtalCustomEvent, IXtalInDetailProperties, registerTagName} from './custom-event.js';
export interface IMatchMediaProperties{
    mediaQueryString: string;
    //matchesMediaQuery: boolean;
}
const mediaQueryString = 'media-query-string';
const canonicalTagName_XtalInMedia = 'xtal-in-media';
const matchesMediaQuery = 'matches-media-query';
class MatchMedia extends XtalCustomEvent implements IMatchMediaProperties{
    static get is(){return  'match-media';}
    _mediaQueryString: string;
    get mediaQueryString(){
        return this._mediaQueryString;
    }
    set mediaQueryString(val){
        this.setAttribute(mediaQueryString, val);
    }

    static get observedAttributes(){
        return [
            mediaQueryString,
        ]
    }
    _boundMediaQueryHandler;
    attributeChangedCallback(name: string, oldValue: string, newValue: string){
        switch(name){
            case mediaQueryString:
                this.disconnect();
                this._mediaQueryString = newValue;
                if(newValue !== null){
                    this._mql = window.matchMedia(this._mediaQueryString);
                    this._boundMediaQueryHandler = this.handleMediaQueryChange.bind(this);
                    this.connect();
                }
        }
    }

    _mql: MediaQueryList
    connect(){
        this._mql.addListener(this._boundMediaQueryHandler);
    }
    disconnect(){
        if(this._mql) this._mql.removeListener(this._boundMediaQueryHandler);
    }
    handleMediaQueryChange(e: MediaQueryList){
        if(e.matches){
           this.setAttribute(matchesMediaQuery, '');
        }else{
            this.removeAttribute(matchesMediaQuery);
        }
        this.detail = e;
        this.setReceipt(e.matches, null);
    }
    connectedCallback(){
        this._upgradeProperties(['mediaQueryString']);
    }
    disconnectedCallback(){
        this.disconnect();
    }
}
if(!customElements.get(canonicalTagName_XtalInMedia)){
    registerTagName(MatchMedia.is, MatchMedia);
    class XtalInMedia extends MatchMedia { }
    customElements.define(canonicalTagName_XtalInMedia, XtalInMedia);
}
