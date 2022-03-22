import { createRouter, createWebHistory } from "vue-router";

import HomePage from './pages/HomePage.vue'
import UserLogin from './pages/auth/UserLogin.vue'
import UserSignUp from './pages/auth/UserSignUp.vue'
import ForgotPassword from './pages/auth/ForgotPassword.vue'
import LessonReader from './pages/LessonReader.vue'
import ExplorePage from './pages/ExplorePage.vue'

import store from './store/index.js'

const router = createRouter({
    routes: [
        { path: '/home', component: HomePage, name: 'home', meta: { requiresAuth: false } },
        { path: '/login', component: UserLogin, name: 'login', meta: { requiresAuth: false } },
        { path: '/sign-up', component: UserSignUp, name: 'sign-up', meta: { requiresAuth: false } },
        { path: '/forgot-password', component: ForgotPassword, name: 'forgot-password', meta: { requiresAuth: false } },

        {
            path: '/explore', meta: { requiresAuth: true }, beforeEnter: async to => {
                const response = await fetch(`${store.getters.baseUrl}/users/me/languages`, {
                    method: "GET",
                    headers: {
                        "Authorization": "Token 9d4e54cd239c4ae149f140983ef54b1c06e5e0b5"
                    }
                });
                const languages = (await response.json()).languages;
                console.log({ path: `/learn/${languages[0].code}/explore` })
                return { path: `/learn/${languages[0].code}/explore` }
            }
        },
        { path: '/learn/:learningLanguage/explore', component: ExplorePage, meta: { requiresAuth: true } },
        { path: '/learn/:learningLanguage/lesson/:lessonId', component: LessonReader, name: 'lesson', meta: { requiresAuth: true } },

    ],
    history: createWebHistory(),
});


router.beforeResolve(to => {
    const isAuthenticated = store.getters.isAuthenticated;
    //prevent visiting sites that require authentication while unauthenticated
    if (to.meta.requiresAuth && !isAuthenticated)
        return { name: 'login' }
    if ((to.name === "login" || to.name === "home") && isAuthenticated)
        return { name: 'explore' }
})


router.beforeEnter()

export default router;

