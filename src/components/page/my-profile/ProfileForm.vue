<template>
  <form @submit.prevent="updateProfile" v-if="userStore.userAccount" class="profile-wrapper">
    <button v-if="!isEditing" @click="editForm" class="edit-button square-button icon-button primary-hollow-button">
      <inline-svg :src="icons.pen"/>
      Edit
    </button>
    <button v-else class="save-button square-button primary-filled-button" type="submit">Save</button>

    <BaseImageUploadInput :path="userStore.userAccount.profile.profilePicture"
                          class="profile-picture"
                          :fallback="icons.userProfile"
                          v-model="profilePicture"
                          :enabled="isEditing"
                          circular/>
    <h3 class="username">{{ userStore.userAccount!.username }}</h3>
    <textarea class="bio" maxlength="255" placeholder="Your bio" :disabled="!isEditing" v-model="bio"></textarea>
  </form>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import InlineSvg from "vue-inline-svg";
import BaseImage from "@/components/ui/BaseImage.vue";
import {icons} from "@/icons.js";
import {useUserStore} from "@/stores/backend/userStore.js";
import {useStore} from "@/stores/backend/rootStore.js";
import BaseImageUploadInput from "@/components/ui/BaseImageUploadInput.vue";

export default defineComponent({
  name: "ProfileForm",
  components: {BaseImageUploadInput, BaseImage, InlineSvg},
  data() {
    return {
      //@ts-ignore store type not recognized in data due to bad vue support :(
      bio: this.userStore.userAccount.profile.bio,
      isEditing: false,
      profilePicture: undefined as File | undefined | "",
    };
  },
  methods: {
    editForm() {
      this.isEditing = true;
    },
    async updateProfile() {
      await this.userStore.updateUserProfile({
        bio: this.bio,
        profilePicture: this.profilePicture
      });
      this.profilePicture = undefined;
      this.isEditing = false;
    },
  },
  setup() {
    return {
      icons,
      store: useStore(),
      userStore: useUserStore()
    };
  },
});
</script>

<style scoped>
.profile-picture {
  border-radius: 50%;
}

.username {
  text-align: center;
  font-size: 1.2rem;
}

.bio {
  resize: none;
  height: 5rem;
}

.edit-button, .save-button {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  align-self: flex-end;
}


</style>
