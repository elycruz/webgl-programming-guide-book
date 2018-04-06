import {keys} from 'fjl';

export * from './console';

let _uuid = 0;

export const
    noop = () => undefined,
    uuid = (prefix = 'component-') => prefix + _uuid++,
    objsToListsOnKey = (key, obj) => {
        if (!obj[key]) { return {...obj}; }
        const _obj = {...obj},
            item = _obj[key];
        _obj[key] = keys(item).map(k => {
            const out = {...item[k]};
            if (out[key]) {
                out[key] = objsToListsOnKey(key, out).items;
            }
            return out;
        });
        return _obj;
    };
