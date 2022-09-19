<template>
  <h1>My Profile Page</h1>
  <p v-if="profile">Signed in as {{ profile.username }}</p>
</template>

<script>
import {useProfileStore} from "@/stores/profile.js";

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
  created() {
    this.profileStore = useProfileStore()
  },
}
</script>

<style scoped>

</style>