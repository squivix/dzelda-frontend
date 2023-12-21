import {RouteParamDef} from "@/router/queryParams.js";

export {};

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
        requiresEmailConfirmed?: boolean;
        showFooter?: boolean;
        showHeader?: boolean;
        queryParams?: { [key: string]: RouteParamDef };
        pathParams?: { [key: string]: RouteParamDef }
    }
}
