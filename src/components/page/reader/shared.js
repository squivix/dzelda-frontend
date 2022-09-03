export function getTextElements(paragraph, regex) {
    //[^\p{L}\d]
    return paragraph.split(regex ?? /([^\p{L}\d])/gu).filter((word) => word !== "");
    // return paragraph.split(/(\s|[^a-zA-Z\d\s:])+/g);
}

