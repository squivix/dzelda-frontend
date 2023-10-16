import HomePage from "@/pages/HomePage.vue";
import SignUpPage from "@/pages/auth/SignUpPage.vue";
import LoginPage from "@/pages/auth/LoginPage.vue";
import {RouteRecordRaw} from "vue-router";
import ResetPasswordRequestPage from "@/pages/auth/ResetPasswordRequestPage.vue";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage.vue";
import {setDefaultRouteMeta} from "@/router/routerUtils.js";
import {z} from "zod";

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
            queryParamsSchema: z.object({token: z.string().min(1).optional().catch(undefined)})
        },
        props: ({query: q}) => ({queryParams: {token: q.token ?? ""}}),
    },
];

setDefaultRouteMeta(publicRoutes, {
    requiresAuth: false,
    requiresEmailConfirmed: false,
    showFooter: true
});
