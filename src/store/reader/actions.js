export default {
    async fetchLessonWords(context, payload) {
        const lessonId = payload.lessonId;
        const response = await context.dispatch("fetchProtected", {url: `${context.getters.baseUrl}/users/me/lessons/${lessonId}/words`});
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:reader/fetchLessonWords:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },

    async postNewMeaning(context, payload) {
        const response = await context.dispatch("fetchProtected", {
            url: `${this.$store.getters.baseUrl}/users/me/words/${payload.word_id}/meanings`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    language: payload.meaningLanguage,
                    text: payload.meaningText,
                }),
            }
        });
    }
}