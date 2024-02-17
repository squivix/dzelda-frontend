import {defineStore} from "pinia";
import {useLocalPreviewStore} from "@/stores/backend/local-preview/localPreviewStore.js";

export const useTextStoreMock = defineStore("textStoreMock", {
    actions: {
        async addTextToUserHistory(body: { textId: number }) {
            return;
        },
        async fetchText(pathParams: { textId: number }) {
            const localPreviewStore = useLocalPreviewStore();
            const previewDb = await localPreviewStore.getPreviewDb();
            return previewDb.get("texts", pathParams.textId);
        },
    }
});
