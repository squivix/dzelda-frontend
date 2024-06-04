import {NavigationGuardWithThis} from "vue-router";
import {useUserStore} from "@/stores/backend/userStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";

export const fetchUserNotificationsGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    const userStore = useUserStore();
    if (userStore.isAuthenticated && to.name !== "server-side-error" && userStore.userAccount?.isEmailConfirmed) {
        const messageBarStore = useMessageBarStore();
        const notifications = await userStore.fetchUserNotifications();
        notifications.forEach((notification) => messageBarStore.addTopBarMessage({
                text: notification.text,
                type: MessageType.INFO,
                onDismissed() {
                    userStore.deleteUserNotification({notificationId: notification.id});
                },
            }
        ));
    }
};
