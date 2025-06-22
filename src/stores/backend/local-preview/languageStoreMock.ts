import {defineStore} from "pinia";
import type {TranslationLanguageSchema} from "dzelda-common";
import type {LanguageRow} from "@/stores/backend/local-preview/localPreviewStore.js";

export const useLanguageStoreMock = defineStore("languageStoreMock", {
  state() {
    return {
      selectedPreviewLanguageIsRtl: false,
    };
  },
  getters: {
    currentLanguageDir(state): string | null {
      return state.selectedPreviewLanguageIsRtl ? "rtl" : "ltr";
    },
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
