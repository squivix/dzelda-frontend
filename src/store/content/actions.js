export default {
    async fetchAllLanguages(context) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/languages`,
            protected: false,
            caller: "fetchAllLanguages",
            module: "content",
        });
    },
    async getOrFetchDefaultLanguage(context) {
        return (await context.dispatch("getOrFetchUserLanguages"))[0];
    },
    async getOrFetchUserLanguages(context) {
        return context.getters.getUserLanguages ?? await context.dispatch("fetchUserLanguages");
    },
    async fetchUserLanguages(context) {
        const languages = await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/languages`,
            protected: true,
            caller: "fetchUserLanguages",
            module: "content",
        });
        context.commit("setUserLanguages", {languages});
        return languages;
    },
    async fetchSavedCourses(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/saved-courses`,
            protected: true,
            caller: "fetchSavedCourses",
            module: "content",
        });
    },
    async fetchUserLessons(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/lessons`,
            protected: true,
            caller: "fetchUserLessons",
            module: "content",
        });
    },
    async fetchLesson(context, payload) {
        const lessonId = payload.lessonId;
        const languageCode = payload.languageCode;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/lessons/${lessonId}?language=${languageCode}`,
            protected: true,
            caller: "fetchLesson",
            module: "content",
        });
    },
    async fetchCourse(context, payload) {
        const courseId = payload.courseId;
        const languageCode = payload.languageCode;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/courses/${courseId}?language=${languageCode}`,
            protected: true,
            caller: "fetchCourse",
            module: "content",
        });
    },
    async fetchCourseLessons(context, payload) {
        const courseId = payload.courseId;
        // const languageCode = payload.languageCode;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/courses/${courseId}/lessons`,
            protected: true,
            caller: "fetchCourseLessons",
            module: "content",
        });
    },
    async fetchEditableCourses(context) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/editable-courses`,
            protected: true,
            caller: "fetchEditableCourses",
            module: "content",
        });
    },

    async postLesson(context, payload) {
        const courseId = payload.courseId;
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/courses/${courseId}/lessons`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    title: payload.title,
                    text: payload.text,
                })
            },
            protected: true,
            caller: "postLesson",
            module: "content",
        });
    },
    async postUserLesson(context, payload) {
        return await context.dispatch('fetchCustom', {
            url: `${context.getters.apiUrl}/users/me/lessons`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    lessonId: payload.lessonId
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
            url: `${context.getters.apiUrl}/lessons/${lessonId}`,
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
}