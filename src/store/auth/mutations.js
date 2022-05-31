export default {
    setToken(state, payload) {
        state.token = payload.token;
    },
    setUserLanguages(state, payload) {
        state.userLanguages = payload.languages;
    }
}