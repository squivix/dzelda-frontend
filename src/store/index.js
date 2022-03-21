import { createStore } from "vuex";
import authModule from './auth/index.js'
const store = createStore({
    modules: {
        authModule,
    }
});



export default store;