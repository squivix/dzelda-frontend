import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";

export const useCourseStore = defineStore("course", {
    actions: {
        async fetchCourses(queryParams: {
            languageCode?: string,
            addedBy?: string,
            sortBy?: "title" | "createdDate" | "learnersCount",
            sortOrder?: "asc" | "desc"
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.courses.getCourses(queryParams))

            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async fetchLibraryCourses(queryParams: {
            languageCode?: string,
            searchQuery?: string,
            pageSize?: number,
            page?: number
        } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersUsernameCourses("me", queryParams))

            // handle your 4XX errors as you may
            //...
            return response.data;
        },
        async createCourse(body: {
            languageCode: string,
            title: string,
            description: string,
            image: File | null,
            isPublic: boolean
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.courses.postCourses({
                data: {
                    languageCode: body.languageCode,
                    title: body.title,
                    description: body.description,
                    isPublic: body.isPublic
                },
                image: body.image ?? ""
            }))
            // handle your 4XX errors as you may
            //...
            return response.data;
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
            image: File,
            lessonsOrder: number[]
        }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.courses.putCoursesCourseId(pathParams.courseId,
                {
                    data: {
                        title: body.title,
                        description: body.description,
                        isPublic: body.isPublic,
                        lessonsOrder: body.lessonsOrder,
                    },
                    image: body.image
                }));
            // handle your 4XX errors as you may
            //...
            return response.data;
        },
    }
});