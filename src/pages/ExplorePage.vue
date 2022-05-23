<template>
    <h1>Explore!</h1>
</template>

<script>
    import store from '@/store';

    export default {
        beforeRouteEnter: async (to) => {
            //if no lang was specified
            if (to.name === 'explore') {
                const languages = await store.dispatch('fetchUserLanguages');
                return {path: `/learn/${languages[0].code}/explore`};
            }
        },
    };
</script>