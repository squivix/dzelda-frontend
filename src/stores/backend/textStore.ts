import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {LanguageLevelSchema, TextSchema} from "dzelda-common";
import {cleanUndefined} from "@/utils.js";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

export const useTextStore = defineStore("text", {
    actions: {
        async fetchTexts(queryParams: {
            languageCode?: string,
            sortBy?: "title" | "createdDate" | "pastViewersCount",
            sortOrder?: "asc" | "desc",
            pageSize?: number,
            page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.texts.getTexts(queryParams));
            return response.data;
        },
        async fetchTextsInHistory(queryParams: {
            languageCode?: string,
            sortBy?: "title" | "timeViewed" | "createdDate" | "pastViewersCount",
            sortOrder?: "asc" | "desc",
            searchQuery?: string,
            pageSize?: number,
            page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersMeTextsHistory(queryParams));
            return response.data;
        },
        async createText(body: {
            title: string,
            content: string,
            languageCode: string,
            collectionId: number | null,
            isPublic: boolean,
            level: "beginner1" | "beginner2" | "intermediate1" | "intermediate2" | "advanced1" | "advanced2",
            image: string | undefined,
            audio: string | undefined
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            return await store.fetchCustom((api) => api.texts.postTexts(cleanUndefined({
                title: body.title,
                content: body.content,
                languageCode: body.languageCode,
                level: body.level,
                isPublic: body.isPublic,
                collectionId: body.collectionId,
                image: body.image,
                audio: body.audio,
            })));
        },
        async updateText(pathParams: { textId: number }, body: {
            collectionId: number | undefined | null,
            title: string,
            content: string,
            image: string | undefined,
            level: LanguageLevelSchema,
            isPublic: boolean,
            audio: string | undefined
        }) {
            const store = useStore();
            return await store.fetchCustom((api) => api.texts.patchTextsTextId(pathParams.textId, cleanUndefined({
                collectionId: body.collectionId,
                title: body.title,
                content: body.content,
                image: body.image,
                audio: body.audio,
                level: body.level,
                isPublic: body.isPublic
            })));
        },
        async addTextToUserHistory(body: { textId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeTextsHistory({
                textId: body.textId
            }));
            if (response.status == 404)
                await this.router.push({name: "not-found"});
        },
        async fetchText(pathParams: { textId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.texts.getTextsTextId(pathParams.textId));
            if (response.status == 404)
                await this.router.push({name: "not-found"});
            return response.data;
        },
        async fetchNextText(pathParams: { textId: number, collectionId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.collections.getCollectionsCollectionIdTextsTextIdNext(pathParams.collectionId, pathParams.textId));
            if (response.redirected) {
                response.data = await response.json();
                return response.data as TextSchema;
            } else
                return null;
        }
    }
});