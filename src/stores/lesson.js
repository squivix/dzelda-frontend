import {defineStore} from "pinia";
import {useStore} from "@/stores/index";
import {encodeUrlQueryParams} from "@/utils.js";

export const useLessonStore = defineStore("lesson", {
    actions: {
        async fetchLessons({languageCode, sortBy, maxPerPage, page}) {
            const store = useStore();
            const queryParams = {language: languageCode, sortBy: sortBy ?? "best", maxPerPage, page};
            return await store.fetchCustom(
                `${store.apiUrl}/lessons/?${encodeUrlQueryParams(queryParams)}`,
                {},
                true);
        },
        async fetchLibraryLessons({languageCode, searchQuery, maxPerPage, page}) {
            const queryParams = {language: languageCode, pageSize: maxPerPage, page, search: searchQuery};
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/library/lessons/?${encodeUrlQueryParams(queryParams)}`,
                {},
                true);
        },
        async fetchCourseLessons({courseId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/courses/${courseId}/lessons/`,
                {},
                true);
        },
        async createLesson({title, text, courseId}) {
            const store = useStore();
            const newLesson = await store.fetchCustom(
                `${store.apiUrl}/lessons/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        title: title,
                        text: text,
                        course: courseId,
                    })
                },
                true);
            await this.addLessonToUser({lessonId: newLesson.id});
            return newLesson;
        },
        async addLessonToUser({lessonId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/library/lessons/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        lesson: lessonId
                    })
                },
                true);
        },
        async fetchLesson({lessonId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/lessons/${lessonId}/`,
                {},
                true);
        },
        async updateLesson({lessonId, courseId, title, text}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/library/lessons/${lessonId}/`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        course: courseId,
                        title: title,
                        text: text,
                    })
                },
                true,);
        },
    }
});