import {useAuthStore} from "@/stores/backend/authStore.js";
import {NavigationGuardWithThis} from "vue-router";

//prevent visiting pages that require authentication while unauthenticated
export const requiresAuthGuard: NavigationGuardWithThis<undefined> = (to) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    if (to.meta.requiresAuth && !isAuthenticated)
        return {name: "login"};

    //save token if it's not saved
    if (to.meta.requiresAuth && isAuthenticated && !authStore.token)
        authStore.token = localStorage.authToken;
};
