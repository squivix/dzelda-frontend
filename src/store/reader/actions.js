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

    async saveMeaningToUser(context, payload) {
        const response = await context.dispatch("fetchProtected", {
            url: `${context.getters.baseUrl}/users/me/words/${payload.word_id}/meanings`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    language: payload.meaningLanguage,
                    text: payload.meaningText,
                }),
            }
        });
        if (!response.ok) {
            const responseData = await response.text();
            console.log(`vuexstore:reader/saveMeaningToUser:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        } else
            return response;
    },
    async addNewMeaning(context, payload) {
        const response = await context.dispatch("fetchProtected", {
            url: `${context.getters.baseUrl}/words/${payload.word_id}/meanings`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    language: payload.meaningLanguage,
                    text: payload.meaningText,
                }),
            }
        });
        if (!response.ok) {
            const responseData = await response.text();
            console.log(`vuexstore:reader/addNewMeaning:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        } else
            return await response.json();
    },
    async postNewWord(context, payload) {
        const response = await context.dispatch("fetchProtected", {
            url: `${context.getters.baseUrl}/users/me/words`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    language: payload.language,
                    text: payload.text,
                    level: payload.level,
                }),
            }
        });
        if (!response.ok) {
            const responseData = await response.text();
            console.log(`vuexstore:reader/postNewWord:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        } else
            return await response.json();
    },
    async updateWordLevel(context, payload) {
        const response = await context.dispatch("fetchProtected", {
            url: `${context.getters.baseUrl}/users/me/words/${payload.word_id}`,
            options: {
                method: 'PATCH',
                body: JSON.stringify({
                    language: payload.language,
                    level: payload.level,
                }),
            }
        })
        if (!response.ok) {
            const responseData = await response.text();
            console.log(`vuexstore:reader/updateWordLevel:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        } else
            return await response.json();
    },

    async deleteUserMeaning(context, payload) {
        await context.dispatch("fetchProtected", {
            url: `${context.getters.baseUrl}/users/me/words/${payload.word_id}/meanings/${payload.meaning_id}`,
            options: {
                method: "DELETE",
            }
        })
    }
}