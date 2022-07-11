export default {
    async fetchLessonWords(context, payload) {
        const lessonId = payload.lessonId;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/lessons/${lessonId}/words`,
            protected: true,
            caller: "fetchLessonWords",
            module: "reader",
        });
    },
    async fetchLessonPhrases(context, payload) {
        const lessonId = payload.lessonId;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/lessons/${lessonId}/phrases`,
            protected: true,
            caller: "fetchLessonPhrases",
            module: "reader",
        });
    },

    async saveMeaningToUser(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/vocabs/${payload.word_id}/meanings`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    language: payload.meaningLanguage,
                    text: payload.meaningText,
                }),
            },
            protected: true,
            caller: "saveMeaningToUser",
            module: "reader",
        });
    },
    async addNewMeaning(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/vocabs/${payload.word_id}/meanings`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    language: payload.meaningLanguage,
                    text: payload.meaningText,
                }),
            },
            protected: true,
            caller: "addNewMeaning",
            module: "reader",
        });
    },
    async postNewWord(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/vocabs`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    language: payload.language,
                    text: payload.text,
                    level: payload.level,
                }),
            },
            protected: true,
            caller: "postNewWord",
            module: "reader",
        });
    },
    async updateWordLevel(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/vocabs/${payload.word_id}`,
            options: {
                method: 'PATCH',
                body: JSON.stringify({
                    language: payload.language,
                    level: payload.level,
                }),
            },
            protected: true,
            caller: "updateWordLevel",
            module: "reader",
        });
    },

    async deleteUserMeaning(context, payload) {
        await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/vocabs/${payload.word_id}/meanings/${payload.meaning_id}`,
            options: {
                method: "DELETE",
            },
            protected: true,
            caller: "deleteUserMeaning",
            module: "reader",
        });
    },

    async fetchDictionaries(context, payload) {
        const languageCode = payload.language;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/dictionaries?language=${languageCode}`,
            protected: true,
            caller: "fetchDictionaries",
            module: "reader",
        });
    }
}