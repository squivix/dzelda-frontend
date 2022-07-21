export default {
    userLanguages(state) {
        return state.userLanguages;
    },
    currentLanguage(state) {
        return state.userLanguages ? state.userLanguages[0] : null;
    },

}