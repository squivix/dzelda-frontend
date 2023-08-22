import {defineStore} from "pinia";
import {useAuthStore} from "@/stores/backend/authStore.js";
import {ApiClient, HttpResponse} from "dzelda-types";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";


export const useStore = defineStore("main", {
        state() {
            const baseUrl = import.meta.env._BACKEND_URL;
            const resourceUrl = `${baseUrl}/public`;
            const apiUrl = `${baseUrl}/api/v1`;
            return {
                baseUrl,
                resourceUrl,
                apiUrl,
                apiClient: new ApiClient<string>({
                    baseUrl: apiUrl,
                    securityWorker: token => token ? {headers: {Authorization: `Bearer ${token}`}} : {},
                })
            };
        },
        actions: {
            async fetchCustom<T, E>(endpoint: (api: ApiClient<string>) => Promise<HttpResponse<T, E>>, options?: { ignore401?: boolean }): Promise<HttpResponse<T, E>> {
                const authStore = useAuthStore();
                this.apiClient.setSecurityData(authStore.authToken);
                const response = await endpoint(this.apiClient as ApiClient<string>);   //for some reason this.apiClient is any :/
                if (response.status >= 500) {
                    const message = "Something went wrong server-side, please come back later";
                    const messageBarStore = useMessageBarStore();
                    messageBarStore.addMessage({text: message, type: MessageType.ERROR})
                    throw new Error(response.errorMessage as string);
                } else if (response.status == 401 && !options?.ignore401) {
                    authStore.token = null;
                    delete localStorage.authToken;
                    this.router.push({name: "home"})
                }
                return response;
            },

        }
    })
;

