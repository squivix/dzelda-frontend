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
    }
});
