<template>
  <base-card title="Profile" class="my-profile-base-card" v-if="userStore.userAccount">
    <template v-slot:all>
      <profile-form class="profile-wrapper"/>
      <div class="stats-wrapper">
        <RecentActivityChart :user="userStore.userAccount"/>
      </div>
    </template>
  </base-card>
</template>

<script lang="ts">
import {useUserStore} from "@/stores/backend/userStore.js";
import BaseImage from "@/components/ui/BaseImage.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import ProfileForm from "@/components/page/my-profile/ProfileForm.vue";
import RecentActivityChart from "@/components/page/my-profile/RecentActivityChart.vue";

export default {
  name: "MyProfilePage",
  components: {RecentActivityChart, ProfileForm, BaseImage, InlineSvg},
  data() {
    return {}
  },
  setup() {
    return {icons, userStore: useUserStore()}
  },
}
</script>

<style scoped>

.my-profile-base-card {
  display: flex;
  flex-direction: row;
  min-width: 70vw;
  column-gap: 2rem;
}

.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  row-gap: 1rem;
  flex: 1;
}

.stats-wrapper {
  flex: 3;
}

</style>