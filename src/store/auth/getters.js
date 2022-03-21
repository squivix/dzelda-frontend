export default {
    baseUrl(state) {
        return state.baseUrl;
    },
    isAuthenticated(state) {
        return !!state.token;
    }
}