import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import type {LanguageLevelSchema, TextHistoryEntrySchema, TextSchema} from "dzelda-common";
import {cleanUndefined} from "@/utils.js";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

export const useTextStore = defineStore("text", {
    actions: {
        async fetchTexts(queryParams: {
            languageCode?: string,
            addedBy?: string,
            searchQuery?: string,
            hasAudio?: boolean,
            level?: string | string[],
            sortBy?: "title" | "createdDate" | "pastViewersCount",
            sortOrder?: "asc" | "desc",
            pageSize?: number,
            page?: number
        } = {}, {secure = false}: {
            secure?: boolean
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.texts.getTexts(queryParams, {secure: secure}), {clearMessageBar: false});
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
            const response = await store.fetchCustom((api) => api.users.getUsersMeTextsHistory(queryParams), {clearMessageBar: false});
            return response.data;
        },
        async createText(body: {
            title: string,
            content: string,
            languageCode: string,
            collectionId: number | null,
            isPublic: boolean,
            level: LanguageLevelSchema,
            image: string | undefined,
            audio: string | undefined
        }) {
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
            level: LanguageLevelSchema | undefined,
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
        async deleteText(pathParams: { textId: number }) {
            const store = useStore();
            return await store.fetchCustom((api) => api.texts.deleteTextsTextId(pathParams.textId));
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
            const response = await store.fetchCustom((api) => api.texts.getTextsTextId(pathParams.textId), {clearMessageBar: false});
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
        },
        async toggleTextBookmark(text: TextSchema | TextHistoryEntrySchema) {
            if (!text.isBookmarked)
                return this.addTextToUserBookmarks({textId: text.id});
            else
                return this.removeTextFromUserBookmarks({textId: text.id});
        },
        async addTextToUserBookmarks(pathParams: { textId: number }) {
            const store = useStore();
            await store.fetchCustom((api) => api.users.postUsersMeTextsBookmarked({textId: pathParams.textId}));
        },
        async removeTextFromUserBookmarks(pathParams: { textId: number }) {
            const store = useStore();
            await store.fetchCustom((api) => api.users.deleteUsersMeTextsBookmarkedTextId(pathParams.textId));
        },
        async fetchUserBookmarkedTexts(queryParams: {
            languageCode?: string,
            addedBy?: string,
            searchQuery?: string,
            hasAudio?: boolean,
            level?: string | string[],
            sortBy?: "title" | "createdDate" | "pastViewersCount",
            sortOrder?: "asc" | "desc",
            pageSize?: number,
            page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersMeTextsBookmarked(queryParams), {clearMessageBar: false});
            return response.data;
        },
        async hideTextForUser(body: { textId: number }) {
            const store = useStore();
            await store.fetchCustom((api) => api.users.postUsersMeTextsHidden({textId: body.textId}));
        },
        //TODO add hidden texts page with ability to unhide
        async unhideTextForUser(pathParams: { textId: number }) {
            const store = useStore();
            await store.fetchCustom((api) => api.users.deleteUsersMeTextsHiddenTextId(pathParams.textId));
        },
        async reportText(pathParams: { textId: number }, body: { reasonForReporting: string, reportText?: string, hideText?: boolean }) {
            const store = useStore();
            await store.fetchCustom((api) => api.texts.postTextsTextIdReports(pathParams.textId, {
                reasonForReporting: body.reasonForReporting,
                reportText: body.reportText,
                hideText: body.hideText
            }));
        }
    }
});
