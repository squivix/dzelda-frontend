import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";

export const useAuthStore = defineStore("auth", {
    state() {
        return {
            token: null as null | string,
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
        async signUp(body: { email: string, username: string, password: string, initialLanguage: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsers({
                email: body.email,
                username: body.username,
                password: body.password,
                initialLanguage: body.initialLanguage
            }));
            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async login(body: { username: string, password: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.sessions.postSessions({
                username: body.username,
                password: body.password,
            }), {ignore401: true});

            if (!response.ok)
                return response.error;

            localStorage.authToken = response.data.authToken;
            this.token = response.data.authToken;
            return
        },

        async signOut() {
            const store = useStore();
            await store.fetchCustom((api) => api.sessions.deleteSessions());
            delete localStorage.authToken;
            this.token = null;
            //TODO clear local pinia store data (like languages learning, profile etc)
        },
    }
})