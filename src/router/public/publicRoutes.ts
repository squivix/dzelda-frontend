import HomePage from "@/pages/HomePage.vue";
import SignUpPage from "@/pages/auth/SignUpPage.vue";
import LoginPage from "@/pages/auth/LoginPage.vue";
import type {RouteRecordRaw} from "vue-router";
import ResetPasswordRequestPage from "@/pages/auth/ResetPasswordRequestPage.vue";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage.vue";
import {setDefaultRouteMeta} from "@/router/routerUtils.js";
import {z} from "zod";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import ServerSideErrorPage from "@/pages/ServerSideErrorPage.vue";

export const publicRoutes: RouteRecordRaw[] = [
    {path: "/", redirect: {name: "home"}, name: "root"},
    {path: "/home", component: HomePage, name: "home"},
    {path: "/login", component: LoginPage, name: "login"},
    {path: "/sign-up", component: SignUpPage, name: "sign-up"},
    {
        path: "/reset-password-request",
        component: ResetPasswordRequestPage,
        name: "reset-password-request",
        meta: {query: {"token": "string:"}}
    },
    {
        path: "/reset-password", component: ResetPasswordPage, name: "reset-password",
        meta: {
            queryParams: {
                token: {schema: z.string().min(1).optional().catch(undefined)},
            }
        },
        props: ({query: q}) => ({queryParams: {token: q.token ?? ""}}),
    },
    {path: "/404", name: "not-found", component: NotFoundPage},
    {path: "/500", name: "server-side-error", component: ServerSideErrorPage, meta: {showHeader: false, showFooter: false}},
];

setDefaultRouteMeta(publicRoutes, {
    requiresAuth: false,
    requiresEmailConfirmed: false,
    showHeader: true,
    showFooter: true
});
