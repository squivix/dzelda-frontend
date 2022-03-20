import { createRouter, createWebHistory } from "vue-router";

import UserLogin from './pages/auth/UserLogin.vue'
import UserSignUp from './pages/auth/UserSignUp.vue'
const router = createRouter({
    routes: [
        { path: '/login', component: UserLogin, name: 'login' },
        { path: '/sign-up', component: UserSignUp, name: 'sign-up' }

    ],
    history: createWebHistory(),
});

export default router;

