<template>
  <h1>Signing out...</h1>
</template>

<script>
export default {
  async created() {
    await this.$store.dispatch('signOut');
    this.$router.push({ name: 'home' });
  },
};
</script>