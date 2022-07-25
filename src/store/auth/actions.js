import router from '../../router.js'


export default {
    async signUp(context, payload) {
        const response = await fetch(`${context.getters.apiUrl}/auth/users/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData)
        } else {
            const responseData = await response.text();
            console.log(`vuexstore:auth/signUp:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData)
        }
    },
    async login(context, payload) {
        const response = await fetch(`${context.getters.apiUrl}/auth/token/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            const responseData = await response.json();
            await context.dispatch("saveToken", {token: responseData.auth_token});
        } else {
            const responseData = await response.text();
            console.log(`vuexstore:auth/login:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData)
        }
    },


    async signOut(context) {
        //TODO clear local vuex data (like languages learning, profile etc)
        const response = await context.dispatch('fetchProtected', {
            url: `${context.getters.apiUrl}/auth/token/logout/`,
            options: {method: "POST"}
        });
        if (response.ok) {
            await context.dispatch("deleteToken");
        } else {
            const responseData = await response.text();
            console.log(`vuexstore:auth/signOut:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },

    saveToken(context, payload) {
        if (!payload.token)
            return;
        localStorage.auth_token = payload.token;
        context.commit("setToken", {token: payload.auth_token});
    },


    async fetchProtected(context, payload) {
        let options = {
            method: payload.options?.method ?? "GET",
            headers: payload.options?.headers ?? {
                'Content-Type': 'application/json'
            },
            ...payload.options
        };

        const response = await fetch(payload.url, {
            method: options.method,
            headers: {
                ...options.headers,
                Authorization: `Token ${context.getters.getUserToken}`,
            },
            body: options.body
        });
        if (response.status === 401) {
            await context.dispatch("deleteToken");
            await router.push({name: 'login'});
        } else
            return response;
    },

    async deleteToken(context) {
        delete localStorage.auth_token;
        await context.commit("setToken", {token: null});
    }

}