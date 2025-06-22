import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import type {LearnerLanguageSchema, TranslationLanguageSchema} from "dzelda-common";

export const useLanguageStore = defineStore("language", {
  state() {
    return {userLanguages: null as LearnerLanguageSchema[] | null};
  },
  getters: {
    currentLanguage(state): LearnerLanguageSchema | null {
      return state.userLanguages ? state.userLanguages[0] : null;
    },
    currentLanguageDir(): string | null {
      if (this.currentLanguage)
        return this.currentLanguage?.isRtl ? "rtl" : "ltr";
      return null
    },
    preferredTranslationLanguages(): TranslationLanguageSchema[] | undefined {
      return this.currentLanguage?.preferredTranslationLanguages;
    }
  },
  actions: {
    async fetchLanguages(queryParams: {
      isSupported?: boolean,
      sortBy?: "name" | "learnersCount" | "secondSpeakersCount",
      sortOrder?: "asc" | "desc"
    } = {}) {
      const store = useStore();
      const response = await store.fetchCustom((api) => api.languages.getLanguages(queryParams), {clearMessageBar: false});
      return response.data;
    },
    async fetchUserLanguages({
                               queryParams = {sortBy: "lastOpened", sortOrder: "desc"},
                               ignoreCache = false
                             }: {
      queryParams?: {
        sortBy?: "name" | "learnersCount" | "lastOpened",
        sortOrder?: "asc" | "desc"
      }, ignoreCache?: boolean
    } = {}) {
      const store = useStore();
      const response = await store.fetchCustomWithCache((api) => api.users.getUsersUsernameLanguages("me", queryParams),
        `fetchUserLanguages(${JSON.stringify(queryParams)})`, {
          clearCache: ignoreCache,
          clearMessageBar: false
        });
      this.userLanguages = response.data;
      return response.data;
    },
    async addLanguageToUser(body: {
      languageCode: string,
      preferredTranslationLanguageCodes?: string[]
    }) {
      const store = useStore();
      const response = await store.fetchCustom((api) => api.users.postUsersUsernameLanguages({
        languageCode: body.languageCode,
        preferredTranslationLanguageCodes: body.preferredTranslationLanguageCodes
      }));
      return response.data;
    },
    async deleteLanguageFromUser(pathParams: { languageCode: string }) {
      const store = useStore();
      await store.fetchCustom((api) => api.users.deleteUsersMeLanguagesLanguageCode(pathParams.languageCode));
      if (this.userLanguages) {
        const index = this.userLanguages.findIndex((language) => language.code === pathParams.languageCode);
        if (index !== -1)
          this.userLanguages.splice(index, 1);
      }
    },
    async resetUserLanguageProgress(pathParams: { languageCode: string }) {
      const store = useStore();
      await store.fetchCustom((api) => api.users.deleteUsersMeLanguagesLanguageCodeProgress(pathParams.languageCode));
    },
    async updateUserLanguage(pathParams: { languageCode: string }, body: {
      lastOpened?: "now",
      preferredTranslationLanguageCodes?: string[]
    }) {
      const store = useStore();
      const response = await store.fetchCustom((api) => api.users.patchUsersMeLanguagesLanguageCode(pathParams.languageCode, {
        lastOpened: body.lastOpened,
        preferredTranslationLanguageCodes: body.preferredTranslationLanguageCodes
      }));
      if (body.lastOpened && response.ok)
        this.setLastOpenedLanguage(pathParams.languageCode);
      return response;
    },
    async getTranslationLanguages(queryParams: { isDefault?: boolean } = {}) {
      const store = useStore();
      const response = await store.fetchCustom((api) => api.translationLanguages.getTranslationLanguages(queryParams), {clearMessageBar: false});
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
