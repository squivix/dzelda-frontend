import {defineStore} from "pinia";
import {useStore} from "@/stores/index";

export const useDictionaryStore = defineStore("dictionary", {
    actions: {
        async fetchDictionaries({languageCode}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/dictionaries/?language=${languageCode}`,
                {},
                true);
        },
    }
})