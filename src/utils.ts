import {VocabLevelSchema} from "dzelda-common";
import {ALL_VOCAB_LEVELS} from "@/constants.js";
import snarkdown from "snarkdown";

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function getAcceptablyRandomId() {
    return getRandomInt(100000000000, 999999999999);
}

export function shallowObjectEquals(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
    return Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every(key => obj1[key] === obj2[key]);
}

export function isEmptyObject(obj: object) {

    for (let key in cleanUndefined(obj)) {
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

export function cleanUndefined<T>(obj: T): T {
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
        return;
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
        return elementList;
    }
}

export function getChildrenInViewIndexes(container: HTMLElement) {
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    const children = container.children;
    const childrenInViewIndexes: Set<number> = new Set();
    for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;

        const childTop = child.offsetTop;
        const childBottom = childTop + child.offsetHeight;

        // If child is in view
        if (childTop <= containerBottom && childBottom >= containerBottom)
            childrenInViewIndexes.add(i);
        // If child not in view and past siblings were ignore rest because we know in-view children are contiguous
        else if (childrenInViewIndexes.size > 0)
            break;
    }
    return childrenInViewIndexes;
}

export function padSequence(numbers: number[], leftPadding: number, rightPadding: number, minValue: number, maxValue: number) {
    const sortedNumbers = [...numbers].sort();
    const result: number[] = [];
    for (let i = 1; i <= leftPadding; i++) {
        const element = sortedNumbers[0] - i;
        if (element < minValue)
            break;
        result.push(element);
    }
    result.push(...sortedNumbers);
    for (let i = 1; i <= rightPadding; i++) {
        const element = sortedNumbers[sortedNumbers.length - 1] + i;
        if (element > maxValue)
            break;
        result.push(element);
    }
    return result;
}

export function renderMarkdown(markdownText: string, linkInNewTab: boolean = true) {
    const htmlText = snarkdown(markdownText);
    if (linkInNewTab)
        return htmlText.replaceAll(/<a /g, `<a target="_blank" rel="noreferrer noopener nofollow" `);
    return htmlText;
}

export function getLevelClass(level?: VocabLevelSchema) {
    const levelMap = {
        [ALL_VOCAB_LEVELS.NEW]: "level-new",
        [ALL_VOCAB_LEVELS.LEVEL_1]: "level-1 ",
        [ALL_VOCAB_LEVELS.LEVEL_2]: "level-2 ",
        [ALL_VOCAB_LEVELS.LEVEL_3]: "level-3",
        [ALL_VOCAB_LEVELS.LEVEL_4]: "level-4",
        [ALL_VOCAB_LEVELS.LEARNED]: "level-learned",
        [ALL_VOCAB_LEVELS.KNOWN]: "level-known",
    };
    return level !== undefined ? levelMap[level] : "";
}

export function secondsToMs(seconds: number) {
    return seconds * 1000;
}

export function minsToMs(mins: number) {
    return mins * 60 * 1000;
}

export function hoursToMs(hours: number) {
    return hours * 60 * 60 * 1000;
}

export function daysToMs(days: number) {
    return days * 24 * 60 * 60 * 1000;
}

export function setDifference<T>(set1: Set<T>, set2: Set<T>) {
    return new Set([...set1].filter(x => !set2.has(x)));

}
