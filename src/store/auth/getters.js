export default {
    getUser(state) {
        if (state.token)
            return state.token;
        else if (localStorage.auth_token) {
            //TODO: verify token somehow
            state.token = localStorage.auth_token;
            return state.token
        }
        else
            return null
    },
    isAuthenticated(state, getters) {
        return !!getters.getUser;
    }
}