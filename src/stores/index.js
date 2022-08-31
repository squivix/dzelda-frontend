import {defineStore} from "pinia";
import {useAuthStore} from "@/stores/auth";

export const useStore = defineStore("main", {
    state() {
        return {
            baseUrl: `http://localhost:8000`,
        }
    },
    getters: {
        apiUrl(state) {
            return `${state.baseUrl}/api/v1`;
        },
    },
    actions: {
        async fetchCustom(url, options, isProtected) {
            options = {
                method: options?.method ?? "GET",
                headers: options?.headers ?? {
                    'Content-Type': 'application/json'
                },
                ...options
            };

            const authStore = useAuthStore();
            const response = await fetch(url, {
                method: options.method,
                headers: {
                    ...options.headers,
                    Authorization: isProtected ? `Token ${authStore.userToken}` : undefined,
                },
                body: options.body
            });

            if (response.ok && response.status !== 204)
                return await response.json();
            else if (response.status >= 400 && response.status < 500) {
                const responseData = await response.text();
                throw new Error(responseData);
            }
        }
    }
});

