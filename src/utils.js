export function isJsonString(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}

export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}