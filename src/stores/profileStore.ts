import {defineStore} from "pinia";
import {useStore} from "@/stores/rootStore.js";
import {UserSchema} from "dzelda-types"

export const useProfileStore = defineStore("profile", {
    state() {
        return {
            userProfile: null as UserSchema | null
        }
    },
    actions: {
        async fetchUserProfile() {
            if (this.userProfile)
                return this.userProfile;
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersUsername("me"))

            // handle your 4XX errors as you may
            //...
            this.userProfile = response.data;
            return response.data;
        },
    }

})