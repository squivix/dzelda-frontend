import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {LanguageLevelSchema, LessonSchema} from "dzelda-common";
import {cleanUndefined} from "@/utils.js";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

export const useLessonStore = defineStore("lesson", {
    actions: {
        async fetchLessons(queryParams: {
            languageCode?: string,
            sortBy?: "title" | "createdDate" | "pastViewersCount",
            sortOrder?: "asc" | "desc",
            pageSize?: number,
            page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.lessons.getLessons(queryParams));
            return response.data;
        },
        async fetchLessonsInHistory(queryParams: {
            languageCode?: string,
            sortBy?: "title" | "createdDate" | "pastViewersCount",
            sortOrder?: "asc" | "desc",
            searchQuery?: string,
            pageSize?: number,
            page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersMeLessonsHistory(queryParams));
            return response.data;
        },
        async createLesson(body: {
            title: string,
            text: string,
            languageCode: string,
            courseId: number | null,
            isPublic: boolean,
            level: "beginner1" | "beginner2" | "intermediate1" | "intermediate2" | "advanced1" | "advanced2",
            image: string | undefined,
            audio: string | undefined
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            return await store.fetchCustom((api) => api.lessons.postLessons(cleanUndefined({
                title: body.title,
                text: body.text,
                languageCode: body.languageCode,
                level: body.level,
                isPublic: body.isPublic,
                courseId: body.courseId,
                image: body.image,
                audio: body.audio,
            })));
        },
        async updateLesson(pathParams: { lessonId: number }, body: {
            courseId: number | undefined | null,
            title: string,
            text: string,
            image: string | undefined,
            level: LanguageLevelSchema,
            isPublic: boolean,
            audio: string | undefined
        }) {
            const store = useStore();
            return await store.fetchCustom((api) => api.lessons.patchLessonsLessonId(pathParams.lessonId, cleanUndefined({
                courseId: body.courseId,
                title: body.title,
                text: body.text,
                image: body.image,
                audio: body.audio,
                level: body.level,
                isPublic: body.isPublic
            })));
        },
        async addLessonToUserHistory(body: { lessonId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeLessonsHistory({
                lessonId: body.lessonId
            }));
            if (response.status == 404)
                await this.router.push({name: "not-found"});
        },
        async fetchLesson(pathParams: { lessonId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.lessons.getLessonsLessonId(pathParams.lessonId));
            if (response.status == 404)
                await this.router.push({name: "not-found"});
            return response.data;
        },
        async fetchNextLesson(pathParams: { lessonId: number, courseId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.courses.getCoursesCourseIdLessonsLessonIdNext(pathParams.courseId, pathParams.lessonId));
            if (response.redirected) {
                response.data = await response.json();
                return response.data as LessonSchema;
            } else
                return null;
        }
    }
});
