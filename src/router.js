import { createRouter, createWebHistory } from "vue-router";

import HomePage from './pages/HomePage.vue'
import UserLogin from './pages/auth/UserLogin.vue'
import UserSignOut from './pages/auth/UserSignOut.vue'
import UserSignUp from './pages/auth/UserSignUp.vue'
import ForgotPassword from './pages/auth/ForgotPassword.vue'
import LessonReader from './pages/LessonReader.vue'
import ExplorePage from './pages/ExplorePage.vue'
import MyLessonsPage from './pages/MyLessonsPage.vue'

import store from './store/index.js'

const router = createRouter({
    routes: [
        { path: '/', redirect: 'home', meta: { requiresAuth: false, showFooter: true } },
        { path: '/home', component: HomePage, name: 'home', meta: { requiresAuth: false, showFooter: true } },
        { path: '/login', component: UserLogin, name: 'login', meta: { requiresAuth: false, showFooter: true } },
        {
            path: '/sign-out', component: UserSignOut, name: 'sign-out', meta: { requiresAuth: true, showFooter: true }
        },
        { path: '/sign-up', component: UserSignUp, name: 'sign-up', meta: { requiresAuth: false, showFooter: true } },
        { path: '/forgot-password', component: ForgotPassword, name: 'forgot-password', meta: { requiresAuth: false, showFooter: true } },

        { path: '/explore', component: ExplorePage, name: "explore", meta: { requiresAuth: true, showFooter: false } },
        { path: '/learn/:learningLanguage/explore', component: ExplorePage, meta: { requiresAuth: true, showFooter: false } },
        { path: '/learn/:learningLanguage/my-lessons', component: MyLessonsPage, meta: { requiresAuth: true, showFooter: false } },
        { path: '/learn/:learningLanguage/lesson/:lessonId', component: LessonReader, name: 'lesson', meta: { requiresAuth: true, showFooter: false } },

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


export default router;

