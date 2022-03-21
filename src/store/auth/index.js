import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
    state() {
        return {
            baseUrl: `http://localhost:8000`,
            token: null,
        };
    },
    mutations,
    actions,
    getters,
}