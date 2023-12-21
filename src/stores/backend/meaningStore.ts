import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

export const useMeaningStore = defineStore("meaning", {
    actions: {
        async createMeaning(body: { text: string, vocabId: number, languageCode: string }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.meanings.postMeanings({
                text: body.text,
                vocabId: body.vocabId,
                languageCode: body.languageCode
            }));
            return response.data;
        },
        async addMeaningToUser(body: { meaningId: number }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeMeanings({
                meaningId: body.meaningId
            }));
            return response.data;
        },
        async deleteMeaningFromUser(pathParams: { meaningId: number }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            await store.fetchCustom((api) => api.users.deleteUsersMeMeaningsMeaningId(pathParams.meaningId));
        },
    }
});
