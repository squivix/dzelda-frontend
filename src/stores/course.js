import {defineStore} from "pinia";
import {GUIDED_USERNAME} from "@/constants";
import {useStore} from "@/stores/index";

export const useCourseStore = defineStore("course", {
    actions: {
        async fetchUserCourses({languageCode, maxPerPage, page}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/library/courses/?language=${languageCode}&pageSize=${maxPerPage}&page=${page}`,
                {},
                true);
        },

        async fetchCourse({courseId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/courses/${courseId}/`,
                {},
                true);
        },
        async fetchEditableCourses() {
            const store = useStore();
            return await store.fetchCustom(
                //TODO replace me with username
                `${store.apiUrl}/courses/?editableBy=me`,
                {},
                true);
        },
        async postCourse({languageCode, title, description, isPublic}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/courses/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        language: languageCode,
                        title: title,
                        description: description,
                        isPublic: isPublic,
                    })
                },
                true);
        },

        async updateCourse({id, title, description, isPublic, lessonIds}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/courses/${id}/`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        title: title,
                        description: description,
                        isPublic: isPublic,
                        lessons: lessonIds,
                    })
                },
                true);
        },

        async fetchGuidedCourses({languageCode}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/courses/?language=${languageCode}&&addedBy=${GUIDED_USERNAME}&sortBy=best`,
                {},
                true);
        }
    }
})