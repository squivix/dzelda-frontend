import {defineStore} from "pinia";
import {useAuthStore} from "@/stores/auth";
import {retarget} from "jsdom/lib/jsdom/living/helpers/shadow-dom.js";

export const useStore = defineStore("main", {
    state() {
        return {
            baseUrl: `http://localhost:8000`,
        };
    },
    getters: {
        apiUrl(state) {
            return `${state.baseUrl}/api/v1`;
        },
    },
    actions: {
        async fetchCustom(url, options, isProtected, doCache, cacheStore, cacheKey) {
            if (doCache) {
                const hit = cacheStore[cacheKey];
                if (hit)
                    return hit;
            }
            options = {
                method: options?.method ?? "GET",
                headers: options?.headers ?? {
                    "Content-Type": "application/json"
                },
                ...options
            };

            const authStore = useAuthStore();
            const response = await fetch(url, {
                method: options.method,
                headers: {
                    ...options.headers,
                    Authorization: isProtected ? `Token ${authStore.authToken}` : undefined,
                },
                body: options.body
            });

            if (response.ok && response.status !== 204) {
                const data = await response.json();
                if (doCache)
                    cacheStore[cacheKey] = data;
                return data;
            } else if (response.status >= 400 && response.status < 500) {
                if (response.status === 401) {
                    authStore.token = null;
                    delete localStorage.authToken;
                }

                const responseData = await response.text();
                throw new Error(responseData);
            }
        }
    }
});

