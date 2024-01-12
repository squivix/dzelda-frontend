import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {cleanUndefined} from "@/utils.js";
import {LanguageLevelSchema} from "dzelda-common";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

export const useCourseStore = defineStore("course", {
    actions: {
        async fetchCourses(queryParams: {
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
            const response = await store.fetchCustom((api) => api.courses.getCourses(queryParams, {secure: secure}));

            return response.data;
        },
        async fetchUserBookmarkedCourses(queryParams: {
            languageCode?: string,
            searchQuery?: string,
            addedBy?: string,
            level?: string[],
            pageSize?: number,
            page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersMeCoursesBookmarked(queryParams));

            return response.data;
        },
        async createCourse(body: {
            languageCode: string,
            title: string,
            description: string,
            image: string | undefined,
            isPublic: boolean,
            level: LanguageLevelSchema | undefined
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            return await store.fetchCustom((api) => api.courses.postCourses(cleanUndefined({
                languageCode: body.languageCode,
                title: body.title,
                description: body.description,
                isPublic: body.isPublic,
                level: body.level,
                image: body.image as string | undefined,
            }))) as Awaited<ReturnType<typeof store.apiClient.courses.postCourses>>;
        },
        async fetchCourse(pathParams: {
            courseId: number
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.courses.getCoursesCourseId(pathParams.courseId)) as Awaited<ReturnType<typeof store.apiClient.courses.getCoursesCourseId>>;

            if (response.status == 404)
                await this.router.push({name: "not-found"});
            return response.data;
        },
        async updateCourse(pathParams: {
            courseId: number
        }, body: {
            title: string,
            description: string,
            isPublic: boolean,
            level: "beginner1" | "beginner2" | "intermediate1" | "intermediate2" | "advanced1" | "advanced2"
            image: string | undefined,
            lessonsOrder: number[]
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            return await store.fetchCustom((api) => api.courses.putCoursesCourseId(pathParams.courseId,
                cleanUndefined({
                    title: body.title,
                    description: body.description,
                    level: body.level,
                    isPublic: body.isPublic,
                    lessonsOrder: body.lessonsOrder,
                    image: body.image
                })));
        },
        async addCourseToUserBookmarks(body: {
            courseId: number
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeCoursesBookmarked({courseId: body.courseId}));
            return response.data;
        },
        async removeCourseFromUserBookmarks(pathParams: {
            courseId: number
        }) {
            useMessageBarStore().clearMessages();
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.deleteUsersMeCoursesBookmarkedCourseId(pathParams.courseId));
            return response.data;
        }
    }
});
