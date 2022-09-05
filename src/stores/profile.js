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
            if (this.userProfile)
                return this.userProfile;
            const store = useStore();
            this.userProfile = await store.fetchCustom(
                `${store.apiUrl}/users/me/profile/`,
                {},
                true);
            return this.userProfile;
        },
    }

})