import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {LearnerLanguageSchema} from "dzelda-common";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

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
        async fetchLanguages(queryParams: { isSupported?: boolean, sortBy?: "name" | "learnersCount" | "secondSpeakersCount", sortOrder?: "asc" | "desc" } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.languages.getLanguages(queryParams));
            return response.data;
        },
        async fetchUserLanguages({queryParams = {sortBy: "lastOpened", sortOrder: "desc"}, ignoreCache = false}: {
            queryParams?: {
                sortBy?: "name" | "learnersCount" | "lastOpened",
                sortOrder?: "asc" | "desc"
            }, ignoreCache?: boolean
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersUsernameLanguages("me", queryParams),
                {
                    cacheKey: `fetchUserLanguages(${JSON.stringify(queryParams)})`,
                    clearCache: ignoreCache
                });
            this.userLanguages = response.data;
            return response.data;
        },
        async addLanguageToUser(body: { languageCode: string }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersUsernameLanguages({
                languageCode: body.languageCode
            }));
            return response.data;
        },
        async deleteLanguageFromUser(pathParams: { languageCode: string }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            await store.fetchCustom((api) => api.users.deleteUsersMeLanguagesLanguageCode(pathParams.languageCode));
            if (this.userLanguages) {
                const index = this.userLanguages.findIndex((language) => language.code === pathParams.languageCode);
                if (index !== -1)
                    this.userLanguages.splice(index, 1);
            }
        },
        async resetUserLanguageProgress(pathParams: { languageCode: string }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            await store.fetchCustom((api) => api.users.deleteUsersMeLanguagesLanguageCodeProgress(pathParams.languageCode));
        },
        async updateLanguageLastOpened(pathParams: { languageCode: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.patchUsersMeLanguagesLanguageCode(pathParams.languageCode, {lastOpened: "now"}));
            if (response.ok)
                this.setLastOpenedLanguage(pathParams.languageCode);
            return response;
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
