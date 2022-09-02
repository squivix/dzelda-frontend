import {defineStore} from "pinia";
import {useStore} from "@/stores/index";

export const useAuthStore = defineStore("auth", {
    state() {
        return {
            token: null,
        };
    },
    getters: {
        authToken(state) {
            return state.token ?? localStorage.authToken;
        },
        isAuthenticated() {
            return !!this.authToken;
        },
    },
    actions: {
        async signUp({email, username, password, initialLanguage}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/auth/users/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        email: email,
                        username: username,
                        password: password,
                        initialLanguage: initialLanguage
                    })
                },
                false);
        },
        async login({email, username, password}) {
            const store = useStore();
            const responseData = await store.fetchCustom(
                `${store.apiUrl}/auth/token/login/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        email: email,
                        username: username,
                        password: password,
                    })
                },
                false);
            localStorage.authToken = responseData.auth_token;
            this.token = responseData.auth_token;
        },

        async signOut() {
            const store = useStore();
            await store.fetchCustom(
                `${store.apiUrl}/auth/token/logout/`,
                {
                    method: "POST",
                },
                true);

            delete localStorage.authToken;
            this.token = null;
            //TODO clear local pinia store data (like languages learning, profile etc)
        },
    }
})