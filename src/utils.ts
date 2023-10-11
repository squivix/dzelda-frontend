export function shallowObjectEquals(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
    return Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every(key => obj1[key] === obj2[key]);
}

export function isEmptyObject(obj: object) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}