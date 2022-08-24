import {GUIDED_USERNAME} from "@/constants";

export default {
    async fetchUserProfile(context) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/profile/`,
            protected: true,
            caller: "fetchUserProfile",
            module: "content",
        });
    },
    async getOrFetchUserProfile(context) {
        return context.getters.userProfile ?? await context.dispatch("fetchUserProfile");
    },
    async fetchAllLanguages(context) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/languages/`,
            protected: false,
            caller: "fetchAllLanguages",
            module: "content",
        });
    },
    async getOrFetchDefaultUserLanguage(context) {
        return (await context.dispatch("getOrFetchUserLanguages"))[0];
    },
    async getOrFetchUserLanguages(context) {
        return context.getters.userLanguages ?? await context.dispatch("fetchUserLanguages");
    },
    async fetchUserLanguages(context) {
        const languages = await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/languages/`,
            protected: true,
            caller: "fetchUserLanguages",
            module: "content",
        });
        context.commit("setUserLanguages", {languages});
        return languages;
    },
    async fetchSavedCourses(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/library/courses/?language=${payload.language}&pageSize=${payload.maxPerPage}&page=${payload.page}`,
            protected: true,
            caller: "fetchSavedCourses",
            module: "content",
        });
    },
    async fetchUserLessonsPage(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/library/lessons/?language=${payload.language}&pageSize=${payload.maxPerPage}&page=${payload.page}`,
            protected: true,
            caller: "fetchUserLessons",
            module: "content",
        });
    },
    async fetchLesson(context, payload) {
        const lessonId = payload.lessonId;
        const languageCode = payload.languageCode;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/lessons/${lessonId}/`,
            protected: true,
            caller: "fetchLesson",
            module: "content",
        });
    },
    async fetchCourse(context, payload) {
        const courseId = payload.courseId;
        const languageCode = payload.languageCode;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/courses/${courseId}/`,
            protected: true,
            caller: "fetchCourse",
            module: "content",
        });
    },
    async fetchCourseLessons(context, payload) {
        const courseId = payload.courseId;
        // const languageCode = payload.languageCode;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/courses/${courseId}/lessons/`,
            protected: true,
            caller: "fetchCourseLessons",
            module: "content",
        });
    },
    async fetchEditableCourses(context) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/courses/?canEdit=true`,
            protected: true,
            caller: "fetchEditableCourses",
            module: "content",
        });
    },

    // async postLesson(context, payload) {
    //     return await context.dispatch('fetchCustom', {
    //         url: `${context.getters.apiUrl}/lessons`,
    //         options: {
    //             method: "POST",
    //             body: JSON.stringify({
    //                 title: payload.title,
    //                 text: payload.text,
    //                 courseId: payload.courseId
    //             })
    //         },
    //         protected: true,
    //         caller: "postLesson",
    //         module: "content",
    //     });
    // },
    async postUserLesson(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/library/lessons/`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    title: payload.title,
                    text: payload.text,
                    courseId: payload.courseId
                })
            },
            protected: true,
            caller: "postUserLesson",
            module: "content",
        });
    },
    async editLesson(context, payload) {
        const lessonId = payload.lessonId;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/library/lessons/${lessonId}/`,
            options: {
                method: "PUT",
                body: JSON.stringify({
                    course: payload.courseId,
                    title: payload.title,
                    text: payload.text,
                })
            },
            protected: true,
            caller: "editLesson",
            module: "content",
        });
    },

    async postCourse(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/courses/`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    language: payload.languageCode,
                    title: payload.title,
                    description: payload.description,
                    isPublic: payload.isPublic,
                })
            },
            protected: true,
            caller: "postCourse",
            module: "content",
        });
    },

    async updateCourse(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/courses/${payload.id}/`,
            options: {
                method: "PUT",
                body: JSON.stringify({
                    ...payload,
                    id: undefined
                })
            },
            protected: true,
            caller: "postCourse",
            module: "content",
        });
    },

    async updateLanguageLastOpened(context, payload) {
        context.commit("setLastOpenedLanguage", {language: payload.language});

        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/languages/${payload.language}/`,
            options: {
                method: "PATCH",
                body: JSON.stringify({lastOpened: "now"})
            },
            protected: true,
            caller: "postCourse",
            module: "content",
        });
    },
    async addLanguage(context, payload) {
        const language = await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/languages/`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    language: payload.language
                })
            },
            protected: true,
            caller: "addLanguage",
            module: "content",
        });
        await context.commit("addUserLanguage", {language});
    },
    async deleteLanguage(context, payload) {
        await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/languages/${payload.language}/`,
            options: {
                method: "DELETE",
            },
            protected: true,
            caller: "deleteLanguage",
            module: "content",
        });
        await context.commit("removeUserLanguage", {languageCode: payload.language});
    },
    async fetchRecommendedLessons(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/lessons/?language=${payload.language}&sortBy=best`,
            protected: true,
            caller: "fetchRecommendedLessons",
            module: "content",
        });
    },
    async fetchGuidedCourses(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/courses/?language=${payload.language}&&addedBy=${GUIDED_USERNAME}&sortBy=best`,
            protected: true,
            caller: "fetchGuidedCourses",
            module: "content",
        });
    }
}