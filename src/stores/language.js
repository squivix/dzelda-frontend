import {defineStore} from "pinia";
import {useStore} from "@/stores/index";

export const useLanguageStore = defineStore("language", {
    state() {
        return {userLanguages: null};
    },
    getters: {
        currentLanguage() {
            return this.userLanguages ? this.userLanguages[0] : null;
        },
    },
    actions: {
        async fetchLanguages({supported}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/languages/?supported=${supported}`,
                {},
                false);
        },
        async fetchUserLanguages() {
            const store = useStore();
            const languages = await store.fetchCustom(`${store.apiUrl}/users/me/languages/`,
                {},
                true,);
            this.userLanguages = languages;
            return languages;
        },
        async getOrFetchDefaultUserLanguage() {
            return (await this.getOrFetchUserLanguages())[0];
        },
        async getOrFetchUserLanguages() {
            return this.userLanguages ?? await this.fetchUserLanguages();
        },

        async updateLanguageLastOpened({languageCode}) {
            const store = useStore();
            const responseData = await store.fetchCustom(`${store.apiUrl}/users/me/languages/${languageCode}/`,
                {
                    method: "PATCH",
                    body: JSON.stringify({lastOpened: "now"})
                },
                true);
            this.setLastOpenedLanguage(languageCode);
            return responseData;
        },
        async addLanguage({languageCode}) {
            const store = useStore();
            const language = await store.fetchCustom(`${store.apiUrl}/users/me/languages/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        language: languageCode
                    })
                },
                true);

            this.userLanguages.unshift(language);
        },
        async deleteLanguage({languageCode}) {
            const store = useStore();
            await store.fetchCustom(
                `${store.apiUrl}/users/me/languages/${languageCode}/`,
                {
                    method: "DELETE",
                },
                true);

            const index = this.userLanguages.findIndex((language) => language.code === languageCode);
            if (index !== -1)
                this.userLanguages.splice(index, 1);
        },

        setLastOpenedLanguage(languageCode) {
            if (!this.userLanguages || this.userLanguages.length < 2)
                return;

            for (let i = 1; i < this.userLanguages.length; i++) {
                if (this.userLanguages[i].code === languageCode)
                    // swap with userLanguages[0]
                    [this.userLanguages[i], this.userLanguages[0]] = [this.userLanguages[0], this.userLanguages[i]];
            }
        },
    }
})