<template>
    <h1>Signing out...</h1>
</template>

<script lang="ts">
import {useAuthStore} from "@/stores/backend/authStore.js";

    export default {
        name: "SignOutPage",
        async created() {
            const authStore = useAuthStore();
            await authStore.signOut();
            await this.$router.push({name: 'home'});
        },
    };
</script>
