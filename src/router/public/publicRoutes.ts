import HomePage from "@/pages/HomePage.vue";
import SignUpPage from "@/pages/auth/SignUpPage.vue";
import LoginPage from "@/pages/auth/LoginPage.vue";
import {RouteRecordRaw} from "vue-router";
import ResetPasswordRequestPage from "@/pages/auth/ResetPasswordRequestPage.vue";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage.vue";
import {setDefaultRouteMeta} from "@/router/routerUtils.js";
import {privateRoutes} from "@/router/private/privateRoutes.js";
import {z} from "zod";
import {VocabLevelSchema} from "dzelda-types";
import constants from "@/constants.js";

export const publicRoutes: Readonly<RouteRecordRaw[]> = [
    {path: "/", redirect: {name: "home"}, name: "root", meta: {}},
    {path: "/home", component: HomePage, name: "home", meta: {}},
    {path: "/login", component: LoginPage, name: "login", meta: {}},
    {path: "/sign-up", component: SignUpPage, name: "sign-up", meta: {}},
    {
        path: "/reset-password-request",
        component: ResetPasswordRequestPage,
        name: "reset-password-request",
        meta: {query: {"token": "string:"}}
    },
    {
        path: "/reset-password", component: ResetPasswordPage, name: "reset-password",
        meta: {
            queryParamsSchema: z.object({token: z.string().min(1).optional().catch(undefined)}),
        },
        props: ({query: q}) => ({queryParams: {token: q.token ?? ""}}),
    },
];

setDefaultRouteMeta(privateRoutes, {
    requiresAuth: false,
    requiresEmailConfirmed: false,
    showFooter: true
});
