import type {NavigationGuardWithThis} from "vue-router";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export const updateLanguageLastOpenedGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    const languageStore = useLanguageStore();

    if (to.params.learningLanguage && from.params.learningLanguage !== to.params.learningLanguage) {
        const response = await languageStore.updateUserLanguage({languageCode: to.params.learningLanguage as string}, {lastOpened: "now"});
        if (!response.ok && response.status == 404)
            return {name: "not-found"};
    }
};
