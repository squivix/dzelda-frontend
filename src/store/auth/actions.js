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
                console.log("Something went wrong")
                throw new Error(await response.text())
            }
        } catch (error) {
            console.log(error);
        }
    },
    async login(context, payload) {
        try {
            const response = await fetch(`${context.getters.baseUrl}/api/v1/auth/token/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const responseData = await response.json();
                context.commit("setUser", { token: responseData.auth_token });
            } else {
                console.log("Something went wrong")
                return new Error(await response.text())
            }
        } catch (error) {
            return error;
        }

    }
}