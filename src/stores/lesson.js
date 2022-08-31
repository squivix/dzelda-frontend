import {defineStore} from "pinia";
import {useStore} from "@/stores/index";

export const useLessonStore = defineStore("lesson", {
    actions: {
        async fetchUserLessonsPage({languageCode, maxPerPage, page}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/library/lessons/?language=${languageCode}&pageSize=${maxPerPage}&page=${page}`,
                {},
                true);
        },
        async fetchLesson({lessonId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/lessons/${lessonId}/`,
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
        async postLesson({title, text, courseId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/lessons/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        title: title,
                        text: text,
                        courseId: courseId,
                    })
                },
                true);
        },
        async postUserLesson({lessonId}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/users/me/library/lessons/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        lessonId: lessonId
                    })
                },
                true);
        },
        async editLesson({lessonId, courseId, title, text}) {
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

        async fetchRecommendedLessons({languageCode}) {
            const store = useStore();
            return await store.fetchCustom(
                `${store.apiUrl}/lessons/?language=${languageCode}&sortBy=best`,
                {},
                true);
        },
    }
})