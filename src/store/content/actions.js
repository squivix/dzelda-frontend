import {GUIDED_USERNAME} from "@/constants";

export default {
    async fetchUserProfile(context) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/profile/`,
            protected: true,
            caller: "fetchUserProfile",
            module: "content",
        }, {root: true});
    },
    async getOrFetchUserProfile(context) {
        return context.getters.userProfile ?? await context.dispatch("fetchUserProfile");
    },
    async fetchAllLanguages(context) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/languages/`,
            protected: false,
            caller: "fetchAllLanguages",
            module: "content",
        }, {root: true});
    },
    async getOrFetchDefaultUserLanguage(context) {
        return (await context.dispatch("getOrFetchUserLanguages"))[0];
    },
    async getOrFetchUserLanguages(context) {
        return context.getters.userLanguages ?? await context.dispatch("fetchUserLanguages");
    },
    async fetchUserLanguages(context) {
        const languages = await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/languages/`,
            protected: true,
            caller: "fetchUserLanguages",
            module: "content",
        }, {root: true});
        context.commit("setUserLanguages", {languages});
        return languages;
    },
    async fetchSavedCourses(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/library/courses/?language=${payload.language}&pageSize=${payload.maxPerPage}&page=${payload.page}`,
            protected: true,
            caller: "fetchSavedCourses",
            module: "content",
        }, {root: true});
    },
    async fetchUserLessonsPage(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/library/lessons/?language=${payload.language}&pageSize=${payload.maxPerPage}&page=${payload.page}`,
            protected: true,
            caller: "fetchUserLessons",
            module: "content",
        }, {root: true});
    },
    async fetchLesson(context, payload) {
        const lessonId = payload.lessonId;
        const languageCode = payload.languageCode;
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/lessons/${lessonId}/`,
            protected: true,
            caller: "fetchLesson",
            module: "content",
        }, {root: true});
    },
    async fetchCourse(context, payload) {
        const courseId = payload.courseId;
        const languageCode = payload.languageCode;
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/courses/${courseId}/`,
            protected: true,
            caller: "fetchCourse",
            module: "content",
        }, {root: true});
    },
    async fetchCourseLessons(context, payload) {
        const courseId = payload.courseId;
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/courses/${courseId}/lessons/`,
            protected: true,
            caller: "fetchCourseLessons",
            module: "content",
        }, {root: true});
    },
    async fetchEditableCourses(context) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/courses/?canEdit=true`,
            protected: true,
            caller: "fetchEditableCourses",
            module: "content",
        }, {root: true});
    },


    async postUserLesson(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/library/lessons/`,
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
        }, {root: true});
    },
    async editLesson(context, payload) {
        const lessonId = payload.lessonId;
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/library/lessons/${lessonId}/`,
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
        }, {root: true});
    },

    async postCourse(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/courses/`,
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
        }, {root: true});
    },

    async updateCourse(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/courses/${payload.id}/`,
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
        }, {root: true});
    },

    async updateLanguageLastOpened(context, payload) {
        context.commit("setLastOpenedLanguage", {language: payload.language});

        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/languages/${payload.language}/`,
            options: {
                method: "PATCH",
                body: JSON.stringify({lastOpened: "now"})
            },
            protected: true,
            caller: "postCourse",
            module: "content",
        }, {root: true});
    },
    async addLanguage(context, payload) {
        const language = await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/languages/`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    language: payload.language
                })
            },
            protected: true,
            caller: "addLanguage",
            module: "content",
        }, {root: true});
        await context.commit("addUserLanguage", {language});
    },
    async deleteLanguage(context, payload) {
        await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/users/me/languages/${payload.language}/`,
            options: {
                method: "DELETE",
            },
            protected: true,
            caller: "deleteLanguage",
            module: "content",
        }, {root: true});
        await context.commit("removeUserLanguage", {languageCode: payload.language});
    },
    async fetchRecommendedLessons(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/lessons/?language=${payload.language}&sortBy=best`,
            protected: true,
            caller: "fetchRecommendedLessons",
            module: "content",
        }, {root: true});
    },
    async fetchGuidedCourses(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.rootGetters.apiUrl}/courses/?language=${payload.language}&&addedBy=${GUIDED_USERNAME}&sortBy=best`,
            protected: true,
            caller: "fetchGuidedCourses",
            module: "content",
        }, {root: true});
    }
}