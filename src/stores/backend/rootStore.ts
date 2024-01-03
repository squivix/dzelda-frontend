import {defineStore} from "pinia";
import {useUserStore} from "@/stores/backend/userStore.js";
import {ApiClient, HttpResponse} from "dzelda-common";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import {secondsToMs} from "@/utils.js";

const DEFAULT_CACHE_TIME = secondsToMs(30);
export const useStore = defineStore("main", {
        state() {
            const baseUrl = import.meta.env._BACKEND_URL;
            const resourceUrl = `${baseUrl}`;
            const apiUrl = `${baseUrl}/api/v1`;
            return {
                baseUrl,
                resourceUrl,
                apiUrl,
                apiClient: new ApiClient<string>({
                    baseUrl: apiUrl,
                    securityWorker: token => token ? {headers: {Authorization: `Bearer ${token}`}} : {},
                }),
                cache: {} as Record<string, { timeCached: Date, expiryTimeInMs: number, data: any }>
            };
        },
        actions: {
            async fetchCustom<T, E>(endpoint: (api: ApiClient<string>) => Promise<HttpResponse<T, E>>, {
                cacheKey,
                clearCache = false,
                expiryTimeInMs,
                ignore401 = false
            }: {
                clearCache?: boolean,
                cacheKey?: string,
                expiryTimeInMs?: number,
                ignore401?: boolean
            } = {}): typeof cacheKey extends undefined ? Promise<HttpResponse<T, E>> : Promise<{
                cacheHit: true,
                data: T
            } | HttpResponse<T, E>> {
                const userStore = useUserStore();
                this.apiClient.setSecurityData(userStore.authToken);
                let response;
                if (cacheKey !== undefined) {
                    if (clearCache)
                        delete this.cache[cacheKey];
                    else if (cacheKey in this.cache) {
                        const cacheHit = this.cache[cacheKey];
                        if (new Date().getTime() - this.cache[cacheKey].timeCached.getTime() > cacheHit.expiryTimeInMs)
                            delete this.cache[cacheKey];
                        else
                            return {cacheHit: true, data: this.cache[cacheKey].data};
                    }
                }
                try {
                    response = await endpoint(this.apiClient as ApiClient<string>);   //for some reason this.apiClient is any :/
                } catch (e) {
                    const message = "We're having trouble reaching our servers, please come back later";
                    const messageBarStore = useMessageBarStore();
                    messageBarStore.addMessage({text: message, type: MessageType.ERROR});
                    await this.router.push({name: "server-side-error"});
                    throw new Error(message as string);
                }
                if (response.status >= 500)
                    await this.router.push({name: "server-side-error"});
                else if (response.status == 401 && !ignore401) {
                    userStore.authToken = null;
                    this.router.push({name: "home"});
                }
                if (cacheKey !== undefined)
                    this.cache[cacheKey] = {timeCached: new Date(), data: response.data, expiryTimeInMs: expiryTimeInMs ?? DEFAULT_CACHE_TIME};
                return response;
            },

        }
    })
;

