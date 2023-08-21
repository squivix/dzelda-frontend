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
            async fetchCustom<T, E>(endpoint: (api: ApiClient<string>) => Promise<HttpResponse<T, E>>, doCache = false, cacheStore?: Record<string, any>, cacheKey?: string): Promise<HttpResponse<T, E>> {
                if (doCache && cacheStore && cacheKey) {
                    const hit = cacheStore[cacheKey];
                    if (hit)
                        return hit;
                }
                const authStore = useAuthStore();
                this.apiClient.setSecurityData(authStore.authToken);
                const response = await endpoint(this.apiClient as ApiClient<string>);   //for some reason this.apiClient is any :/
                if (response.ok && response.status !== 204) {
                    if (doCache && cacheStore && cacheKey)
                        cacheStore[cacheKey] = response.data;
                } else if (response.status >= 500) {
                    const message = "Something went wrong server-side";
                    const messageBarStore = useMessageBarStore();
                    messageBarStore.addMessage({text: message, type: MessageType.ERROR})
                    throw new Error(message);
                } else if (response.status == 401) {
                    authStore.token = null;
                    delete localStorage.authToken;
                    //TODO don't redirect for failed login, but do for any other auth problems
                    this.router.push({name: "home"})
                }
                return response;
            },

        }
    })
;

