import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
    state() {
        return{
            base_url: `http://localhost:8000`
        };
    },
    mutations,
    actions,
    getters,
}