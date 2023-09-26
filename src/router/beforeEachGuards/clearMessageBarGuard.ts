import {NavigationGuardWithThis} from "vue-router";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

//clear the message bar if moving to a different page
export const clearMessageBarGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    if (to.name !== from.name) {
        const messageBarStore = useMessageBarStore();
        // TODO: keep messages from  immediately redirected pages, for example keep "email confirmed" message when moving from confirmation to new language page is never seen
        messageBarStore.clearMessages();
    }
};
