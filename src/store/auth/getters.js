export default {
    getUserToken(state) {
        return state.token ?? localStorage.auth_token;
    },
    isAuthenticated(state, getters) {
        return !!getters.getUserToken;
    }
}