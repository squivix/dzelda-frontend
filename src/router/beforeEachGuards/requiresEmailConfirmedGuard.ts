import {NavigationGuardWithThis} from "vue-router";
import {useUserStore} from "@/stores/backend/userStore.js";

export const requiresEmailConfirmedGuard: NavigationGuardWithThis<undefined> = async (to) => {
    const authStore = useUserStore();
    if (to.meta.requiresEmailConfirmed && !authStore.userAccount!.isEmailConfirmed)
        return {name: "confirm-email"};
};
