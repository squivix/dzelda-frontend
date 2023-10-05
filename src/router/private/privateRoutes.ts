import ExplorePage from "@/pages/ExplorePage.vue";
import MyLibraryPage from "@/pages/MyLibraryPage.vue";
import MyVocabPage from "@/pages/MyVocabPage.vue";
import constants, {ALL_VOCAB_LEVELS} from "@/constants.js";
import LessonReaderPage from "@/pages/LessonReaderPage.vue";
import LessonAddEditPage from "@/pages/LessonAddEditPage.vue";
import CourseAddPage from "@/pages/CourseAddPage.vue";
import CoursePage from "@/pages/CoursePage.vue";
import CourseEditPage from "@/pages/CourseEditPage.vue";
import NewLanguagePage from "@/pages/user/NewLanguagePage.vue";
import MyProfilePage from "@/pages/user/MyProfilePage.vue";
import SettingsPage from "@/pages/user/SettingsPage.vue";
import AccountTab from "@/components/page/settings/account/AccountTab.vue";
import LanguagesTab from "@/components/page/settings/languages/LanguagesTab.vue";
import NotificationsTab from "@/components/page/settings/NotificationsTab.vue";
import SignOutPage from "@/pages/auth/SignOutPage.vue";
import {RouteRecordRaw} from "vue-router";
import ConfirmEmailPage from "@/pages/auth/ConfirmEmailPage.vue";
import {setDefaultRouteMeta} from "@/router/routerUtils.js";
import ConfirmEmailSentPage from "@/pages/auth/ConfirmEmailSentPage.vue";
import ResendConfirmEmailPage from "@/pages/auth/ResendConfirmEmailPage.vue";
import RecentLessonsTab from "@/components/page/explore/RecentLessonsTab.vue";
import PopularLessonsTab from "@/components/page/explore/PopularLessonsTab.vue";
import {EnumLike, z} from "zod";
import {VocabLevelSchema} from "dzelda-types";

