export default {
    baseUrl(state) {
        return state.baseUrl;
    },
    getUser(state) {
        if (state.token)
            return state.token;
        else if (localStorage.auth_token) {
            state.token = localStorage.auth_token;
            return state.token
        }
        else
            return null
    },
    isAuthenticated(state) {
        return !!state.token;
    }
}