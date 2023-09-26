import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";

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
        async signUp(body: { email: string, username: string, password: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsers({
                email: body.email,
                username: body.username,
                password: body.password
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
            return;
        },
        async signOut() {
            const store = useStore();
            await store.fetchCustom((api) => api.sessions.deleteSessions());
            delete localStorage.authToken;
            this.token = null;
            //TODO clear local pinia store data (like languages learning, profile etc)
        },
        async requestEmailConfirmToken(body: { email?: string }) {
            const store = useStore();
            await store.fetchCustom((api) => api.emailConfirmTokens.postEmailResetTokens({email: body.email}));
        },
        async requestPasswordReset(body: { username: string, email: string }) {
            const store = useStore();
            await store.fetchCustom((api) => api.passwordResetTokens.postPasswordResetTokens({
                username: body.username,
                email: body.email
            }));
        },
        async validatePasswordResetToken(body: { token: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.passwordResetTokens.postPasswordResetTokensValidate({token: body.token}), {ignore401: true});
            return response.ok;
        },
        async resetPassword(body: { token: string, newPassword: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMePasswords({
                token: body.token,
                newPassword: body.newPassword
            }));
            return response.ok;
        },
        async confirmEmail(body: { token: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeEmailConfirm({
                token: body.token
            }), {ignore401: true});
            return response.ok;
        },
        async changeEmail(body: { newEmail: string }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.putUsersMeEmail({
                newEmail: body.newEmail
            }));
            return response.ok;
        },
        async changePassword(body: { oldPassword: string, newPassword: string, }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.putUsersMePassword({
                oldPassword: body.oldPassword,
                newPassword: body.newPassword
            }));
            return response.ok;
        },
    }
});
