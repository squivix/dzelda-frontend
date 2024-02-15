import {defineStore} from "pinia";
import {useUserStore} from "@/stores/backend/userStore.js";
import {ApiClient, HttpResponse} from "dzelda-common";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import {secondsToMs} from "@/utils.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

const DEFAULT_CACHE_TIME = secondsToMs(30);
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
            async fetchCustom<T, E>(endpoint: (api: ApiClient<string>) => Promise<HttpResponse<T, E>>, {
                cacheKey,
                clearCache = false,
                expiryTimeInMs,
                ignore401 = false,
                ignore5XX = false
            }: {
                clearCache?: boolean,
                cacheKey?: string,
                expiryTimeInMs?: number,
                ignore401?: boolean,
                ignore5XX?: boolean
            } = {}): typeof cacheKey extends undefined ? Promise<HttpResponse<T, E>> : Promise<{
                ok: true,
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
                            return {ok: true, cacheHit: true, data: this.cache[cacheKey].data};
                    }
                }
                try {
                    response = await endpoint(this.apiClient as ApiClient<string>);   //for some reason this.apiClient is any :/
                } catch (error) {
                    if (!["Failed to fetch"].includes((error as any).message))
                        throw error;
                    console.error(error);
                    const message = "We're having trouble reaching our servers, please come back later";
                    if (!ignore5XX) {
                        const messageBarStore = useMessageBarStore();
                        messageBarStore.addMessage({text: message, type: MessageType.ERROR});
                        await this.router.push({name: "server-side-error"});
                    }
                    throw new Error(message as string);
                }
                if (response.status >= 500 && !ignore5XX)
                    await this.router.push({name: "server-side-error"});
                else if (response.status == 401 && !ignore401)
                    userStore.clearUserData();
                if (cacheKey !== undefined)
                    this.cache[cacheKey] = {timeCached: new Date(), data: response.data, expiryTimeInMs: expiryTimeInMs ?? DEFAULT_CACHE_TIME};
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
                    messageBarStore.addMessage({text: "Failed to request file upload, please try again", type: MessageType.ERROR});
                    return;
                }
                const {uploadUrl, uploadFormFields, objectKey} = response1.data;
                const form = new FormData();
                Object.entries(uploadFormFields).forEach(([field, value]) => form.append(field, value));
                form.append("file", file);
                const response2 = await fetch(uploadUrl, {method: "POST", body: form});
                if (!response2.ok) {
                    const messageBarStore = useMessageBarStore();
                    messageBarStore.addMessage({text: "Failed to upload file, please try again", type: MessageType.ERROR});
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


