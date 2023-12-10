import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";
import {cleanUndefined} from "@/utils.js";
import {LanguageLevelSchema} from "dzelda-types";
import {dataUriToBuffer} from "data-uri-to-buffer";

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
            image: File | Blob | undefined,
            isPublic: boolean,
            level: LanguageLevelSchema | undefined
        }) {
            const store = useStore();
            if (body.image instanceof Blob)
                body.image = new File([body.image], "image");
            return await store.fetchCustom((api) => api.courses.postCourses(cleanUndefined({
                data: {
                    languageCode: body.languageCode,
                    title: body.title,
                    description: body.description,
                    isPublic: body.isPublic,
                    level: body.level,
                },
                image: body.image
            })));
        },
        async fetchCourse(pathParams: {
            courseId: number
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.courses.getCoursesCourseId(pathParams.courseId));
            // handle your 4XX errors as you may
            //...
            return response.data;
        },
        async updateCourse(pathParams: {
            courseId: number
        }, body: {
            title: string,
            description: string,
            isPublic: boolean,
            level: "beginner1" | "beginner2" | "intermediate1" | "intermediate2" | "advanced1" | "advanced2"
            image: File | Blob | undefined | "",
            lessonsOrder: number[]
        }) {
            const store = useStore();
            if (body.image instanceof Blob)
                body.image = new File([body.image], "image");
            const response = await store.fetchCustom((api) => api.courses.putCoursesCourseId(pathParams.courseId,
                cleanUndefined({
                    data: {
                        title: body.title,
                        description: body.description,
                        level: body.level,
                        isPublic: body.isPublic,
                        lessonsOrder: body.lessonsOrder,
                    },
                    image: body.image
                })));
            // handle your 4XX errors as you may
            //...
            return response.data;
        },
        async addCourseToUserBookmarks(body: {
            courseId: number
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersMeCoursesBookmarked({courseId: body.courseId}));
            // handle your 4XX errors as you may
            //...
            return response.data;
        },
        async removeCourseFromUserBookmarks(pathParams: {
            courseId: number
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.deleteUsersMeCoursesBookmarkedCourseId(pathParams.courseId));
            // handle your 4XX errors as you may
            //...
            return response.data;
        }
    }
});
