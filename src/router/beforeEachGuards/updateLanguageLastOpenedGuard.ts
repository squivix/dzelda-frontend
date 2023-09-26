import {NavigationGuardWithThis} from "vue-router";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export const updateLanguageLastOpenedGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    const languageStore = useLanguageStore();

    if (to.params.learningLanguage && from.params.learningLanguage !== to.params.learningLanguage)
        await languageStore.updateLanguageLastOpened({languageCode: to.params.learningLanguage as string});
};
