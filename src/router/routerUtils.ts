import {NavigationGuardWithThis, RouteMeta, RouteRecordRaw} from "vue-router";

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

export function transformQueryParams(queryParams: { [key: string]: any }, transformers: { [key: string]: (oldVal: any) => any; }) {
    const newQuery = {...queryParams};
    for (const key in transformers) {
        if (transformers[key] !== undefined)
            newQuery[key] = transformers[key](queryParams[key]);
    }
    return newQuery;
}

