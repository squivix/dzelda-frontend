export default {
    async signUp(context, payload) {
        try {
            const response = await fetch(`${context.getters.baseUrl}/api/v1/auth/users/`, {
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
                console.log("vuexstore:auth/signUp:Something went wrong")
                throw new Error(await response.text())
            }
        } catch (error) {
            console.log(error);
        }
    },
    async login(context, payload) {
        const response = await fetch(`${context.getters.baseUrl}/api/v1/auth/token/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            const responseData = await response.json();
            context.dispatch("saveUser", { token: responseData.auth_token });
        } else {
            console.log("vuexstore:auth/login:Something went wrong")
            throw new Error(await response.text())
        }
    },

    saveUser(context, payload) {
        if (!payload.token)
            return;
        localStorage.auth_token = payload.token;
        context.commit("setUser", { token: payload.auth_token });
    }
}