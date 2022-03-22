import { createStore } from "vuex";
import authModule from './auth/index.js'
import contentModule from './content/index.js'
const store = createStore({
    state: {
        baseUrl: `http://localhost:8000/api/v1`,
    },
    modules: {
        authModule,
        contentModule,
    },
    getters: {
        baseUrl(state) {
            return state.baseUrl;
        },
    }
});



export default store;