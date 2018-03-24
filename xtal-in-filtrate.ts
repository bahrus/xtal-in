import { XtalInDetail , IXtalInDetailProperties} from 'xtal-in-detail.js';

export interface IXtalInFiltrateProperties extends IXtalInDetailProperties{
    dispatchWhen: string;
    whereTargetId: string;
}

