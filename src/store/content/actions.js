export default {
    async fetchAllLanguages(context) {
        const response = await fetch(`${context.getters.baseUrl}/languages`);
        if (response.ok)
            return await response.json();
        else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchAllLanguages:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },

    async fetchUserLanguages(context) {
        const response = await context.dispatch('fetchProtected', {url: `${context.getters.baseUrl}/users/me/languages`});
        if (response.ok) {
            return (await response.json());
        } else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchUserLanguages:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    },

    async fetchLesson(context, payload) {
        const lessonId = payload.lessonId;
        const languageCode = payload.languageCode;
        const response = await context.dispatch('fetchProtected', {
            url: `${context.getters.baseUrl}/users/me/lessons/${lessonId}?language=${languageCode}`
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