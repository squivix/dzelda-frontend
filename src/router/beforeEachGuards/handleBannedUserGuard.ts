import {NavigationGuardWithThis} from "vue-router";
import {useUserStore} from "@/stores/backend/userStore";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore";

export const handleBannedUserGuard: NavigationGuardWithThis<undefined> = async (to) => {
    const userStore = useUserStore();
    if (userStore.userAccount?.isBanned && to.name != "sign-out") {
        await userStore.signOut();
        const messageBarStore = useMessageBarStore()
        messageBarStore.addTopBarMessage({type: MessageType.ERROR, text: "User account banned.", isDismissable: true});
        return {name:"home"};
    }
};
