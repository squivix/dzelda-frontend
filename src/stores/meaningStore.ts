import {defineStore} from "pinia";
import {useStore} from "@/stores/rootStore.js";

export const useMeaningStore = defineStore("meaning", {
    actions: {
        async createMeaning(body: { text: string, vocabId: number, languageCode: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.meanings.postMeanings({
                text: body.text,
                vocabId: body.vocabId,
                languageCode: body.languageCode
            }))

            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async addMeaningToUser(body: { meaningId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersUsernameMeanings("me", {
                meaningId: body.meaningId
            }))
            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async deleteMeaningFromUser(pathParams: { meaningId: number }) {
            const store = useStore();
            await store.fetchCustom((api) => api.users.deleteUsersUsernameMeaningsMeaningId("me", pathParams.meaningId))
            // handle your 4XX errors as you may
            //...
        },
    }
})