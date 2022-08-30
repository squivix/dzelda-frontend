import router from '@/router.js'


export default {
    async signUp(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/auth/users/`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    email: payload.email,
                    username: payload.username,
                    password: payload.password,
                    initialLanguage: payload.initialLanguage
                })
            },
            protected: false,
            caller: "signUp",
            module: "auth",
        }, {root: true});
    },
    async login(context, payload) {
        const responseData = await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/auth/token/login/`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    email: payload.email,
                    username: payload.username,
                    password: payload.password,
                })
            },
            protected: false,
            caller: "login",
            module: "auth",
        }, {root: true});

        await context.dispatch("saveToken", {token: responseData.auth_token});
    },

    saveToken(context, payload) {
        if (!payload.token)
            return;
        localStorage.authToken = payload.token;
        context.commit("setToken", {token: payload.token});
    },

    async signOut(context) {
        await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/auth/token/logout/`,
            options: {
                method: "POST",
            },
            protected: true,
            caller: "signOut",
            module: "auth",
        }, {root: true});

        await context.dispatch("deleteToken");
        //TODO clear local vuex data (like languages learning, profile etc)
    },


    async deleteToken(context) {
        delete localStorage.authToken;
        await context.commit("setToken", {token: null});
    }

}