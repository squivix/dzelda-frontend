export default {
    signUp(context, payload) {
        context.commit("createUser", {
            email: payload.email,
            username: payload.username,
            password: payload.password,
        })

    },
    login(context, payload) {
        context.commit("authUser", {
            username: payload.username,
            password: payload.password,
        })

    }
}