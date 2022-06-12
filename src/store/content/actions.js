export default {
    async fetchAllLanguages(context) {
        const response = await fetch(`${context.getters.apiUrl}/languages`);
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchAllLanguages:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },
    async getOrFetchDefaultLanguage(context) {
        return (await context.dispatch("getOrFetchUserLanguages"))[0];
    },
    async getOrFetchUserLanguages(context) {
        return context.getters.getUserLanguages ?? await context.dispatch("fetchUserLanguages");
    },
    async fetchUserLanguages(context) {
        const response = await context.dispatch('fetchProtected', {url: `${context.getters.apiUrl}/users/me/languages`});
        if (response.ok) {
            const languages = await response.json();
            context.commit("setUserLanguages", {languages});
            return languages;
        } else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchUserLanguages:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },
    async fetchSavedCourses(context, payload) {
        const response = await context.dispatch('fetchProtected', {url: `${context.getters.apiUrl}/users/me/saved-courses`});
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchSavedCourses:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },
    async fetchUserLessons(context, payload) {
        const response = await context.dispatch('fetchProtected', {url: `${context.getters.apiUrl}/users/me/lessons`});
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchUserLessons:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },
    async fetchLesson(context, payload) {
        const lessonId = payload.lessonId;
        const languageCode = payload.languageCode;
        const response = await context.dispatch('fetchProtected', {
            url: `${context.getters.apiUrl}/users/me/lessons/${lessonId}?language=${languageCode}`
        });
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchLesson:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },
    async fetchCourse(context, payload) {
        const courseId = payload.courseId;
        const languageCode = payload.languageCode;
        const response = await context.dispatch('fetchProtected', {
            url: `${context.getters.apiUrl}/users/me/courses/${courseId}?language=${languageCode}`
        });
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchCourse:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },
    async fetchCourseLessons(context, payload) {
        const courseId = payload.courseId;
        // const languageCode = payload.languageCode;
        const response = await context.dispatch('fetchProtected', {
            url: `${context.getters.apiUrl}/courses/${courseId}/lessons`
        });
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchCourseLessons:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },
    async fetchEditableCourses(context) {
        const response = await context.dispatch('fetchProtected', {
            url: `${context.getters.apiUrl}/users/me/editable-courses`
        });
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchEditableCourses:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },

    async postLesson(context, payload) {
        const response = await context.dispatch('fetchProtected', {
            url: `${context.getters.apiUrl}/courses/${payload.course}/lessons`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    title: payload.title,
                    text: payload.text,
                })
            }
        });
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/postLesson:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },
    async postUserLesson(context, payload) {
        const response = await context.dispatch('fetchProtected', {
            url: `${context.getters.apiUrl}/users/me/lessons`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    lessonId: payload.lessonId
                })
            }
        });
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/postUserLesson:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },
}