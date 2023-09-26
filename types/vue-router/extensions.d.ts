export {}

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean
        requiresEmailConfirmed?: boolean
        showFooter?: boolean
    }
}
