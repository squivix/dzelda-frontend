export async function postWord(wordText, level, isPhrase) {
    return await this.$store.dispatch("postNewWord", {
        language: this.$route.params.learningLanguage,
        text: wordText,
        level: level,
    });
}