import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {VocabLevelSchema} from "dzelda-common";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

export const useVocabStore = defineStore("vocab", {
    actions: {
        async fetchUserVocabs(queryParams: {
            languageCode?: string,
            level?: (-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6)[],
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
        async fetchLessonVocabs(pathParams: { lessonId: number }, queryParams: {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.lessons.getLessonsLessonIdVocabs(pathParams.lessonId, queryParams));
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
        }

    }
});
