<template>
  <form @submit.prevent="updateProfile" v-if="userStore.userAccount" class="profile-wrapper">
    <button v-if="!isEditing" @click="editForm" class="edit-button square-button icon-button primary-hollow-button">
      <inline-svg :src="icons.pen"/>
      Edit
    </button>
    <SubmitButton v-else
                  class="save-button square-button primary-filled-button"
                  type="submit"
                  :is-submitting="isSubmitting">Save
    </SubmitButton>

    <BaseImageUploadInput :path="userStore.userAccount.profile.profilePicture"
                          class="profile-picture"
                          :fallback="icons.userProfile"
                          v-model="profilePicture"
                          :enabled="isEditing"
                          circular/>
    <p v-if="errorFields.profilePicture" class="error-message">{{ errorFields.profilePicture }}</p>
    <h3 class="username">{{ userStore.userAccount!.username }}</h3>
    <textarea class="bio" placeholder="Your bio" :disabled="!isEditing" v-model="bio"></textarea>
    <p v-if="errorFields.bio" class="error-message">{{ errorFields.bio }}</p>
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
import SubmitButton from "@/components/ui/SubmitButton.vue";

export default defineComponent({
  name: "ProfileForm",
  components: {SubmitButton, BaseImageUploadInput, BaseImage, InlineSvg},
  data() {
    return {
      //@ts-ignore store type not recognized in data due to bad vue support :(
      bio: this.userStore.userAccount.profile.bio,
      isEditing: false,
      profilePicture: undefined as File | undefined | "",
      isSubmitting: false,
      errorFields: {bio: "", profilePicture: ""}
    };
  },
  methods: {
    editForm() {
      this.isEditing = true;
    },
    async updateProfile() {
      this.errorFields = {bio: "", profilePicture: ""};
      this.isSubmitting = true;
      const response = await this.userStore.updateUserProfile({
        bio: this.bio,
        profilePicture: this.profilePicture
      });
      this.isSubmitting = false;

      if (response.ok) {
        this.profilePicture = undefined;
        this.isEditing = false;
      } else {
        const error = response.error;
        if (error.code == 400)
          this.errorFields = error.fields as { bio: string, profilePicture: string };
        else if (error.code == 413 || error.code == 415)
          this.errorFields.profilePicture = error.message;
      }
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
.profile-wrapper {
  min-width: 200px;
  width: 15vw;
}

.profile-picture {
  border-radius: 50%;
}

.username {
  text-align: center;
  font-size: 1.2rem;
}

.bio {
  resize: none;
  min-height: 7rlh;
}

.edit-button, .save-button {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  align-self: flex-end;
}

</style>
