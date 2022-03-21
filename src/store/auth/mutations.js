export default {
    async createUser(store, payload) {
        try {
            const response = await fetch(`${store.base_url}/api/v1/auth/users/`, {
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
    async authUser(store, payload) {
        try {
            const response = await fetch(`${store.base_url}/api/v1/auth/token/login/`, {
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
    }
}