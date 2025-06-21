import {defineStore} from "pinia";
import {useUserStore} from "@/stores/backend/userStore.js";
import {ApiClient, HttpResponse} from "dzelda-common";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import {secondsToMs} from "@/utils.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

const DEFAULT_CACHE_TIME = secondsToMs(30);
type CacheReturnType<T> = {
    ok: true,
    cacheHit: true,
    data: T
}
export const useStore = defineStore("main", {
        state() {
            const apiUrl = `${import.meta.env._BACKEND_URL}/api/v1`;
            return {
                apiUrl,
                apiClient: new ApiClient<string>({
                    baseUrl: apiUrl,
                    securityWorker: token => token ? {headers: {Authorization: `Bearer ${token}`}} : {},
                }),
                cache: {} as Record<string, { timeCached: Date, expiryTimeInMs: number, data: any }>
            };
        },
        actions: {
            async fetchCustomWithCache<T, E>(endpoint: (api: ApiClient<string>) => Promise<HttpResponse<T, E>>, cacheKey: string, {
                clearCache = false,
                expiryTimeInMs,
                ignore401 = false,
                ignore5XX = false,
                clearMessageBar = true
            }: {
                clearCache?: boolean,
                expiryTimeInMs?: number,
                ignore401?: boolean,
                ignore5XX?: boolean
                clearMessageBar?: boolean
            }): Promise<CacheReturnType<T> | HttpResponse<T, E>> {
                const userStore = useUserStore();
                this.apiClient.setSecurityData(userStore.authToken);
                if (clearCache)
                    delete this.cache[cacheKey];
                else if (cacheKey in this.cache) {
                    const cacheHit = this.cache[cacheKey];
                    if (new Date().getTime() - this.cache[cacheKey].timeCached.getTime() > cacheHit.expiryTimeInMs)
                        delete this.cache[cacheKey];
                    else
                        return {ok: true, cacheHit: true, data: this.cache[cacheKey].data};
                }
                const response = await this.fetchCustom(endpoint, {ignore401, ignore5XX, clearMessageBar});
                if (cacheKey !== undefined)
                    this.cache[cacheKey] = {timeCached: new Date(), data: response.data, expiryTimeInMs: expiryTimeInMs ?? DEFAULT_CACHE_TIME};
                return response;
            },
            async fetchCustom<T, E>(endpoint: (api: ApiClient<string>) => Promise<HttpResponse<T, E>>, {ignore401 = false, ignore5XX = false, clearMessageBar = true}: {
                ignore401?: boolean,
                ignore5XX?: boolean,
                clearMessageBar?: boolean
            } = {}) {
                if (clearMessageBar)
                    useMessageBarStore().clearTopBarMessages();
                const userStore = useUserStore();
                this.apiClient.setSecurityData(userStore.authToken);
                let response;
                try {
                    response = await endpoint(this.apiClient as ApiClient<string>);   //for some reason this.apiClient is any :/
                } catch (error) {
                    if (!["Failed to fetch"].includes((error as any).message))
                        throw error;
                    console.error(error);
                    const message = "We're having trouble reaching our servers, please come back later";
                    if (!ignore5XX) {
                        const messageBarStore = useMessageBarStore();
                        messageBarStore.addTopBarMessage({text: message, type: MessageType.ERROR});
                        await this.router.push({name: "server-side-error"});
                    }
                    throw new Error(message as string);
                }
                if (response.status >= 500 && !ignore5XX)
                    await this.router.push({name: "server-side-error"});
                else if (response.status == 401 && !ignore401)
                    userStore.clearUserData();
                else if (response.status == 429) {
                    const messageBarStore = useMessageBarStore();
                    messageBarStore.addTopBarMessage({text: "Too many requests, please wait 1 minute and refresh page", type: MessageType.ERROR});
                }
                return response;
            },
            async uploadFile({fileField, fileExtension, file}: { fileField: string, fileExtension: string, file: File }): Promise<string | undefined> {
                const store = useStore();
                const response1 = await store.fetchCustom((api) => api.fileUploadRequests.postFileUploadRequest({
                    fileField: fileField,
                    fileExtension: fileExtension,
                }));
                if (!response1.ok) {
                    const messageBarStore = useMessageBarStore();
                    messageBarStore.addTopBarMessage({text: "Failed to request file upload, please try again", type: MessageType.ERROR});
                    return;
                }
                const {uploadUrl, uploadFormFields, objectKey} = response1.data;
                const form = new FormData();
                Object.entries(uploadFormFields).forEach(([field, value]) => form.append(field, value));
                form.append("file", file);
                const response2 = await fetch(uploadUrl, {method: "POST", body: form});
                if (!response2.ok) {
                    const messageBarStore = useMessageBarStore();
                    messageBarStore.addTopBarMessage({text: "Failed to upload file, please try again", type: MessageType.ERROR});
                    return;
                }
                return objectKey;
            },
            clearUserData() {
                const languageStore = useLanguageStore();
                this.cache = {};
                languageStore.clearUserData();
            }
        }
    })
;


