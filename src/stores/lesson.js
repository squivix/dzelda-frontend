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
        async createLesson({title, text, courseId, image, audio}) {
            const store = useStore();
            const formData = new FormData();
            formData.append("image", image);
            formData.append("audio", audio);
            formData.append("data", JSON.stringify({
                title: title,
                text: text,
                course: courseId,
            }));

            const newLesson = await store.fetchCustom(
                `${store.apiUrl}/lessons/`,
                {
                    method: "POST",
                    body: formData,
                    headers: {}
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
        async updateLesson({lessonId, courseId, title, text, image, audio}) {
            const store = useStore();
            const formData = new FormData();
            formData.append("image", image);
            formData.append("audio", audio);
            formData.append("data", JSON.stringify({
                course: courseId,
                title: title,
                text: text,
            }));

            return await store.fetchCustom(
                `${store.apiUrl}/lessons/${lessonId}/`,
                {
                    method: "PATCH",
                    body: formData,
                    headers: {}
                },
                true,);
        },
    }
});