export const privateRoutes: RouteRecordRaw[] = [
    {
        path: "/sign-out", component: SignOutPage, name: "sign-out", meta: {showFooter: true, requiresEmailConfirmed: false}
    },
    {
        path: "/explore",
        component: ExplorePage,
        name: "explore",
        meta: {redirToLanguageSpecific: true},
    },
    {
        path: "/learn/:learningLanguage/explore",
        name: "explore-lang",
        component: ExplorePage,
        redirect: {name: "explore-recent-lessons"},
        meta: {
            queryParamsSchema: z.object({
                page: z.string().regex(/^[1-9][0-9]*$/).optional().catch(undefined),
                pageSize: z.string().regex(/5|10|25|50|100|150|200/).optional().catch(undefined),
                searchQuery: z.string().optional().default("").optional().catch(undefined),
            }),
        },
        props: ({query: q}) => ({
            queryParams: {
                page: Number(q.page) || 1,
                pageSize: Number(q.pageSize) || 25,
                searchQuery: q.searchQuery ?? "",
            }
        }),
        children: [
            {
                path: "/learn/:learningLanguage/explore/lessons/recent",
                component: RecentLessonsTab,
                name: "explore-recent-lessons",
            },
            {
                path: "/learn/:learningLanguage/explore/lessons/popular",
                component: PopularLessonsTab,
                name: "explore-popular-lessons",
            }
        ]
    },
    {
        path: "/my-library",
        component: MyLibraryPage,
        name: "my-library",
        meta: {redirToLanguageSpecific: true}
    },
    {
        path: "/learn/:learningLanguage/my-library",
        component: MyLibraryPage,
        name: "language-my-library",
        meta: {
            queryParamsSchema: z.object({
                page: z.string().regex(/^[1-9][0-9]*$/).optional().catch(undefined),
                pageSize: z.string().regex(/5|10|25|50|100|150|200/).optional().catch(undefined),
                searchQuery: z.string().optional().default("").optional().catch(undefined),
            }),
        },
        props: ({query: q, params: p}) => ({
            pathParams: {learningLanguage: p.learningLanguage},
            queryParams: {
                page: Number(q.page) || 1,
                pageSize: Number(q.pageSize) || 25,
                searchQuery: q.searchQuery ?? "",
            }
        }),
    },
    {
        path: "/my-vocab",
        component: MyVocabPage,
        name: "my-vocab",
        meta: {redirToLanguageSpecific: true,}
    },
    {
        path: "/learn/:learningLanguage/my-vocab",
        component: MyVocabPage,
        name: "language-my-vocab",
        meta: {
            queryParamsSchema: z.object({
                page: z.string().regex(/^[1-9][0-9]*$/).optional().catch(undefined),
                pageSize: z.string().regex(/5|10|25|50|100|150|200/).optional().catch(undefined),
                searchQuery: z.string().optional().default("").optional().catch(undefined),
                level: z.union([
                    z.string().regex(new RegExp(Object.values(constants.ALL_VOCAB_LEVELS).map(String).join("|"))),
                    z.array(z.string().regex(new RegExp(Object.values(constants.ALL_VOCAB_LEVELS).map(String).join("|"))))
                ]).optional().catch(undefined)
            }),
        },
        props: ({query: q, params: p}) => ({
            pathParams: {learningLanguage: p.learningLanguage},
            queryParams: {
                page: Number(q.page) || 1,
                pageSize: Number(q.pageSize) || 25,
                searchQuery: q.searchQuery ?? "",
                level: q.level ? (Array.isArray(q.level) ? q.level : [q.level]) : Object.values(constants.ALL_VOCAB_LEVELS)
            }
        }),
    },
    {
        path: "/learn/:learningLanguage/lessons/:lessonId",
        component: LessonReaderPage,
        name: "lesson",
        meta: {}
    },
    {
        path: "/lessons/add",
        component: LessonAddEditPage,
        name: "add-lesson",
        meta: {redirToLanguageSpecific: true}
    },
    {
        path: "/learn/:learningLanguage/lessons/add",
        name: "add-lesson-lang",
        component: LessonAddEditPage,
        meta: {}
    },
    {
        path: "/learn/:learningLanguage/lessons/:lessonId/edit",
        component: LessonAddEditPage,
        name: "edit-lesson",
        meta: {}
    },
    {
        path: "/courses/add",
        component: CourseAddPage,
        name: "add-course",
        meta: {redirToLanguageSpecific: true}
    },
    {
        path: "/learn/:learningLanguage/courses/add",
        name: "add-course-lang",
        component: CourseAddPage,
        meta: {}
    },
    {
        path: "/learn/:learningLanguage/courses/:courseId",
        component: CoursePage,
        name: "course",
        meta: {}
    },
    {
        path: "/learn/:learningLanguage/courses/:courseId/edit",
        component: CourseEditPage,
        name: "edit-course",
        meta: {}
    },
    {
        path: "/learn/new",
        component: NewLanguagePage,
        name: "new-language",
        meta: {}
    },
    {
        path: "/profiles/me",
        component: MyProfilePage,
        name: "my-profile",
        meta: {showFooter: true}
    },
    {
        path: "/settings",
        component: SettingsPage,
        redirect: {name: "account-settings",},
        name: "settings",
        meta: {showFooter: true},
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
    {
        name: "confirm-email",
        path: "/confirm-email",
        component: ConfirmEmailPage,
        meta: {
            requiresEmailConfirmed: false,
            showFooter: true,
            queryParamsSchema: z.object({token: z.string().min(1).optional().catch(undefined)}),
        },
        props: ({query: q}) => ({queryParams: {token: q.token}}),
    },
    {
        name: "confirm-email-sent",
        path: "/confirm-email-sent",
        component: ConfirmEmailSentPage,
        meta: {
            requiresEmailConfirmed: false,
            showFooter: true,
        },
    },
    {
        name: "resend-confirm-email",
        path: "/resend-confirm-email",
        component: ResendConfirmEmailPage,
        meta: {
            requiresEmailConfirmed: false,
            showFooter: true,
        },
    },
];
setDefaultRouteMeta(privateRoutes, {
    requiresAuth: true,
    requiresEmailConfirmed: true,
    showFooter: false
});
