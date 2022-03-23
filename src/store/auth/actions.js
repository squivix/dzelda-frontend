export default {
    async signUp(context, payload) {
        const response = await fetch(`${context.getters.baseUrl}/auth/users/`, {
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
        const response = await fetch(`${context.getters.baseUrl}/auth/token/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            const responseData = await response.json();
            context.dispatch("saveToken", { token: responseData.auth_token });
        } else {
            const responseData = await response.text();
            console.log(`vuexstore:auth/login:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData)
        }
    },


    async signOut(context) {
        const response = await fetch(`${context.getters.baseUrl}/auth/token/logout/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${context.getters.user}`,
            },
        });
        if (response.ok) {
            context.dispatch("deleteToken");
        } else {
            const responseData = await response.text();
            console.log(`vuexstore:auth/login:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData)
        }
    },

    saveToken(context, payload) {
        if (!payload.token)
            return;
        localStorage.auth_token = payload.token;
        context.commit("setToken", { token: payload.auth_token });
    },


    deleteToken(context) {
        delete localStorage.auth_token;
        context.commit("setToken", { token: null });
    }
}