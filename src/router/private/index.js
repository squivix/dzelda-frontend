import UserSignOut from "@/views/auth/UserSignOut.vue";
import ExplorePage from "@/views/ExplorePage.vue";
import MyLibraryPage from "@/views/MyLibraryPage.vue";
import MyVocabPage from "@/views/MyVocabPage.vue";
import {ArrayDatatype} from "@oarepo/vue-query-synchronizer";
import {SAVED_VOCAB_LEVELS} from "@/constants.js";
import LessonReaderPage from "@/views/LessonReaderPage.vue";
import LessonAddEditPage from "@/views/change/LessonAddEditPage.vue";
import CourseAddPage from "@/views/change/CourseAddPage.vue";
import CoursePage from "@/views/CoursePage.vue";
import CourseEditPage from "@/views/change/CourseEditPage.vue";
import NewLanguagePage from "@/views/user/NewLanguagePage.vue";
import MyProfilePage from "@/views/user/MyProfilePage.vue";
import SettingsPage from "@/views/user/SettingsPage.vue";
import AccountTab from "@/components/page/settings/AccountTab.vue";
import LanguagesTab from "@/components/page/settings/LanguagesTab.vue";
import NotificationsTab from "@/components/page/settings/NotificationsTab.vue";

export const privateRoutes = [
    {
        path: "/sign-out", component: UserSignOut, name: "sign-out", meta: {requiresAuth: true, showFooter: true}
    },
    {
        path: "/explore",
        component: ExplorePage,
        name: "explore",
        meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true}
    },
    {
        path: "/learn/:learningLanguage/explore",
        name: "explore-lang",
        component: ExplorePage,
        meta: {
            requiresAuth: true, showFooter: false,
            query: {
                page: "int:1",
                maxPerPage: "int:25",
                searchQuery: "string:",
            }
        }
    },
    {
        path: "/my-library",
        component: MyLibraryPage,
        name: "my-library",
        meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true}
    },
    {
        path: "/learn/:learningLanguage/my-library",
        component: MyLibraryPage,
        name: "language-my-library",
        meta: {
            requiresAuth: true,
            showFooter: false,
            query: {
                page: "int:1",
                maxPerPage: "int:10",
                searchQuery: "string:",
            }
        }
    },
    {
        path: "/my-vocab",
        component: MyVocabPage,
        name: "my-vocab",
        meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true,}
    },
    {
        path: "/learn/:learningLanguage/my-vocab",
        component: MyVocabPage,
        name: "language-my-vocab",
        meta: {
            requiresAuth: true,
            showFooter: false,
            query: {
                page: "int:1",
                maxPerPage: "int:25",
                searchQuery: "string:",
                level: {
                    datatype: ArrayDatatype,
                    defaultValue: Object.values(SAVED_VOCAB_LEVELS),
                },
            }
        }
    },
    {
        path: "/learn/:learningLanguage/lessons/:lessonId",
        component: LessonReaderPage,
        name: "lesson",
        meta: {requiresAuth: true, showFooter: false}
    },
    {
        path: "/lessons/add",
        component: LessonAddEditPage,
        name: "add-lesson",
        meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true}
    },
    {
        path: "/learn/:learningLanguage/lessons/add",
        component: LessonAddEditPage,
        meta: {requiresAuth: true, showFooter: false}
    },
    {
        path: "/learn/:learningLanguage/lessons/:lessonId/edit",
        component: LessonAddEditPage,
        name: "edit-lesson",
        meta: {requiresAuth: true, showFooter: false}
    },
    {
        path: "/courses/add",
        component: CourseAddPage,
        name: "add-course",
        meta: {requiresAuth: true, showFooter: false, redirToLanguageSpecific: true}
    },
    {
        path: "/learn/:learningLanguage/courses/add",
        component: CourseAddPage,
        meta: {requiresAuth: true, showFooter: false}
    },
    {
        path: "/learn/:learningLanguage/courses/:courseId",
        component: CoursePage,
        name: "course",
        meta: {requiresAuth: true, showFooter: false}
    },
    {
        path: "/learn/:learningLanguage/courses/:courseId/edit",
        component: CourseEditPage,
        name: "edit-course",
        meta: {requiresAuth: true, showFooter: false}
    },
    {
        path: "/learn/new",
        component: NewLanguagePage,
        name: "new-language",
        meta: {requiresAuth: true, showFooter: false}
    },
    {
        path: "/profiles/me",
        component: MyProfilePage,
        name: "my-profile",
        meta: {requiresAuth: true, showFooter: true}
    }, {
        path: "/settings",
        component: SettingsPage,
        redirect: {name: "account-settings",},
        name: "settings",
        meta: {requiresAuth: true, showFooter: true},
        children: [
            {
                path: "/settings/account",
                name: "account-settings",
                component: AccountTab,
            }, {
                path: "/settings/languages",
                name: "language-settings",
                component: LanguagesTab,
            }, {
                path: "/settings/notifications",
                name: "notification-settings",
                component: NotificationsTab,
            },
        ],
    },
]