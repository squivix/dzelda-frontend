import type {NavigationGuardWithThis} from "vue-router";

export const validatePathParams: NavigationGuardWithThis<undefined> = async (to, from) => {
    if (to.meta.pathParams) {
        const parsedPathParams: Record<string, string | string[]> = {};
        try {
            for (const key in to.params) {
                if (to.meta.pathParams[key])
                    parsedPathParams[key] = to.meta.pathParams[key].schema.parse(to.params[key])
            }
        } catch (e) {
            if (import.meta.env.DEV)
                console.warn(`Received unexpected or invalid path params ${JSON.stringify(to.params)}, redirecting to not found page`)
            return {name: "not-found"};
        }
        for (const key in parsedPathParams) {
            const pathParamDef = to.meta.pathParams[key];
            if (pathParamDef.postProcess)
                parsedPathParams[key] = pathParamDef.postProcess(parsedPathParams[key]);
        }
        to.params = parsedPathParams;
    }
};
