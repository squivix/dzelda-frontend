import {createRouter, createWebHistory} from "vue-router";
import {privateRoutes} from "@/router/private/privateRoutes.js";
import {publicRoutes} from "@/router/public/publicRoutes.js";
import {requiresAuthGuard} from "@/router/beforeEachGuards/requiresAuthGuard.js";
import {clearMessageBarGuard} from "@/router/beforeEachGuards/clearMessageBarGuard.js";
import {requiresEmailConfirmedGuard} from "@/router/beforeEachGuards/requiresEmailConfirmedGuard.js";
import {fetchUserDataGuard} from "@/router/beforeEachGuards/fetchUserDataGuard.js";
import {redirToLangSpecificGuard} from "@/router/beforeEachGuards/redirToLangSpecificGuard.js";
import {updateLanguageLastOpenedGuard} from "@/router/beforeEachGuards/updateLanguageLastOpenedGuard.js";
import {validateQueryParamsGuard} from "@/router/beforeEachGuards/validateQueryParamsGuard.js";
import {validatePathParams} from "@/router/beforeEachGuards/validatePathParams.js";

export const router = createRouter({
    routes: [
        ...privateRoutes,
        ...publicRoutes,
    ],
    history: createWebHistory(),
});

router.beforeEach(requiresAuthGuard);
router.beforeEach(fetchUserDataGuard);
router.beforeEach(requiresEmailConfirmedGuard);
router.beforeEach(redirToLangSpecificGuard);
router.beforeEach(validatePathParams);
router.beforeEach(validateQueryParamsGuard);
router.beforeEach(updateLanguageLastOpenedGuard);
router.beforeEach(clearMessageBarGuard);
