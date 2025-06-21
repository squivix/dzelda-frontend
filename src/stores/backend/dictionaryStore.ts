import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {minsToMs} from "@/utils.js";

export const useDictionaryStore = defineStore("dictionary", {
    actions: {
        async fetchDictionaries(queryParams: { languageCode?: string, isPronunciation?: boolean } = {}, ignoreCache = false) {
            const store = useStore();
            const response = await store.fetchCustomWithCache((api) => api.dictionaries.getDictionaries(queryParams),
                `fetchDictionaries(${JSON.stringify(queryParams)})`,
                {
                    expiryTimeInMs: minsToMs(5),
                    clearCache: ignoreCache,
                    clearMessageBar: false
                });
            return response.data;
        },
        async fetchUserDictionaries(queryParams: { languageCode?: string } = {}, ignoreCache = false) {
            const store = useStore();
            const response = await store.fetchCustomWithCache((api) => api.users.getUsersMeDictionaries(queryParams),
                `fetchUserDictionaries(${JSON.stringify(queryParams)})`,
                {
                    expiryTimeInMs: minsToMs(5),
                    clearCache: ignoreCache,
                    clearMessageBar: false
                });
            return response.data;
        },
        async updateUserLanguageDictionaries(pathParams: { languageCode: string }, body: { dictionaryIds: number[] }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.putUsersMeLanguagesLanguageCodeDictionaries(pathParams.languageCode, {
                dictionaryIds: body.dictionaryIds
            }));
            return response.data;
        }
    }
});
