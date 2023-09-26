import {NavigationGuardWithThis} from "vue-router";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export const redirToLangSpecificGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    const languageStore = useLanguageStore();

    //take to language-specific version of page
    if (to.meta.redirToLanguageSpecific) {
        const userLanguages = await languageStore.fetchUserLanguages();
        if (userLanguages.length == 0)
            return {name: "new-language"};
        const defaultLanguage = userLanguages[0];
        return {path: `/learn/${defaultLanguage.code}${to.path}`};
    }

    if (to.params.learningLanguage && from.params.learningLanguage !== to.params.learningLanguage)
        await languageStore.updateLanguageLastOpened({languageCode: to.params.learningLanguage as string});
};
