import HomePage from "@/views/HomePage.vue";
import UserLogin from "@/views/auth/UserLogin.vue";
import UserSignUp from "@/views/auth/UserSignUp.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";

export const publicRoutes = [
    {path: "/", redirect: {name: "home"}, name: "root", meta: {requiresAuth: false, showFooter: true}},
    {path: "/home", component: HomePage, name: "home", meta: {requiresAuth: false, showFooter: true}},
    {path: "/login", component: UserLogin, name: "login", meta: {requiresAuth: false, showFooter: true}},
    {path: "/sign-up", component: UserSignUp, name: "sign-up", meta: {requiresAuth: false, showFooter: true}},
    {
        path: "/forgot-password",
        component: ForgotPassword,
        name: "forgot-password",
        meta: {requiresAuth: false, showFooter: true}
    },

]