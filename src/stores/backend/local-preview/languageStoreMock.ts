import {defineStore} from "pinia";
import {TranslationLanguageSchema} from "dzelda-common";

export const useLanguageStoreMock = defineStore("languageStoreMock", {
    getters: {
        preferredTranslationLanguages(): TranslationLanguageSchema[] | undefined {
            return [{
                id: 1,
                name: "English",
                code: "en",
                isDefault: true,
            }];
        }
    },
});
