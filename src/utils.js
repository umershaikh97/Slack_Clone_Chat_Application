import _ from 'lodash';

export function checkKeyInObject(obj, key, returnType = 'value', notFoundValue, isDomElement) {
    try {
        /* eslint-disable no-unused-expressions */
        let isExists = false;
        if (key && (typeof key === 'string' || typeof key === 'number') && obj) {
            if (typeof key === 'string' && (key.includes('current') || isDomElement)) {
                let keys = key.split(".");
                let val = obj;
                isExists = true;
                keys.some(k => {
                    if (isExists && val[k]) {
                        val = val[k];
                    } else {
                        isExists = false;
                        return true;
                    }
                })
            } else {
                isExists = _.has(obj, key);
            }
        }
        if (returnType === 'value') {
            let valRet = notFoundValue;
            if (isExists) {
                if (obj[key] || typeof key === 'number') {
                    valRet = obj[key];
                } else if (typeof key === 'string') {
                    let keys = key.split(".");
                    let val = obj;
                    keys.forEach(k => {
                        val = val[k];
                    })
                    valRet = val;
                }
            }
            return valRet;
        }
        return isExists;
    } catch (error) {
        console.error(error);
    }
}

export function checkArrayLength(value) {
    return value && Array.isArray(value) && value.length > 0
}

export function checkObject(obj) {
    return obj && Object.keys(obj).length > 0
}

export function isObjectEmpty(obj) {
    return (!obj || (obj && !Object.keys(obj).length))
}