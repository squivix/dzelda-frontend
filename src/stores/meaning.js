import {defineStore} from "pinia";
import {useStore} from "@/stores/index";

export const useMeaningStore = defineStore("meaning", {
    actions: {
        async createMeaning({text, vocabId, languageCode}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/meanings/`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        text: text,
                        vocabId: vocabId,
                        language: languageCode,
                    }),
                },
                true);
        },
        async addMeaningToUser({meaningId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/meanings/`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        meaningId: meaningId,
                    }),
                },
                true);
        },
        async deleteMeaningFromUser({meaningId}) {
            const store = useStore();
            await store.fetchCustom(
                `${store.apiUrl}/users/me/meanings/${meaningId}/`,
                {
                    method: "DELETE",
                },
                true);
        },
    }
})