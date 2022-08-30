import {createStore} from "vuex";
import auth from './auth/index.js'
import content from './content/index.js'
import reader from './reader/index.js';

const store = createStore({
    strict: true,
    state: {
        baseUrl: `http://localhost:8000`,
    },
    modules: {
        auth,
        content,
        reader
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
            let options = {
                method: payload.options?.method ?? "GET",
                headers: payload.options?.headers ?? {
                    'Content-Type': 'application/json'
                },
                ...payload.options
            };

            const response = await fetch(payload.url, {
                method: options.method,
                headers: {
                    ...options.headers,
                    Authorization: payload.protected ? `Token ${context.getters["auth/userToken"]}` : undefined,
                },
                body: options.body
            });

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