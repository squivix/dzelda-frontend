import ExplorePage from "@/pages/ExplorePage.vue";
import MyLibraryPage from "@/pages/MyLibraryPage.vue";
import MyVocabPage from "@/pages/MyVocabPage.vue";
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
import {routeToProps, setDefaultRouteMeta} from "@/router/routerUtils.js";
import ConfirmEmailSentPage from "@/pages/auth/ConfirmEmailSentPage.vue";
import ResendConfirmEmailPage from "@/pages/auth/ResendConfirmEmailPage.vue";
import RecentLessonsTab from "@/components/page/explore/RecentLessonsTab.vue";
import PopularLessonsTab from "@/components/page/explore/PopularLessonsTab.vue";
import BookmarkedCoursesTab from "@/components/page/my-library/BookmarkedCoursesTab.vue";
import ImportedCoursesTab from "@/components/page/my-library/ImportedCoursesTab.vue";
import LessonHistoryTab from "@/components/page/my-library/LessonHistoryTab.vue";
import * as queryParams from "@/router/queryParams.js";
import * as pathParams from "@/router/pathParams.js";
import {excludeProperties} from "@/utils.js";

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
        props: routeToProps,
        meta: {
            pathParams: {learningLanguage: pathParams.languageCode},
            queryParams: {
                ...queryParams.generatePaginationQueryParams([5, 10, 25, 50, 100]),
                ...queryParams.lessonFilters,
                searchQuery: queryParams.searchQuery
            },
        },
        children: [
            {
                path: "/learn/:learningLanguage/explore/lessons/recent",
                component: RecentLessonsTab,
                name: "explore-recent-lessons",
                meta: {pathParams: {learningLanguage: pathParams.languageCode}}
            },
            {
                path: "/learn/:learningLanguage/explore/lessons/popular",
                component: PopularLessonsTab,
                name: "explore-popular-lessons",
                meta: {pathParams: {learningLanguage: pathParams.languageCode}}
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
        redirect: {name: "my-library-bookmarked-courses"},
        name: "language-my-library",
        meta: {pathParams: {learningLanguage: pathParams.languageCode}},
        children: [
            {
                path: "/learn/:learningLanguage/my-library/bookmarks",
                component: BookmarkedCoursesTab,
                name: "my-library-bookmarked-courses",
                meta: {
                    pathParams: {learningLanguage: pathParams.languageCode},
                    queryParams: {
                        ...queryParams.generatePaginationQueryParams([5, 10, 25, 50, 100]),
                        ...queryParams.courseFilters,
                        searchQuery: queryParams.searchQuery
                    }
                },
                props: routeToProps,
            },
            {
                path: "/learn/:learningLanguage/my-library/imported",
                component: ImportedCoursesTab,
                name: "my-library-imported-courses",
                meta: {
                    pathParams: {learningLanguage: pathParams.languageCode},
                    queryParams: {
                        ...queryParams.generatePaginationQueryParams([5, 10, 25, 50, 100]),
                        ...excludeProperties(queryParams.courseFilters, ["addedBy"]),
                        searchQuery: queryParams.searchQuery
                    }
                },
                props: routeToProps,
            },
            {
                path: "/learn/:learningLanguage/my-library/history",
                component: LessonHistoryTab,
                name: "my-library-lesson-history",
                meta: {
                    pathParams: {learningLanguage: pathParams.languageCode},
                    queryParams: {
                        ...queryParams.generatePaginationQueryParams([5, 10, 25, 50, 100]),
                        ...queryParams.lessonFilters,
                        searchQuery: queryParams.searchQuery
                    }
                },
                props: routeToProps,
            }
        ]
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
            pathParams: {learningLanguage: pathParams.languageCode},
            queryParams: {
                ...queryParams.generatePaginationQueryParams([25, 50, 100, 150, 200]),
                ...queryParams.vocabFilters,
                searchQuery: queryParams.searchQuery
            },
        },
        props: routeToProps,
    },
    {
        path: "/learn/:learningLanguage/lessons/:lessonId",
        component: LessonReaderPage,
        name: "lesson",
        meta: {
            pathParams: {
                learningLanguage: pathParams.languageCode,
                lessonId: pathParams.id
            }
        },
        props: routeToProps,
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
        meta: {
            queryParams: {
                courseId: pathParams.id
            }
        },
        props: routeToProps,
    },
    {
        path: "/learn/:learningLanguage/lessons/:lessonId/edit",
        component: LessonAddEditPage,
        name: "edit-lesson",
        meta: {
            pathParams: {
                learningLanguage: pathParams.languageCode,
                lessonId: pathParams.id
            }
        },
        props: routeToProps,
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
        meta: {
            pathParams: {learningLanguage: pathParams.languageCode,}
        },
    },
    {
        path: "/learn/:learningLanguage/courses/:courseId",
        component: CoursePage,
        name: "course",
        meta: {
            pathParams: {
                learningLanguage: pathParams.languageCode,
                courseId: pathParams.id
            }
        }
    },
    {
        path: "/learn/:learningLanguage/courses/:courseId/edit",
        component: CourseEditPage,
        name: "edit-course",
        meta: {
            pathParams: {
                learningLanguage: pathParams.languageCode,
                courseId: pathParams.id
            }
        },
        props: routeToProps,
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
            queryParams: {token: queryParams.token}
        },
        props: routeToProps,
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
