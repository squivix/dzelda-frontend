import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {LessonSchema} from "dzelda-types";

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

            // handle your 4XX errors as you may
            //...
            return response.data;
        },
        async fetchLessonsInHistory(queryParams: {
            languageCode?: string, sortBy?: "title" | "createdDate" | "pastViewersCount", sortOrder?: "asc" | "desc", searchQuery?: string, pageSize?: number, page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersMeLessonsHistory(queryParams));

            // handle your 4XX errors as you may
            //...
            return response.data;
        },
        async createLesson(body: { title: string, text: string, courseId: number, image: File | null, audio: File | null }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.lessons.postLessons({
                data: {
                    title: body.title,
                    text: body.text,
                    courseId: body.courseId,
                },
                image: body.image,
                audio: body.audio,
            }));

            // handle your 4XX errors as you may
            //...
            return response.data;
        },
        async addLessonToUserHistory(body: { lessonId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeLessonsHistory({
                lessonId: body.lessonId
            }));

            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async fetchLesson(pathParams: { lessonId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.lessons.getLessonsLessonId(pathParams.lessonId));

            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async updateLesson(pathParams: { lessonId: number }, body: { courseId: number, title: string, text: string, image: File, audio: File }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.lessons.putLessonsLessonId(pathParams.lessonId, {
                data: {
                    courseId: body.courseId,
                    title: body.title,
                    text: body.text,
                },
                image: body.image,
                audio: body.audio,
            }));

            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async fetchNextLesson(pathParams: { lessonId: number, courseId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.courses.getCoursesCourseIdLessonsLessonIdNext(pathParams.courseId, pathParams.lessonId));

            // handle your 4XX errors as you may
            //...

            if (response.redirected) {
                response.data = await response.json()
                return response.data as LessonSchema;
            } else
                return null;
        }
    }
});
