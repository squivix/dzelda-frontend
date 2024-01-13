import {NavigationGuardWithThis} from "vue-router";
import {useUserStore} from "@/stores/backend/userStore.js";

export const fetchUserDataGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    const userStore = useUserStore();
    if (userStore.isAuthenticated && to.name !== "server-side-error")
        await userStore.fetchUserAccount();
};
