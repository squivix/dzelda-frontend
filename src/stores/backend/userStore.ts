import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import {UserSchema} from "dzelda-types";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {cleanUndefined} from "@/utils.js";

export const useUserStore = defineStore("auth", {
    state() {
        return {
            userAccount: null as UserSchema | null,
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
            this.userAccount = null;
            const languageStore = useLanguageStore();
            languageStore.clearUserData();
        },
        async requestEmailConfirmToken(body: {
            email?: string
        }) {
            const store = useStore();
            await store.fetchCustom((api) => api.emailConfirmTokens.postEmailResetTokens({email: body.email}));
        },
        async requestPasswordReset(body: {
            username: string,
            email: string
        }) {
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
            const response = await store.fetchCustom((api) => api.passwordResetTokens.postPasswordResetTokensValidate({token: body.token}), {ignore401: true});
            return response.ok;
        },
        async resetPassword(body: {
            token: string,
            newPassword: string
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMePasswordReset({
                token: body.token,
                newPassword: body.newPassword
            }));
            return response.ok;
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
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.putUsersMeEmail({
                    newEmail: body.newEmail
                },
                {format: "json"}   //workaround, see https://github.com/acacode/swagger-typescript-api/issues/536#issuecomment-1737274548
            ));
            if (!response.ok)
                return response.error;
            return;
        },
        async changePassword(body: {
            oldPassword: string,
            newPassword: string,
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.putUsersMePassword({
                oldPassword: body.oldPassword,
                newPassword: body.newPassword
            }, {format: "json"}));
            if (!response.ok)
                return response.error;
        },
        async deleteAccount() {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.deleteUsersMe());
            if (response.ok) {
                delete localStorage.authToken;
                this.token = null;
                const messageBarStore = useMessageBarStore();
                messageBarStore.addMessage({text: "Account deleted.", type: MessageType.INFO});
                this.router.push({name: "home"});
            }
            return response.ok;
        },
        async updateUserProfile(body: { bio: string, profilePicture: File | "" | undefined }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.putUsersMeProfile(cleanUndefined({
                data: {
                    bio: body.bio
                },
                profilePicture: body.profilePicture
            })));

            // handle your 4XX errors as you may
            //...
            if (response.ok) {
                await this.fetchUserAccount(true)
            }
            return response.ok;
        }
    }
});
