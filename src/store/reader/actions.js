export default {
    async fetchLessonWords(context, payload) {
        const lessonId = payload.lessonId;
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/library/lessons/${lessonId}/words/`,
            protected: true,
            caller: "fetchLessonWords",
            module: "reader",
        }, {root: true});
    },
    async fetchLessonPhrases(context, payload) {
        const lessonId = payload.lessonId;
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/library/lessons/${lessonId}/phrases/`,
            protected: true,
            caller: "fetchLessonPhrases",
            module: "reader",
        }, {root: true});
    },

    async saveMeaningToUser(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/meanings/`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    meaningId: payload.meaningId,
                }),
            },
            protected: true,
            caller: "saveMeaningToUser",
            module: "reader",
        }, {root: true});
    },
    async addNewMeaning(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/meanings/`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    text: payload.text,
                    vocabId: payload.vocabId,
                    language: payload.language,
                }),
            },
            protected: true,
            caller: "addNewMeaning",
            module: "reader",
        }, {root: true});
    },
    async postNewVocab(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/vocabs/`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    text: payload.text,
                    language: payload.language,
                    isPhrase: payload.isPhrase,
                }),
            },
            protected: true,
            caller: "postNewWord",
            module: "reader",
        }, {root: true});
    },
    async postUserVocab(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/vocabs/`,
            options: {
                method: 'POST',
                body: JSON.stringify({
                    vocabId: payload.vocabId
                }),
            },
            protected: true,
            caller: "postUserVocab",
            module: "reader",
        }, {root: true});
    },
    async updateVocabLevel(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/vocabs/${payload.vocabId}/`,
            options: {
                method: 'PATCH',
                body: JSON.stringify({
                    level: payload.level,
                }),
            },
            protected: true,
            caller: "updateVocabLevel",
            module: "reader",
        }, {root: true});
    },

    async deleteUserMeaning(context, payload) {
        await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/vocabs/${payload.vocabId}/meanings/${payload.meaningId}/`,
            options: {
                method: "DELETE",
            },
            protected: true,
            caller: "deleteUserMeaning",
            module: "reader",
        }, {root: true});
    },

    async fetchDictionaries(context, payload) {
        const languageCode = payload.language;
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/dictionaries/?language=${languageCode}`,
            protected: true,
            caller: "fetchDictionaries",
            module: "reader",
        }, {root: true});
    },
    async fetchUserVocabsPage(context, payload) {
        return await context.dispatch('fetchCustom', {
            //&level.neq=${VOCAB_LEVELS.IGNORED}&level.neq=${VOCAB_LEVELS.KNOWN}
            url: `${context.rootGetters.apiUrl}/users/me/vocabs/?language=${payload.language}${payload.levels ? payload.levels.map((level) => `&level=${level}`).join("") : ""}${payload.searchQuery ? `&search=${payload.searchQuery}` : ''}&pageSize=${payload.vocabsPerPage}&page=${payload.page}`,
            protected: true,
            caller: "fetchUserVocabsPage",
            module: "reader",
        }, {root: true});
    }
}