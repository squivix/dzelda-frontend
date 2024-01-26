import {defineStore} from "pinia";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {useLocalPreviewStore} from "@/stores/backend/local-preview/localPreviewStore.js";
import {LessonSchema} from "dzelda-common";

export const useLessonStoreMock = defineStore("lessonStoreMock", {
    actions: {
        async addLessonToUserHistory(body: { lessonId: number }) {
            return;
        },
        async fetchLesson(pathParams: { lessonId: number }) {
            const localPreviewStore = useLocalPreviewStore();
            const previewDb = await localPreviewStore.getPreviewDb();
            return previewDb.get("lessons", pathParams.lessonId);
        },
    }
});
