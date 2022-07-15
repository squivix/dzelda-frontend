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

//from https://stackoverflow.com/a/9310752/14200676
export function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

//equivalent of python range() from https://stackoverflow.com/a/8273091/14200676
export function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    let result = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}