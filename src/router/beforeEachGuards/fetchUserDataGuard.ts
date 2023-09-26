import {NavigationGuardWithThis} from "vue-router";
import {useUserStore} from "@/stores/backend/userStore.js";
import {useAuthStore} from "@/stores/backend/authStore.js";

export const fetchUserDataGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    const userStore = useUserStore();
    const authStore = useAuthStore();

    if (authStore.isAuthenticated)
        await userStore.fetchUserAccount();
};
