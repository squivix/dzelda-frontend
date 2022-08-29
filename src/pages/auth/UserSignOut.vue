<template>
    <h1>Signing out...</h1>
</template>

<script>
    export default {
        name: "UserSignOut",
        async created() {
            await this.$store.dispatch('auth/signOut');
            await this.$router.push({name: 'home'});
        },
    };
</script>