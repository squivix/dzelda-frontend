import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {VocabLevelSchema} from "dzelda-common";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

export const useVocabStore = defineStore("vocab", {
    actions: {
        async fetchUserVocabs(queryParams: {
            languageCode?: string,
            level?:  VocabLevelSchema[],
            searchQuery?: string,
            pageSize?: number,
            page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersMeVocabs(queryParams));
            return response.data;
        },
        async fetchUserVocab(pathParams: { vocabId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersMeVocabsVocabId(pathParams.vocabId));
            return response.data;
        },
        async createVocab(body: { text: string, languageCode: string, isPhrase: boolean }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.vocabs.postVocabs({
                text: body.text,
                languageCode: body.languageCode,
                isPhrase: body.isPhrase
            }));
            return response.data;
        },
        async addVocabToUser(body: { vocabId: number, level?: VocabLevelSchema }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeVocabs({
                vocabId: body.vocabId,
                level: body.level
            }));
            return response.data;
        },
        async updateUserVocab(pathParams: { vocabId: number }, body: { level?: (-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6), notes?: string }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.patchUsersMeVocabsVocabId(pathParams.vocabId, {
                level: body.level,
                notes: body.notes
            }));
            return response.data;
        },
        async removeVocabFromUser(pathParams: { vocabId: number }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            await store.fetchCustom((api) => api.users.deleteUsersMeVocabsVocabId(pathParams.vocabId));
        },
        async fetchTextVocabs(pathParams: { textId: number }, queryParams: {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.texts.getTextsTextIdVocabs(pathParams.textId, queryParams));
            return response.data;
        },
        async fetchSavedVocabsCountTimeSeries(pathParams: { username: string }, queryParams: {
            savedOnFrom?: string,
            savedOnTo?: string,
            savedOnInterval?: "day" | "month" | "year",
            groupBy?: "language",
            level?: VocabLevelSchema[],
            isPhrase?: boolean
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersUsernameVocabsSavedCountTimeSeries(pathParams.username, queryParams, {secure: true}));
            return response.data;
        },
        async fetchSavedVocabsCount(pathParams: { username: string }, queryParams: {
            savedOnFrom?: string,
            savedOnTo?: string,
            groupBy?: "language",
            level?: VocabLevelSchema[],
            isPhrase?: boolean
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersUsernameVocabsSavedCount(pathParams.username, queryParams, {secure: true}));
            return response.data;
        },
        async fetchHumanPronunciations(queryParams: { languageCode?: string, text?: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.humanPronunciations.getHumanPronunciations(queryParams));
            return response.data;
        },
        async generateVocabTTS(body: { vocabId: number, voiceCode: string | undefined }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.ttsPronunciations.postTtsPronunciations({vocabId: body.vocabId, voiceCode: body.voiceCode}), {ignore5XX: true});
            if (response.ok)
                return response.data;
        }
    }
});
