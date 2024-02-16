import ExplorePage from "@/pages/ExplorePage.vue";
import MyLibraryPage from "@/pages/MyLibraryPage.vue";
import MyVocabPage from "@/pages/MyVocabPage.vue";
import LessonReaderPage from "@/pages/LessonReaderPage.vue";
import CreateLessonPage from "@/pages/CreateLessonPage.vue";
import CreateCollectionPage from "@/pages/CreateCollectionPage.vue";
import CollectionPage from "@/pages/CollectionPage.vue";
import UpdateCollectionPage from "@/pages/UpdateCollectionPage.vue";
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
import ExploreRecentTab from "@/components/page/explore/ExploreRecentTab.vue";
import ExplorePopularTab from "@/components/page/explore/ExplorePopularTab.vue";
import LibraryBookmarkedTab from "@/components/page/my-library/LibraryBookmarkedTab.vue";
import LibraryImportedTab from "@/components/page/my-library/LibraryImportedTab.vue";
import LessonHistoryTab from "@/components/page/my-library/LessonHistoryTab.vue";
import * as queryParams from "@/router/queryParams.js";
import * as pathParams from "@/router/pathParams.js";
import {excludeProperties} from "@/utils.js";
import InterfaceTab from "@/components/page/settings/interface/InterfaceTab.vue";
import UpdateLessonPage from "@/pages/UpdateLessonPage.vue";

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
        redirect: to => ({name: "explore-recent", params: {...to.params, resourceType: "texts"}}),
        meta: {
            pathParams: {learningLanguage: pathParams.languageCode},
            queryParams: {
                ...queryParams.generatePaginationQueryParams([5, 10, 25, 50, 100]),
                ...queryParams.lessonFilters,
                searchQuery: queryParams.searchQuery
            },
        },
        props: routeToProps,
        children: [
            {
                path: "/learn/:learningLanguage/explore/:resourceType/recent",
                component: ExploreRecentTab,
                name: "explore-recent",
                meta: {pathParams: {learningLanguage: pathParams.languageCode, resourceType: pathParams.resourceType}}
            },
            {
                path: "/learn/:learningLanguage/explore/:resourceType/popular",
                component: ExplorePopularTab,
                name: "explore-popular",
                meta: {pathParams: {learningLanguage: pathParams.languageCode, resourceType: pathParams.resourceType}}
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
        redirect: {name: "my-library-bookmarked-tab"},
        name: "language-my-library",
        meta: {pathParams: {learningLanguage: pathParams.languageCode}},
        children: [
            {
                path: "/learn/:learningLanguage/my-library/bookmarks",
                component: LibraryBookmarkedTab,
                name: "my-library-bookmarked-tab",
                meta: {
                    pathParams: {learningLanguage: pathParams.languageCode},
                    queryParams: {
                        ...queryParams.generatePaginationQueryParams([5, 10, 25, 50, 100]),
                        ...queryParams.collectionFilters,
                        searchQuery: queryParams.searchQuery
                    }
                },
                props: routeToProps,
            },
            {
                path: "/learn/:learningLanguage/my-library/imported",
                component: LibraryImportedTab,
                name: "my-library-imported-tab",
                meta: {
                    pathParams: {learningLanguage: pathParams.languageCode},
                    queryParams: {
                        ...queryParams.generatePaginationQueryParams([5, 10, 25, 50, 100]),
                        ...excludeProperties(queryParams.collectionFilters, ["addedBy"]),
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
        component: CreateLessonPage,
        name: "add-lesson",
        meta: {redirToLanguageSpecific: true}
    },
    {
        path: "/learn/:learningLanguage/lessons/add",
        name: "add-lesson-lang",
        component: CreateLessonPage,
        meta: {
            queryParams: {
                collectionId: pathParams.id
            }
        },
        props: routeToProps,
    },
    {
        path: "/learn/:learningLanguage/lessons/:lessonId/edit",
        component: UpdateLessonPage,
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
        path: "/collections/add",
        component: CreateCollectionPage,
        name: "add-collection",
        meta: {redirToLanguageSpecific: true}
    },
    {
        path: "/learn/:learningLanguage/collections/add",
        name: "add-collection-lang",
        component: CreateCollectionPage,
        meta: {
            pathParams: {learningLanguage: pathParams.languageCode,}
        },
    },
    {
        path: "/learn/:learningLanguage/collections/:collectionId",
        component: CollectionPage,
        name: "collection",
        meta: {
            pathParams: {
                learningLanguage: pathParams.languageCode,
                collectionId: pathParams.id
            }
        },
        props: routeToProps,
    },
    {
        path: "/learn/:learningLanguage/collections/:collectionId/edit",
        component: UpdateCollectionPage,
        name: "edit-collection",
        meta: {
            pathParams: {
                learningLanguage: pathParams.languageCode,
                collectionId: pathParams.id
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
        redirect: {name: "interface-settings",},
        name: "settings",
        meta: {showFooter: true},
        children: [
            {
                path: "/settings/interface",
                name: "interface-settings",
                component: InterfaceTab,
            },
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
    showHeader: true,
    showFooter: false
});
