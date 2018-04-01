import { registerTagName } from './custom-event.js';
import { AddEventListener, IAddEventListener } from './add-event-listener.js';

export interface IMergeEventDetailsProperties extends IAddEventListener {
    merge: boolean;
}

// from https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
/**
* Simple object check.
* @param item
* @returns {boolean}
*/
export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}


/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

const merge = 'merge';

const defaultTagName_MergeEventDetails = 'merge-event-details';
const canonicalTagName_MergeEventDetails = 'xtal-in-merge-details';

export class MergeEventDetails extends AddEventListener {
    constructor(){
        super();
        this._isSubClass = true;
    }
    _merge: boolean;
    get merge() {
        return this._merge;
    }
    set merge(val) {
        if (val) {
            this.setAttribute(merge, '');
        } else {
            this.removeAttribute(merge);
        }
    }

    static get observedAttributes() {
        return super.observedAttributes.concat([merge]);
    }

    attributeChangedCallback(name, oldValue, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case merge:
                this._merge = newValue !== null;
                break;
        }
    }

    modifyEvent(e: Event, subscriber: AddEventListener){
        super.modifyEvent(e, subscriber);
        if(this._merge){
            const ce = e as CustomEventInit;
            if(!ce.detail) ce.detail = {};
            mergeDeep(ce.detail, subscriber._zoomedDetail);
        }
    }
}

if(!customElements.get(canonicalTagName_MergeEventDetails)){
    registerTagName(defaultTagName_MergeEventDetails, AddEventListener);
    class XtalInCurry extends AddEventListener { }
    customElements.define(canonicalTagName_MergeEventDetails, XtalInCurry);
}