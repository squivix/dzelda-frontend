import {LocationQueryValue} from "vue-router";
import {ZodObject, ZodSchema} from "zod";

export {};

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
        requiresEmailConfirmed?: boolean;
        showFooter?: boolean;
        queryParamsSchema?: ZodObject;
    }
}
