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
        auth: authModule,
        content: contentModule,
        reader: readerModule,
    },
    getters: {
        baseUrl(state) {
            return state.baseUrl;
        },
        apiUrl(state) {
            return `${state.baseUrl}/api/v1`;
        },
    },
    actions: {
        async fetchCustom(context, payload) {
            let response;
            if (payload.protected)
                response = await context.dispatch("auth/fetchProtected", {url: payload.url, options: payload.options});
            else
                response = await fetch(payload.url, payload.options);
            if (response.ok && response.status !== 204)
                return await response.json();
            else if (response.status >= 400 && response.status < 500) {
                const responseData = await response.text();
                console.log(`vuexstore:${payload.module}/${payload.caller}:Response code ${response.status}: ${responseData}`)
                throw new Error(responseData);
            }
        }
    }
});


export default store;