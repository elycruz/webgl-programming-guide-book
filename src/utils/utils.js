import {keys} from 'fjl';

export * from './console';
export * from './raqLimiter';
export * from './debounce';

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
    },
    stripLastSlash = xs =>
        xs !== '/' &&
        xs.lastIndexOf('/') === xs.length - 1 ?
            xs.substring(0, xs.length - 1) : xs
    ,
    findNavItemByUri = (pathName, navItems) => {
        const uri = stripLastSlash(pathName);
        if (!navItems || !navItems.length) {
            return undefined;
        }
        let limit = navItems.length,
            found = null,
            ind = 0
        ;
        // Recursive search
        for (; ind < limit; ind += 1) {
            const item = navItems[ind];
            if (stripLastSlash(item.uri) === uri) {
                return item;
            }
            if (item.items) {
                found = findNavItemByUri(uri, item.items);
            }
            if (found) {
                return found;
            }
        }
    };
