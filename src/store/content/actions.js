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
    async fetchUserCourses(context, payload) {
        const response = await context.dispatch('fetchProtected', {url: `${context.getters.apiUrl}/users/me/courses`});
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchUserCourses:Response code ${response.status}: ${responseData}`)
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
    }
}