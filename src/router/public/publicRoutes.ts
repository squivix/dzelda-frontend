import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/auth/LoginPage.vue";
import UserSignUp from "@/views/auth/UserSignUp.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";
import {RouteRecordRaw} from "vue-router";

export const publicRoutes: Readonly<RouteRecordRaw[]> = [
    {path: "/", redirect: {name: "home"}, name: "root", meta: {requiresAuth: false, showFooter: true}},
    {path: "/home", component: HomePage, name: "home", meta: {requiresAuth: false, showFooter: true}},
    {path: "/login", component: LoginPage, name: "login", meta: {requiresAuth: false, showFooter: true}},
    {path: "/sign-up", component: UserSignUp, name: "sign-up", meta: {requiresAuth: false, showFooter: true}},
    {
        path: "/forgot-password",
        component: ForgotPassword,
        name: "forgot-password",
        meta: {requiresAuth: false, showFooter: true}
    },

]