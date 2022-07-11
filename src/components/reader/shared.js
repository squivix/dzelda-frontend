export async function postVocab(wordText, level, isPhrase) {
    return await this.$store.dispatch("postNewVocab", {
        language: this.$route.params.learningLanguage,
        text: wordText,
        level: level,
    });
}