import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {LearnerLanguageSchema} from "dzelda-types";

export const useLanguageStore = defineStore("language", {
    state() {
        return {userLanguages: null as LearnerLanguageSchema[] | null};
    },
    getters: {
        currentLanguage(state) {
            return state.userLanguages ? state.userLanguages[0] : null;
        },
    },
    actions: {
        async fetchLanguages(queryParams: { isSupported?: boolean } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.languages.getLanguages(queryParams));

            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async fetchUserLanguages({queryParams = {sortBy: "lastOpened", sortOrder: "desc"}, ignoreCache = false}: {
            queryParams?: {
                sortBy?: "name" | "learnersCount" | "lastOpened",
                sortOrder?: "asc" | "desc"
            }, ignoreCache?: boolean
        } = {}) {
            //TODO make caching depend on request params
            if (!ignoreCache && this.userLanguages !== null)
                return this.userLanguages;
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersUsernameLanguages("me", queryParams));

            // handle your 4XX errors as you may
            //...
            this.userLanguages = response.data;
            return response.data;
        },
        async addLanguageToUser(body: { languageCode: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersUsernameLanguages("me", {
                languageCode: body.languageCode
            }));
            return response.data;
        },
        async deleteLanguageFromUser(pathParams: { languageCode: string }) {
            const store = useStore();
            await store.fetchCustom((api) => api.users.deleteUsersUsernameLanguagesLanguageCode("me", pathParams.languageCode));
            // handle your 4XX errors as you may
            //...
            if (this.userLanguages) {
                const index = this.userLanguages.findIndex((language) => language.code === pathParams.languageCode);
                if (index !== -1)
                    this.userLanguages.splice(index, 1);
            }
        },
        async updateLanguageLastOpened(pathParams: { languageCode: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.patchUsersUsernameLanguagesLanguageCode("me", pathParams.languageCode, {lastOpened: "now"}));
            // handle your 4XX errors as you may
            //...
            this.setLastOpenedLanguage(pathParams.languageCode);
            return response.data;
        },
        setLastOpenedLanguage(languageCode: string) {
            if (!this.userLanguages || this.userLanguages.length < 2)
                return;

            for (let i = 1; i < this.userLanguages.length; i++) {
                if (this.userLanguages[i].code === languageCode)
                    // swap with userLanguages[0]
                    [this.userLanguages[i], this.userLanguages[0]] = [this.userLanguages[0], this.userLanguages[i]];
            }
        },
        clearUserData() {
            this.userLanguages = null;
        }
    }
});
