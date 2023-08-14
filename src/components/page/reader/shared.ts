export function getTextElements(paragraph: string, regex: RegExp = /([^\p{L}\d])/gu) {
    //[^\p{L}\d]
    return paragraph.split(regex).filter((word) => word !== "");
    // return paragraph.split(/(\s|[^a-zA-Z\d\s:])+/g);
}

