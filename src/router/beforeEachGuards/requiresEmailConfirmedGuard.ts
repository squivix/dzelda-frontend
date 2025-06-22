import type {NavigationGuardWithThis} from "vue-router";
import {useUserStore} from "@/stores/backend/userStore.js";

export const requiresEmailConfirmedGuard: NavigationGuardWithThis<undefined> = async (to) => {
    const userStore = useUserStore();
    if (to.meta.requiresEmailConfirmed && !userStore.userAccount!.isEmailConfirmed)
        return {name: "confirm-email-sent"};
};
