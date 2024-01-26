import {useDictionaryStore} from "@/stores/backend/dictionaryStore.js";
import {defineStore} from "pinia";
import {useLocalPreviewStore} from "@/stores/backend/local-preview/localPreviewStore.js";

export const useDictionaryStoreMock = defineStore("dictionaryStoreMock", {
    actions: {
        async fetchDictionaries(queryParams) {
            const localPreviewStore = useLocalPreviewStore();
            const previewDb = await localPreviewStore.getPreviewDb();
            if (queryParams && queryParams.languageCode)
                return await previewDb.getAllFromIndex("dictionaries", "languageIndex", queryParams!.languageCode);
            else
                return await previewDb.getAll("dictionaries");
        }
    } as Partial<ReturnType<typeof useDictionaryStore>>
});
