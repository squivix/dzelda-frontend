import {NavigationGuardWithThis} from "vue-router";
import {isEmptyObject, shallowObjectEquals} from "@/utils.js";
import {queryParamsEqual} from "@/router/routerUtils.js";
import {QueryParamDef} from "@/router/queryParams.js";

export const validateQueryParamsGuard: NavigationGuardWithThis<undefined> = async (to, from) => {
    if (to.meta.queryParams) {
        const parsedQueryParams: Record<string, string | string[]> = {};
        for (const key in to.query) {
            if (to.meta.queryParams[key])
                parsedQueryParams[key] = to.meta.queryParams[key].schema.catch(undefined).parse(to.query[key])
        }

        if (!queryParamsEqual(parsedQueryParams, to.query)) //if invalid redirect to clean
            return {...to, query: parsedQueryParams};
        else { //if valid post process
            for (const key in parsedQueryParams) {
                const queryParamDef = to.meta.queryParams[key];
                if (queryParamDef.postProcess)
                    parsedQueryParams[key] = queryParamDef.postProcess(parsedQueryParams[key]);
            }
            to.query = parsedQueryParams;
        }
    } else if (!isEmptyObject(to.query))
        return {...to, query: {}};
};