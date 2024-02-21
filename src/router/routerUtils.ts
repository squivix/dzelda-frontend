import {RouteLocationNormalized, RouteMeta, RouteRecordRaw} from "vue-router";
import {z} from "zod";

export function setDefaultRouteMeta(routes: RouteRecordRaw[], defaultMeta: RouteMeta) {
    for (const route of routes) {
        if (!route.meta)
            route.meta = defaultMeta;
        else {
            for (const key in defaultMeta) {
                if (!(key in route.meta)) {
                    route.meta[key] = defaultMeta[key];
                }
            }
        }
        if (route.children)
            setDefaultRouteMeta(route.children, defaultMeta);
    }
}

export function queryParamsEqual(object1: Record<string, any>, object2: Record<string, any>): boolean {
    const objKeys1 = Object.keys(object1);
    const objKeys2 = Object.keys(object2);

    if (objKeys1.length !== objKeys2.length) return false;

    for (const key of objKeys1) {
        const value1 = object1[key], value2 = object2[key];
        if (Array.isArray(value1)) {
            if (!Array.isArray(value2) || value1.some((_, i) => value1[i] != value1[i]))
                return false;
        } else if (object1[key] !== object2[key])
            return false;
    }
    return true;
}

export const routeToProps = ({query: q, params: p}: RouteLocationNormalized) => ({pathParams: p, queryParams: q});
