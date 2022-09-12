import {defineStore} from "pinia";
import {useStore} from "@/stores/index";

export const useProfileStore = defineStore("profile", {
    state() {
        return {
            userProfile: null
        }
    },
    actions: {
        async fetchUserProfile() {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/profile/`,
                {},
                true,
                true,
                this,
                "userProfile");
        },
    }

})