import {defineStore} from "pinia";
import {useStore} from "@/stores/index";
import {encodeUrlQueryParams} from "../utils.js";

export const useCourseStore = defineStore("course", {
    actions: {
        async fetchCourses({languageCode, addedBy, sortBy, editableBy}) {
            const queryParams = {language: languageCode, addedBy, sortBy: sortBy ?? "best", editableBy};
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/courses/?${encodeUrlQueryParams(queryParams)}`,
                {},
                true);
        },
        async fetchLibraryCourses({languageCode, searchQuery, maxPerPage, page}) {
            const queryParams = {language: languageCode, pageSize: maxPerPage, page, search: searchQuery};
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/library/courses/?${encodeUrlQueryParams(queryParams)}`,
                {},
                true);
        },
        async createCourse({languageCode, title, description, image, isPublic}) {
            const store = useStore();
            const formData = new FormData();
            formData.append("image", image);
            formData.append("data", JSON.stringify({
                language: languageCode,
                title: title,
                description: description,
                isPublic: isPublic,
            }));
            const newCourse = await store.fetchCustom(
                `${store.apiUrl}/courses/`,
                {
                    method: "POST",
                    body: formData,
                    headers: {},
                },
                true);
            // await this.addCourseToLibrary({courseId: newCourse.id});
            return newCourse;
        },
        async addCourseToLibrary({courseId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/library/courses/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        courseId: courseId,
                    })
                },
                true);
        },
        async fetchCourse({courseId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/courses/${courseId}/`,
                {},
                true);
        },
        async updateCourse({id, title, description, isPublic, image, lessonIds}) {
            const store = useStore();
            const formData = new FormData();
            formData.append("image", image);
            formData.append("data", JSON.stringify({
                title: title,
                description: description,
                isPublic: isPublic,
                lessons: lessonIds,
            }));
            return await store.fetchCustom(
                `${store.apiUrl}/courses/${id}/`,
                {
                    method: "PUT",
                    body: formData,
                    headers: {}
                },
                true);
        },


    }
});