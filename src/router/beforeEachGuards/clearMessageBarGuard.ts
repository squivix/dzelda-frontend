import {NavigationGuardWithThis} from "vue-router";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

//clear the message bar if moving to a different page
export const clearMessageBarGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    if (to.name !== from.name) {
        const messageBarStore = useMessageBarStore();
        messageBarStore.clearMessages();
    }
};
