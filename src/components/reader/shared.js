export async function postWord(level) {
    return await this.$store.dispatch("postNewWord", {
        language: this.$route.params.learningLanguage,
        text: this.wordText,
        level: level
    });
}