import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {cleanUndefined} from "@/utils.js";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

export const useCollectionStore = defineStore("collection", {
    actions: {
        async fetchCollections(queryParams: {
            languageCode?: string,
            addedBy?: string,
            level?: string[],
            sortBy?: "title" | "createdDate" | "avgPastViewersCountPerLesson",
            sortOrder?: "asc" | "desc",
            searchQuery?: string,
            page?: number,
            pageSize?: number,
        } = {}, {secure = false}: {
            secure?: boolean
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.collections.getCollections(queryParams, {secure: secure}));

            return response.data;
        },
        async fetchUserBookmarkedCollections(queryParams: {
            languageCode?: string,
            searchQuery?: string,
            addedBy?: string,
            level?: string[],
            pageSize?: number,
            page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersMeCollectionsBookmarked(queryParams));

            return response.data;
        },
        async createCollection(body: {
            languageCode: string,
            title: string,
            description: string,
            image: string | undefined,
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            return await store.fetchCustom((api) => api.collections.postCollections(cleanUndefined({
                languageCode: body.languageCode,
                title: body.title,
                description: body.description,
                image: body.image as string | undefined,
            }))) as Awaited<ReturnType<typeof store.apiClient.collections.postCollections>>;
        },
        async fetchCollection(pathParams: {
            collectionId: number
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.collections.getCollectionsCollectionId(pathParams.collectionId)) as Awaited<ReturnType<typeof store.apiClient.collections.getCollectionsCollectionId>>;

            if (response.status == 404)
                await this.router.push({name: "not-found"});
            return response.data;
        },
        async updateCollection(pathParams: {
            collectionId: number
        }, body: {
            title: string,
            description: string,
            image: string | undefined,
            lessonsOrder: number[]
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            return await store.fetchCustom((api) => api.collections.putCollectionsCollectionId(pathParams.collectionId,
                cleanUndefined({
                    title: body.title,
                    description: body.description,
                    lessonsOrder: body.lessonsOrder,
                    image: body.image
                })));
        },
        async addCollectionToUserBookmarks(body: {
            collectionId: number
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeCollectionsBookmarked({collectionId: body.collectionId}));
            return response.data;
        },
        async removeCollectionFromUserBookmarks(pathParams: {
            collectionId: number
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.deleteUsersMeCollectionsBookmarkedCollectionId(pathParams.collectionId));
            return response.data;
        },
        async deleteCollection(pathParams: { collectionId: number }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            await store.fetchCustom((api) => api.collections.deleteCollectionsCollectionId(pathParams.collectionId));
        }
    }
});
