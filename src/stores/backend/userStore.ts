import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import {UserSchema} from "dzelda-common";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {cleanUndefined} from "@/utils.js";
import {useStorage} from "@vueuse/core";

export const useUserStore = defineStore("auth", {
    state() {
        return {
            userAccount: null as UserSchema | null,
            authToken: useStorage("authToken", null as null | string),
        };
    },
    getters: {
        isAuthenticated(state) {
            return !!state.authToken;
        },
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
        async signUp(body: {
            email: string,
            username: string,
            password: string
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsers({
                email: body.email,
                username: body.username,
                password: body.password
            }));
            if (!response.ok)
                return response.error;
            return;
        },
        async login(body: {
            username: string,
            password: string
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.sessions.postSessions({
                username: body.username,
                password: body.password,
            }), {ignore401: true});

            if (!response.ok)
                return response.error;

            this.authToken = response.data.authToken;
            return;
        },
        async signOut() {
            useMessageBarStore().clearMessages();
            const store = useStore();
            await store.fetchCustom((api) => api.sessions.deleteSessions());
            this.authToken = null;
            this.userAccount = null;
            store.clearUserData();
        },
        async requestEmailConfirmToken(body: {
            email?: string
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            return await store.fetchCustom((api) => api.emailConfirmTokens.postEmailConfirmTokens({email: body.email}, {format: "json"}));
        },
        async requestPasswordReset(body: {
            username: string,
            email: string
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            await store.fetchCustom((api) => api.passwordResetTokens.postPasswordResetTokens({
                username: body.username,
                email: body.email
            }));
        },
        async validatePasswordResetToken(body: {
            token: string
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.passwordResetTokens.postPasswordResetTokensVerify({token: body.token}), {ignore401: true});
            return response.ok;
        },
        async resetPassword(body: {
            token: string,
            newPassword: string
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            return await store.fetchCustom((api) => api.users.postUsersMePasswordReset({
                token: body.token,
                newPassword: body.newPassword
            }, {format: "json"}), {ignore401: true});
        },
        async confirmEmail(body: {
            token: string
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeEmailConfirm({
                token: body.token
            }), {ignore401: true});
            return response.ok;
        },
        async changeEmail(body: {
            newEmail: string
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            return await store.fetchCustom((api) => api.users.putUsersMeEmail({
                    newEmail: body.newEmail
                },
                {format: "json"}   //workaround, see https://github.com/acacode/swagger-typescript-api/issues/536#issuecomment-1737274548
            ));
        },
        async changePassword(body: {
            oldPassword: string,
            newPassword: string,
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.putUsersMePassword({
                oldPassword: body.oldPassword,
                newPassword: body.newPassword
            }, {format: "json"}), {ignore401: true});
            if (!response.ok)
                return response.error;
        },
        async deleteAccount() {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.deleteUsersMe());
            if (response.ok) {
                this.authToken = null;
                this.userAccount = null;
                const messageBarStore = useMessageBarStore();
                messageBarStore.addMessage({text: "Account deleted.", type: MessageType.INFO});
                this.router.push({name: "home"});
            }
            return response.ok;
        },
        async updateUserProfile(body: { bio: string, profilePicture: string | undefined }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.putUsersMeProfile(cleanUndefined({
                bio: body.bio,
                profilePicture: body.profilePicture
            })));

            if (response.ok)
                await this.fetchUserAccount(true);
            return response;
        }
    }
});
