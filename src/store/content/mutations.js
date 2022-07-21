export default {
    setUserLanguages(state, payload) {
        state.userLanguages = payload.languages;
    },
    setLastOpenedLanguage(state, payload) {
        if (!state.userLanguages || state.userLanguages.length < 2)
            return;

        for (let i = 1; i < state.userLanguages.length; i++) {
            if (state.userLanguages[i].code === payload.language)
                // swap with userLanguages[0]
                [state.userLanguages[i], state.userLanguages[0]] = [state.userLanguages[0], state.userLanguages[i]];
        }
    }
}