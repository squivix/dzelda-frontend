export async function postVocab(wordText, level, isPhrase) {
    return await this.$store.dispatch("postNewVocab", {
        language: this.$route.params.learningLanguage,
        text: wordText,
        level: level,
    });
}
export function getTextElements(paragraph, regex) {
    //[^\p{L}\d]
    return paragraph.split(regex ?? /([^\p{L}\d])/gu).filter((word) => word !== '');
    // return paragraph.split(/(\s|[^a-zA-Z\d\s:])+/g);
}