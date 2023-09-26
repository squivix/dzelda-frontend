import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {UserSchema} from "dzelda-types";

export const useUserStore = defineStore("user", {
    state() {
        return {
            userAccount: null as UserSchema | null
        };
    },
    actions: {
        async fetchUserAccount(ignoreCache = false) {
            if (this.userAccount && !ignoreCache)
                return this.userAccount;
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersUsername("me"));

            this.userAccount = response.data;
            return response.data;
        },
    }

});
