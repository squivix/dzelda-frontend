import HomePage from "@/views/HomePage.vue";
import SignUpPage from "@/views/auth/SignUpPage.vue";
import LoginPage from "@/views/auth/LoginPage.vue";
import {RouteRecordRaw} from "vue-router";
import ResetPasswordRequestPage from "@/views/auth/ResetPasswordRequestPage.vue";
import ResetPasswordPage from "@/views/auth/ResetPasswordPage.vue";

export const publicRoutes: Readonly<RouteRecordRaw[]> = [
    {path: "/", redirect: {name: "home"}, name: "root", meta: {requiresAuth: false, showFooter: true}},
    {path: "/home", component: HomePage, name: "home", meta: {requiresAuth: false, showFooter: true}},
    {path: "/login", component: LoginPage, name: "login", meta: {requiresAuth: false, showFooter: true}},

    {path: "/sign-up", component: SignUpPage, name: "sign-up", meta: {requiresAuth: false, showFooter: true}},
    {
        path: "/reset-password-request",
        component: ResetPasswordRequestPage,
        name: "reset-password-request",
        meta: {
            requiresAuth: false, showFooter: true,
            query: {
                'token': 'string'
            }
        }
    },
    {
        path: "/reset-password",
        component: ResetPasswordPage,
        name: "reset-password",
        meta: {requiresAuth: false, showFooter: true}
    },


]