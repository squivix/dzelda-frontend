import {createRouter, createWebHistory} from "vue-router";

import HomePage from '@/views/HomePage.vue'
import UserLogin from '@/views/auth/UserLogin.vue'
import UserSignOut from '@/views/auth/UserSignOut.vue'
import UserSignUp from '@/views/auth/UserSignUp.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import CoursePage from '@/views/view/CoursePage.vue'
import LessonReaderPage from '@/views/reader/LessonReaderPage.vue'
import ExplorePage from '@/views/view/ExplorePage.vue'
import MyLibraryPage from '@/views/view/MyLibraryPage.vue'
import MyVocabPage from '@/views/view/MyVocabPage.vue'
import LessonAddEditPage from '@/views/change/LessonAddEditPage.vue'
import CourseAddPage from '@/views/change/CourseAddPage.vue'
import CourseEditPage from '@/views/change/CourseEditPage.vue'
import MyProfilePage from "@/views/user/MyProfilePage.vue";
import SettingsPage from "@/views/user/SettingsPage.vue";
import AccountTab from "@/components/page/settings/AccountTab.vue";
import LanguagesTab from "@/components/page/settings/LanguagesTab.vue";
import NotificationsTab from "@/components/page/settings/NotificationsTab.vue";
import NewLanguagePage from "@/views/user/NewLanguagePage.vue";
import {useAuthStore} from "@/stores/auth.js";
import {useLanguageStore} from "@/stores/language";

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
            name: "explore-lang",
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
            component: LessonReaderPage,
            name: 'lesson',
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/lessons/add',
            component: LessonAddEditPage,
            name: 'add-lesson',
            meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true}
        },
        {
            path: '/learn/:learningLanguage/lessons/add',
            component: LessonAddEditPage,
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/learn/:learningLanguage/lessons/:lessonId/edit',
            component: LessonAddEditPage,
            name: 'edit-lesson',
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/courses/add',
            component: CourseAddPage,
            name: "add-course",
            meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true}
        },
        {
            path: '/learn/:learningLanguage/courses/add',
            component: CourseAddPage,
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/learn/:learningLanguage/courses/:courseId',
            component: CoursePage,
            name: 'course',
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/learn/:learningLanguage/courses/:courseId/edit',
            component: CourseEditPage,
            name: "edit-course",
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/learn/new',
            component: NewLanguagePage,
            name: "new-language",
            meta: {requiresAuth: true, showFooter: false}
        },
        {
            path: '/profiles/me',
            component: MyProfilePage,
            name: "my-profile",
            meta: {requiresAuth: true, showFooter: true}
        }, {
            path: '/settings',
            component: SettingsPage,
            redirect: {name: "account-settings",},
            name: "settings",
            meta: {requiresAuth: true, showFooter: true},
            children: [
                {
                    path: '/settings/account',
                    name: "account-settings",
                    component: AccountTab,
                }, {
                    path: '/settings/languages',
                    name: "language-settings",
                    component: LanguagesTab,
                }, {
                    path: '/settings/notifications',
                    name: "notification-settings",
                    component: NotificationsTab,
                },
            ],
        },
    ],
    history: createWebHistory(),
});


router.beforeResolve(async (to, from) => {

    const authStore = useAuthStore();
    const languageStore = useLanguageStore();
    const isAuthenticated = authStore.isAuthenticated;
    //prevent visiting sites that require authentication while unauthenticated
    if (to.meta.requiresAuth && !isAuthenticated)
        return {name: 'login'}
    if (to.meta.requiresAuth && isAuthenticated && !authStore.token)
        authStore.token = localStorage.authToken;

    if ((to.name === "login" || to.name === "home") && isAuthenticated)
        return {name: 'explore'}
    if (isAuthenticated) {
        const defaultLanguage = await languageStore.getOrFetchDefaultUserLanguage();
        if (to.meta.redirToLanguageSpecific)
            return {path: `/learn/${defaultLanguage.code}${to.path}`};
    }

    if (to.params.learningLanguage && from.params.learningLanguage !== to.params.learningLanguage)
        await languageStore.updateLanguageLastOpened({languageCode: to.params.learningLanguage});

})


export default router;

