import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {useMessageBarStore} from "@/stores/messageBarStore.js";
import {minsToMs} from "@/utils.js";

export const useMeaningStore = defineStore("meaning", {
    actions: {
        async fetchTextMeanings(pathParams: { textId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.texts.getTextsTextIdMeanings(pathParams.textId, {secure: true}));
            return response.data;
        },
        async createMeaning(body: { text: string, vocabId: number, languageCode: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.meanings.postMeanings({
                text: body.text,
                vocabId: body.vocabId,
                languageCode: body.languageCode
            }));
            return response.data;
        },
        async addMeaningToUser(body: { meaningId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeMeanings({
                meaningId: body.meaningId
            }));
            return response.data;
        },
        async deleteMeaningFromUser(pathParams: { meaningId: number }) {
            const store = useStore();
            await store.fetchCustom((api) => api.users.deleteUsersMeMeaningsMeaningId(pathParams.meaningId));
        },
        async fetchAttributionSource(pathParams: { attributionSourceId: number }, ignoreCache = false) {
            const store = useStore();
            const response = await store.fetchCustomWithCache(
                (api) => api.attributionSources.getAttributionSourcesAttributionSourcesId(pathParams.attributionSourceId),
                `fetchAttributionSource(${pathParams.attributionSourceId})`,
                {expiryTimeInMs: minsToMs(10), clearCache: ignoreCache,clearMessageBar: false});
            return response.data;
        },
    }
});
