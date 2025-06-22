import {useUserStore} from "@/stores/backend/userStore.js";
import type {NavigationGuardWithThis} from "vue-router";

//prevent visiting pages that require authentication while unauthenticated
export const requiresAuthGuard: NavigationGuardWithThis<undefined> = (to) => {
    const userStore = useUserStore();
    const isAuthenticated = userStore.isAuthenticated;
    if (to.meta.requiresAuth && !isAuthenticated)
        return {name: "login"};
};
