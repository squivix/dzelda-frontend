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
