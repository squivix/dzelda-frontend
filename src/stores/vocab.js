import {defineStore} from "pinia";
import {useStore} from "@/stores/index";

export const useVocabStore = defineStore("vocab", {
    actions: {
        async fetchLessonWords({lessonId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/library/lessons/${lessonId}/words/`,
                {},
                true);
        },
        async fetchLessonPhrases({lessonId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/library/lessons/${lessonId}/phrases/`,
                {},
                true);
        }, async postNewVocab({text, language, isPhrase}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/vocabs/`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        text: text,
                        language: language,
                        isPhrase: isPhrase,
                    }),
                },
                true);
        },
        async postUserVocab({vocabId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/vocabs/`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        vocabId: vocabId
                    }),
                },
                true);
        },
        async updateVocabLevel({vocabId, level}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/vocabs/${vocabId}/`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        level: level,
                    }),
                },
                true);
        },

        async fetchUserVocabsPage({language: languageCode, levels, searchQuery, vocabsPerPage, page}) {
            const store = useStore();
            return await store.fetchCustom(
                //&level.neq=${VOCAB_LEVELS.IGNORED}&level.neq=${VOCAB_LEVELS.KNOWN}
                `${store.apiUrl}/users/me/vocabs/?language=${languageCode}${levels ? levels.map((level) => `&level=${level}`).join("") : ""}${searchQuery ? `&search=${searchQuery}` : ''}&pageSize=${vocabsPerPage}&page=${page}`,
                {},
                true);
        }
    }
})