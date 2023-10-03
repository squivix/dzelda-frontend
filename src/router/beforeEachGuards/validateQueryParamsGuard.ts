import {NavigationGuardWithThis} from "vue-router";
import {shallowObjectEquals} from "@/utils.js";

export const validateQueryParamsGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    if (to.meta.queryParamsSchema) {
        const parsedQueryParams = to.meta.queryParamsSchema.parse(to.query);
        if (!shallowObjectEquals(parsedQueryParams, to.query))
            return {...to, query: parsedQueryParams};
    }
};
