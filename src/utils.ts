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

export function excludeProperties<T, K extends keyof T>(obj: T, keysToOmit: K[]): Omit<T, K> {
    const result = {...obj};

    for (const key of keysToOmit) {
        delete result[key];
    }

    return result as Omit<T, K>;
}

export function cleanUndefined(obj: any): any {
    if (typeof obj !== "object" || obj === null)
        return obj;

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] === undefined)
                delete obj[key];
            else
                obj[key] = cleanUndefined(obj[key]);
        }
    }
    return obj;
}

export function isObject(item: any): item is { [p: string]: any } {
    return (item && typeof item === "object" && !Array.isArray(item));
}

export function mergeDeep(target: { [p: string]: any }, source: { [p: string]: any }) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, {[key]: source[key]});
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, {[key]: source[key]});
            }
        });
    }
    return output;
}

export function toSentenceCase(s: string) {
    if (s.length > 0)
        return `${s[0].toUpperCase()}${s.slice(1)}`;
    return s;

}

function rangeIntersectsNode(range: Range, node: Node) {
    if (range.intersectsNode)
        return range.intersectsNode(node);
    else {
        let nodeRange = node.ownerDocument!.createRange();
        try {
            nodeRange.selectNode(node);
        } catch (e) {
            nodeRange.selectNodeContents(node);
        }
        return range.compareBoundaryPoints(Range.END_TO_START, nodeRange) == -1 &&
            range.compareBoundaryPoints(Range.START_TO_END, nodeRange) == 1;
    }
}

// from https://stackoverflow.com/a/1483487
export function getTextSelectedElements(selection: Selection) {
    if (selection.toString().length < 1)
        return
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let containerElement = range.commonAncestorContainer;
        if (containerElement.nodeType != 1)
            containerElement = containerElement.parentNode!;
        const treeWalker = document.createTreeWalker(
            containerElement,
            NodeFilter.SHOW_ELEMENT,
            (node: Node) => rangeIntersectsNode(range, node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        );
        const elementList = [treeWalker.currentNode as HTMLElement];
        while (treeWalker.nextNode())
            elementList.push(treeWalker.currentNode as HTMLElement);
        return elementList
    }
}