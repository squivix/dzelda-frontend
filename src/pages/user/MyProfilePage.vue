<template>
  <base-card title="Profile" class="my-profile-base-card">
    <template v-slot:all>
      <profile-form class="profile-wrapper"/>
      <div class="stats-wrapper">

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

export default {
  name: "MyProfilePage",
  components: {ProfileForm, BaseImage, InlineSvg},
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
  width: 70vw;
}

.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  row-gap: 1rem;
}

.stats-wrapper {
  flex-grow: 1;
}

</style>