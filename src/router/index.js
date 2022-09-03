import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "@/stores/auth.js";
import {useLanguageStore} from "@/stores/language.js";
import {privateRoutes} from "@/router/private/index.js";
import {publicRoutes} from "@/router/public/index.js";

const router = createRouter({
    routes: [
        ...privateRoutes,
        ...publicRoutes,
    ],
    history: createWebHistory(),
});


router.beforeEach(async (to, from) => {
    const authStore = useAuthStore();
    const languageStore = useLanguageStore();
    const isAuthenticated = authStore.isAuthenticated;
    //prevent visiting sites that require authentication while unauthenticated
    if (to.meta.requiresAuth && !isAuthenticated)
        return {name: "login"};
    if (to.meta.requiresAuth && isAuthenticated && !authStore.token)
        authStore.token = localStorage.authToken;

    if ((to.name === "login" || to.name === "home") && isAuthenticated)
        return {name: "explore"};

    if (isAuthenticated && to.meta.redirToLanguageSpecific) {
        const defaultLanguage = (await languageStore.fetchUserLanguages())[0];
        return {path: `/learn/${defaultLanguage.code}${to.path}`};
    }

    if (to.params.learningLanguage && from.params.learningLanguage !== to.params.learningLanguage)
        await languageStore.updateLanguageLastOpened({languageCode: to.params.learningLanguage});
});


export default router;

