import {createStore} from "vuex";
import authModule from './auth/index.js'
import contentModule from './content/index.js'
import readerModule from './reader/index.js';

const store = createStore({
    strict: true,
    state: {
        baseUrl: `http://localhost:8000`,
    },
    modules: {
        authModule,
        contentModule,
        readerModule,
    },
    getters: {
        baseUrl(state) {
            return state.baseUrl;
        },
        apiUrl(state) {
            return `${state.baseUrl}/api/v1`;
        },
    },
});


export default store;