export default {
    userToken(state) {
        return state.token ?? localStorage.authToken;
    },
    isAuthenticated(state, getters) {
        return !!getters.userToken;
    },
}