<template>
  <base-card title="Profile" class="my-profile-base-card">
    <template v-slot:all>
      <div v-if="userAccount">
        <base-image class="profile-picture" :image-url="userAccount.profile.profilePicture"
                    :fall-back-url="assets.accountProfile"/>
      </div>
    </template>
  </base-card>
</template>

<script lang="ts">
import {useUserStore} from "@/stores/backend/userStore.js";
import BaseImage from "@/components/ui/BaseImage.vue";
import userProfile from "@/assets/images/user-profile.svg"

export default {
  name: "MyProfilePage",
  components: {BaseImage},
  data() {
    return {
      //@ts-ignore store type not recognized in data due to bad vue support :(
      userAccount: this.userStore.userAccount,
    }
  },
  setup() {
    return {assets: {accountProfile: userProfile}, userStore: useUserStore()}
  },
}
</script>

<style scoped>
.my-profile-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  width: 70vw;
}

.profile-picture {
  border-radius: 50%;
}

.profile-picture :deep(svg) {
  fill: white;
}


</style>