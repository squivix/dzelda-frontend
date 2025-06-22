import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {cleanUndefined} from "@/utils.js";
import {useMessageBarStore} from "@/stores/messageBarStore.js";
import type {CollectionSchema} from "dzelda-common";

export const useCollectionStore = defineStore("collection", {
    actions: {
        async fetchCollections(queryParams: {
            languageCode?: string,
            addedBy?: string,
            sortBy?: "title" | "createdDate" | "avgPastViewersCountPerText",
            sortOrder?: "asc" | "desc",
            searchQuery?: string,
            page?: number,
            pageSize?: number,
        } = {}, {secure = false}: {
            secure?: boolean
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.collections.getCollections(queryParams, {secure: secure}), {clearMessageBar:false});

            return response.data;
        },
        async fetchUserBookmarkedCollections(queryParams: {
            languageCode?: string,
            searchQuery?: string,
            addedBy?: string,
            pageSize?: number,
            page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersMeCollectionsBookmarked(queryParams), {clearMessageBar:false});

            return response.data;
        },
        async createCollection(body: {
            languageCode: string,
            title: string,
            description: string,
            image: string | undefined,
            isPublic: boolean,
            texts?: Array<{ title: string, content: string }>
        }) {
            const store = useStore();
            return await store.fetchCustom((api) => api.collections.postCollections(cleanUndefined({
                languageCode: body.languageCode,
                title: body.title,
                description: body.description,
                isPublic: body.isPublic,
                texts: body.texts,
                image: body.image as string | undefined,
            })));
        },
        async fetchCollection(pathParams: {
            collectionId: number
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.collections.getCollectionsCollectionId(pathParams.collectionId), {clearMessageBar:false}) as Awaited<ReturnType<typeof store.apiClient.collections.getCollectionsCollectionId>>;

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
            isPublic: boolean,
            textsOrder: number[]
        }) {
            const store = useStore();
            return await store.fetchCustom((api) => api.collections.putCollectionsCollectionId(pathParams.collectionId,
                cleanUndefined({
                    title: body.title,
                    description: body.description,
                    isPublic: body.isPublic,
                    textsOrder: body.textsOrder,
                    image: body.image
                })));
        },
        async toggleCollectionBookmark(collection: CollectionSchema) {
            if (!collection.isBookmarked)
                return this.addCollectionToUserBookmarks({collectionId: collection.id});
            else
                return this.removeCollectionFromUserBookmarks({collectionId: collection.id});
        },
        async addCollectionToUserBookmarks(body: {
            collectionId: number
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeCollectionsBookmarked({collectionId: body.collectionId}));
            return response.data;
        },
        async removeCollectionFromUserBookmarks(pathParams: {
            collectionId: number
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.deleteUsersMeCollectionsBookmarkedCollectionId(pathParams.collectionId));
            return response.data;
        },
        async deleteCollection(pathParams: { collectionId: number },queryParams:{cascadeTexts:boolean}) {
            const store = useStore();
            await store.fetchCustom((api) => api.collections.deleteCollectionsCollectionId(pathParams.collectionId,{cascadeTexts:queryParams.cascadeTexts}));
        }
    }
});
