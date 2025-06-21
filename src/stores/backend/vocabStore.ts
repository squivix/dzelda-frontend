import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {VocabLevelSchema} from "dzelda-common";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";

export const useVocabStore = defineStore("vocab", {
    actions: {
        async fetchUserVocabs(queryParams: {
            languageCode?: string,
            level?: VocabLevelSchema[],
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
        async createVocab(body: { text: string, languageCode: string, isPhrase: boolean, variantText: string | undefined }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.vocabs.postVocabs({
                text: body.text,
                languageCode: body.languageCode,
                isPhrase: body.isPhrase,
                variantText: body.variantText
            }));
            return response.data;
        },
        async createVocabVariant(body: { vocabId: number, text: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.vocabVariants.postVocabVariants({
                vocabId: body.vocabId,
                text: body.text,
            }));
            return response.data;
        },
        async addVocabToUser(body: { vocabId: number, level?: VocabLevelSchema }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeVocabs({
                vocabId: body.vocabId,
                level: body.level
            }));
            return response.data;
        },
        async updateUserVocab(pathParams: { vocabId: number }, body: { level?: (-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6), notes?: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.patchUsersMeVocabsVocabId(pathParams.vocabId, {
                level: body.level,
                notes: body.notes
            }));
            return response.data;
        },
        async removeVocabFromUser(pathParams: { vocabId: number }) {
            const store = useStore();
            await store.fetchCustom((api) => api.users.deleteUsersMeVocabsVocabId(pathParams.vocabId));
        },
        async fetchTextVocabs(pathParams: { textId: number }, queryParams: {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.texts.getTextsTextIdVocabs(pathParams.textId, queryParams), {clearMessageBar: false});
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
            const response = await store.fetchCustom((api) => api.users.getUsersUsernameVocabsSavedCountTimeSeries(pathParams.username, queryParams, {secure: true}), {clearMessageBar: false});
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
            const response = await store.fetchCustom((api) => api.users.getUsersUsernameVocabsSavedCount(pathParams.username, queryParams, {secure: true}), {clearMessageBar: false});
            return response.data;
        },
        async fetchVocabTTSPronunciations(pathParams: { vocabId: number }) {
            const store = useStore();
            return await store.fetchCustom((api) => api.vocabs.getVocabsVocabIdTtsPronunciations(pathParams.vocabId), {clearMessageBar: false});
        },
        async fetchVocabVariants(pathParams: { vocabId: number }) {
            const store = useStore();
            return await store.fetchCustom((api) => api.vocabs.getVocabsVocabIdVariants(pathParams.vocabId), {clearMessageBar: false});
        },
        async fetchHumanPronunciations(queryParams: { languageCode?: string, text?: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.humanPronunciations.getHumanPronunciations(queryParams), {clearMessageBar: false});
            return response.data;
        },
        async generateVocabTTS(body: { vocabId: number, voiceCode: string | undefined, vocabVariantId: number | undefined }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.ttsPronunciations.postTtsPronunciations({
                vocabId: body.vocabId,
                voiceCode: body.voiceCode,
                vocabVariantId: body.vocabVariantId
            }), {ignore5XX: true, clearMessageBar: false});
            if (response.ok)
                return response.data;
            else if (response.status == 503) {
                const messageBarStore = useMessageBarStore();
                messageBarStore.addSideMessage({text: "TTS generation is disabled.", type: MessageType.ERROR, timeoutMs: 7000, isMarkdown: true});
            }
        }
    }
});
