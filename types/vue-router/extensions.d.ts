import {QueryParamDef} from "@/router/queryParams.js";

export {};

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
        requiresEmailConfirmed?: boolean;
        showFooter?: boolean;
        queryParams?: { [key: string]: QueryParamDef };
    }
}
