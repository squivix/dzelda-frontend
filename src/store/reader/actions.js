import {VOCAB_LEVELS} from "@/constants";

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
            url: `${context.getters.apiUrl}/users/me/vocabs/${payload.vocabId}/meanings`,
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
            url: `${context.getters.apiUrl}/vocabs/${payload.vocabId}/meanings`,
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
    async postNewVocab(context, payload) {
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
    async updateVocabLevel(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/vocabs/${payload.vocabId}`,
            options: {
                method: 'PATCH',
                body: JSON.stringify({
                    language: payload.language,
                    level: payload.level,
                }),
            },
            protected: true,
            caller: "updateVocabLevel",
            module: "reader",
        });
    },

    async deleteUserMeaning(context, payload) {
        await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/vocabs/${payload.vocabId}/meanings/${payload.meaningId}`,
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
    },
    async fetchUserVocabsPage(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/vocabs?language=${payload.language}&level.neq=${VOCAB_LEVELS.IGNORED}&level.neq=${VOCAB_LEVELS.KNOWN}${payload.searchQuery ? `&search=${payload.searchQuery}` : ''}&pageSize=${payload.vocabsPerPage}&page=${payload.page}`,
            protected: true,
            caller: "fetchUserVocabsPage",
            module: "reader",
        });
    }
}