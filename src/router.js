import { createRouter, createWebHistory } from "vue-router";

import UserLogin from './pages/auth/UserLogin.vue'
import UserSignUp from './pages/auth/UserSignUp.vue'
import ForgotPassword from './pages/auth/ForgotPassword.vue'
const router = createRouter({
    routes: [
        { path: '/login', component: UserLogin, name: 'login' },
        { path: '/sign-up', component: UserSignUp, name: 'sign-up' },
        { path: '/forgot-password', component: ForgotPassword, name: 'forgot-password' },

    ],
    history: createWebHistory(),
});

export default router;

