<template>
    <div id="the-root">
        <component
                :is="isAuthenticated ? 'auth-header' : 'guest-header'">
        </component>
        <aside class="left-side"></aside>

        <main>
            <router-view></router-view>
        </main>

        <aside class="right-side"></aside>

        <the-footer v-if="$route.meta.showFooter"></the-footer>
    </div>
</template>
<script>
    import GuestHeader from '@/components/layout/GuestHeader.vue';
    import TheFooter from '@/components/layout/TheFooter.vue';
    import AuthHeader from '@/components/layout/AuthHeader.vue';
    import {useAuthStore} from "@/stores/auth";


    export default {
        computed: {
            isAuthenticated() {
                return this.authStore.isAuthenticated;
            },
        },
        components: {
            GuestHeader,
            AuthHeader,
            TheFooter,
        },
        created() {
            this.authStore = useAuthStore()
        }
    };
</script>
<style>
    @import './assets/styles/reset.css';
    @import './assets/styles/common.css';
</style>

<style scoped>
    #the-root {
        display: grid;
        grid-template: auto 1fr auto / auto 1fr auto;
        height: 100%;
    }

    header {
        grid-column: 1 / 4;
        margin-bottom: 3rem;
    }

    main {
        grid-column: 2 / 3;
    }

    .left-side {
        grid-column: 1 / 2;
    }

    main {
        grid-column: 2 / 3;
    }

    .right-side {
        grid-column: 3 / 4;
    }

    footer {
        grid-column: 1 / 4;
    }
</style>