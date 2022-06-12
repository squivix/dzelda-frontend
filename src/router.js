import {createRouter, createWebHistory} from "vue-router";

import HomePage from './pages/HomePage.vue'
import UserLogin from './pages/auth/UserLogin.vue'
import UserSignOut from './pages/auth/UserSignOut.vue'
import UserSignUp from './pages/auth/UserSignUp.vue'
import ForgotPassword from './pages/auth/ForgotPassword.vue'
import CourseViewer from './pages/CourseViewer.vue'
import LessonReader from './pages/LessonReader.vue'
import ExplorePage from './pages/ExplorePage.vue'
import MyLibraryPage from './pages/MyLibraryPage.vue'
import MyVocabPage from './pages/MyVocabPage.vue'
import LessonAddPage from './pages/LessonAddPage.vue'

import store from './store/index.js'

const router = createRouter({
    routes: [
        {path: '/', redirect: {name: 'home'}, name: 'root', meta: {requiresAuth: false, showFooter: true}},
        {path: '/home', component: HomePage, name: 'home', meta: {requiresAuth: false, showFooter: true}},
        {path: '/login', component: UserLogin, name: 'login', meta: {requiresAuth: false, showFooter: true}},
        {
            path: '/sign-out', component: UserSignOut, name: 'sign-out', meta: {requiresAuth: true, showFooter: true}
        },
        {path: '/sign-up', component: UserSignUp, name: 'sign-up', meta: {requiresAuth: false, showFooter: true}},
        {
            path: '/forgot-password',
            component: ForgotPassword,
            name: 'forgot-password',
            meta: {requiresAuth: false, showFooter: true}
        },
        {
            path: '/explore',
            component: ExplorePage,
            name: "explore",
            meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true}
        },
        {
            path: '/learn/:learningLanguage/explore',
            component: ExplorePage,
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/my-library',
            component: MyLibraryPage,
            name: "my-library",
            meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true}
        },
        {
            path: '/learn/:learningLanguage/my-library',
            component: MyLibraryPage,
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/my-vocab',
            component: MyVocabPage,
            name: "my-vocab",
            meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true}
        },
        {
            path: '/learn/:learningLanguage/my-vocab',
            component: MyVocabPage,
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/learn/:learningLanguage/lessons/:lessonId',
            component: LessonReader,
            name: 'lesson',
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/lessons/add',
            component: LessonAddPage,
            name: 'add-lesson',
            meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true}
        },
        {
            path: '/learn/:learningLanguage/lessons/add',
            component: LessonAddPage,
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/learn/:learningLanguage/courses/:courseId',
            component: CourseViewer,
            name: 'course',
            meta: {requiresAuth: true, showFooter: false}
        },

    ],
    history: createWebHistory(),
});


router.beforeResolve(async to => {
    const isAuthenticated = store.getters.isAuthenticated;
    //prevent visiting sites that require authentication while unauthenticated
    if (to.meta.requiresAuth && !isAuthenticated)
        return {name: 'login'}

    if (to.meta.requiresAuth && isAuthenticated && store.state.token === undefined)
        store.commit("setToken", {token: localStorage.auth_token})

    if ((to.name === "login" || to.name === "home") && isAuthenticated)
        return {name: 'explore'}

    if (to.meta.redirToLanguageSpecific) {
        const defaultLanguage = await store.dispatch("getOrFetchDefaultLanguage");
        return {path: `/learn/${defaultLanguage.code}${to.path}`};
    }
})


export default router;

