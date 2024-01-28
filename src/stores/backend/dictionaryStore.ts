import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {minsToMs} from "@/utils.js";

export const useDictionaryStore = defineStore("dictionary", {
    actions: {
        async fetchDictionaries(queryParams: { languageCode?: string } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.dictionaries.getDictionaries(queryParams),
                {
                    cacheKey: `fetchDictionaries(${JSON.stringify(queryParams)})`,
                    expiryTimeInMs: minsToMs(5)
                });
            return response.data;
        },
        async fetchUserDictionaries(queryParams: { languageCode?: string } = {}, ignoreCache = false) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersMeDictionaries(queryParams),
                {
                    cacheKey: `fetchUserDictionaries(${JSON.stringify(queryParams)})`,
                    expiryTimeInMs: minsToMs(5),
                    clearCache: ignoreCache
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
