import {defineEnumProps} from 'fjl';

export class ProgramInfo {
    constructor (infoObj) {
        defineEnumProps([
            [Object, 'matrices'],
            [Array, 'attributesNames'],
            [Array, 'uniformNames'],
            [Array, 'shadersAssocList']
        ], this);
        if (infoObj) {
            assignDeep(this, infoObj);
        }
    }

}
