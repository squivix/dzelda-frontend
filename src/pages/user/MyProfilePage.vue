<template>
  <h1>My Profile Page</h1>
  <p v-if="profile">Signed in as {{ profile.username }}</p>
</template>

<script lang="ts">
import {useUserStore} from "@/stores/backend/userStore.js";

export default {
  name: "MyProfilePage",
  data() {
    return {
      profile: null,
    }
  },
  async mounted() {
    this.profile = await this.fetchProfile();
  },

  methods: {
    async fetchProfile() {
      return await this.profileStore.fetchUserProfile();
    }
  },
  setup() {
    return {profileStore: useUserStore()}
  },
}
</script>

<style scoped>

</style>
