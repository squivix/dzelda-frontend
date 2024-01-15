<template>
  <BaseDropDown :is-pointy="true" id="profile-menu">
    <template v-slot:button>
      <BaseImage :image-url="profilePicture"
                 :fall-back-url="icons.userProfile" class="profile-picture"
                 alt="profile picture"/>
    </template>
    <template v-slot:menu>
      <ol class="profile-menu dropdown-list">
        <li>
          <router-link :to="{name:'my-profile'}">
            <inline-svg :src="icons.userProfile"/>
            <span>My Profile</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{name:'settings'}">
            <inline-svg :src="icons.settings"/>
            <span>Settings</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{name:'sign-out'}">
            <inline-svg :src="icons.signOut"/>
            <span>Sign Out</span>
          </router-link>
        </li>
      </ol>
    </template>
  </BaseDropDown>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import InlineSvg from "vue-inline-svg";
import BaseImage from "@/components/ui/BaseImage.vue";
import {icons} from "@/icons.js";
import {useUserStore} from "@/stores/backend/userStore.js";

export default defineComponent({
  name: "ProfileDropDown",
  components: {BaseImage, InlineSvg, BaseDropDown},
  computed: {
    userAccount() {
      return this.userStore.userAccount;
    },
    profilePicture() {
      return this.userAccount?.profile.profilePicture ?? "";
    }
  },
  setup() {
    return {
      icons,
      userStore: useUserStore(),
    };
  }
});
</script>

<style scoped>

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--on-primary-color);
}

.profile-picture:deep(svg) {
  width: 24px;
  height: 24px;
  color: var(--primary-color);
}

.profile-menu {
  width: 10vw;
  max-width: 100px;
  min-width: 85px;
}
</style>
