import {NavigationGuardWithThis} from "vue-router";
import {shallowObjectEquals} from "@/utils.js";
import {queryParamsEqual} from "@/router/routerUtils.js";

export const validateQueryParamsGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    if (to.meta.queryParamsSchema) {
        const parsedQueryParams = to.meta.queryParamsSchema.parse(to.query);
        if (!queryParamsEqual(parsedQueryParams, to.query))
            return {...to, query: parsedQueryParams};
    }
};
