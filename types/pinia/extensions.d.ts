import 'pinia';

declare module 'pinia' {
    export interface PiniaCustomProperties {
        router: import('vue-router').Router;
    }
}
