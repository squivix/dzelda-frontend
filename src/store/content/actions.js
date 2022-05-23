export default {
    async fetchUserLanguages(context) {
        const response = await context.dispatch('fetchProtected', {url: `${context.getters.baseUrl}/users/me/languages`});
        if (response.ok) {
            return (await response.json());
        } else {
            const responseData = await response.text();
            console.log(`vuexstore:content/fetchUserLanguages:Response code ${response.status}: ${responseData}`)
            throw new Error(responseData);
        }
    }
}