import {VocabLevel} from "dzelda-common";

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


export function renderMarkdown(markdownText: string, linkInNewTab: boolean = true) {
    const htmlText = snarkdown(markdownText);
    if (linkInNewTab)
        return htmlText.replaceAll(/<a /g, `<a target="_blank" rel="noreferrer noopener nofollow" `);
    return htmlText;
}

export function getLevelClass(level?: VocabLevel) {
    const levelMap: Record<VocabLevel, string> = {
        [VocabLevel.NEW]: "level-new",
        [VocabLevel.LEVEL_1]: "level-1 ",
        [VocabLevel.LEVEL_2]: "level-2 ",
        [VocabLevel.LEVEL_3]: "level-3",
        [VocabLevel.LEVEL_4]: "level-4",
        [VocabLevel.LEARNED]: "level-learned",
        [VocabLevel.IGNORED]: "level-ignored",
        [VocabLevel.KNOWN]: "level-known",
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

export interface TreeNode<T> {
    value: T;
    children: TreeNode<T>[];
}

export async function traverseTreeDFSCallback<T>(node: TreeNode<T>, callback: (node: TreeNode<T>) => void) {
    if (!node)
        return;
    callback(node);
    node.children.forEach(child => traverseTreeDFSCallback(child, callback));
}

export async function transformTreeNode<T>(node: any, transformation: (node: any) => Promise<T>, childrenKey: string = "children") {
    const transformedNode: T = await transformation(node);
    const transformedChildren: TreeNode<T>[] = node[childrenKey] ? await Promise.all(node[childrenKey]!.map(async (child: any) => (await transformTreeNode(child, transformation, childrenKey))!)) : [];

    return {
        value: transformedNode,
        children: transformedChildren
    };
}

export function flattenTree<T>(node: TreeNode<T>, result: T[] = [], isNodeIncluded: (node: TreeNode<T>) => boolean): T[] {
    if (isNodeIncluded(node))
        result.push(node.value);

    node.children.forEach(child => flattenTree(child, result, isNodeIncluded));

    return result;
}

export function splitTextWithDelimiters(
    text: string,
    softMinChunkLength: number,
    hardMaxChunkLength: number,
    preferableDelimiters: string[]
): string[] {
    const chunks: string[] = [];
    let currentIndex = 0;
    const textLength = text.length;

    while (currentIndex < textLength) {
        const endIndex = Math.min(currentIndex + hardMaxChunkLength, textLength);

        let splitIndex: number | null = null;
        const splitCandidates: number[] = [];

        for (const delimiter of preferableDelimiters) {
            let pos = text.substring(currentIndex).lastIndexOf(delimiter, endIndex - 1);

            if (pos !== -1 && (pos + currentIndex) < endIndex) {
                splitIndex = pos + currentIndex + 1;
                splitCandidates.push(splitIndex);
            }
        }

        for (let i = 0; i < splitCandidates.length; i++) {
            const candidate = splitCandidates[i];
            if (candidate - currentIndex >= softMinChunkLength || i === splitCandidates.length - 1) {
                splitIndex = candidate;
                break;
            }
        }

        if (splitIndex === null)
            splitIndex = endIndex;

        const chunk = text.substring(currentIndex, splitIndex);
        chunks.push(chunk);
        currentIndex = splitIndex;
    }

    if (chunks[chunks.length - 1].length < softMinChunkLength &&
        chunks[chunks.length - 2].length + chunks[chunks.length - 1].length < hardMaxChunkLength) {
        const last_chunk = chunks.pop();
        chunks[chunks.length - 1] += last_chunk;
    }
    return chunks;
}

export function removeHashFromHref(href: string) {
    const hashIndex = href.indexOf("#");

    if (hashIndex !== -1)
        return href.substring(0, hashIndex);

    return href;
}
