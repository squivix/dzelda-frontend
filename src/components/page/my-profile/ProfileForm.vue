<template>
  <form @submit.prevent="updateProfile" v-if="userStore.userAccount" class="profile-wrapper">
    <button v-if="!isEditing" @click="editForm" class="edit-button square-button icon-text-wrapper primary-hollow-button">
      <inline-svg :src="icons.pen"/>
      Edit
    </button>
    <div class="buttons-div" v-else>
      <button v-if="!isSubmitting" type="button" class="square-button primary-hollow-button reset-button" @click="clearForm">Cancel</button>
      <SubmitButton class="save-button square-button primary-filled-button"
                    type="submit"
                    :isSubmitting="isSubmitting">
        {{ submittingMessage ?? "Save" }}
      </SubmitButton>
    </div>

    <ImageUploadInput id="profile-picture-input"
                      v-model="profilePicture"
                      class="profile-picture"
                      name="profile picture"
                      :oldImagePath="userStore.userAccount.profile.profilePicture"
                      :maxFileSizeInBytes="mebiBytes(1)"
                      :fallback="icons.userProfile"
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
import {icons} from "@/icons.js";
import {useUserStore} from "@/stores/backend/userStore.js";
import {useStore} from "@/stores/backend/rootStore.js";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import {mebiBytes} from "dzelda-common";

export default defineComponent({
  name: "ProfileForm",
  components: {SubmitButton, ImageUploadInput, InlineSvg},
  data() {
    return {
      //@ts-ignore store type not recognized in data due to bad vue support :(
      bio: this.userStore.userAccount.profile.bio,
      isEditing: false,
      profilePicture: undefined as File | undefined | "",
      isSubmitting: false,
      submittingMessage: undefined as string | undefined,
      errorFields: {bio: "", profilePicture: ""}
    };
  },
  watch: {
    isSubmitting() {
      if (!this.isSubmitting)
        this.submittingMessage = undefined;
    }
  },
  methods: {
    editForm() {
      this.isEditing = true;
    },
    clearForm() {
      this.bio = this.userStore.userAccount!.profile.bio;
      this.profilePicture = undefined;
      this.isEditing = false;
    },
    async updateProfile() {
      this.errorFields = {bio: "", profilePicture: ""};
      this.isSubmitting = true;
      let profilePictureUrl;
      if (this.profilePicture) {
        this.submittingMessage = "Uploading";
        profilePictureUrl = await this.store.uploadFile({
          fileField: "profilePicture",
          fileExtension: ".jpg",
          file: new File([this.profilePicture], "image.jpg"),
        });
        if (!profilePictureUrl) {
          this.isSubmitting = false;
          return;
        }
      } else
        profilePictureUrl = this.profilePicture;

      this.submittingMessage = "Saving";
      const response = await this.userStore.updateUserProfile({
        bio: this.bio,
        profilePicture: profilePictureUrl
      });
      this.isSubmitting = false;

      if (response.ok) {
        this.profilePicture = undefined;
        this.isEditing = false;
      } else {
        const error = response.error;
        if (error.code == 400)
          this.errorFields = error.fields as {
            bio: string,
            profilePicture: string
          };
        else if (error.code == 413 || error.code == 415)
          this.errorFields.profilePicture = error.message;
      }
    },
  },
  setup() {
    return {
      icons,
      mebiBytes,
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

.buttons-div {
  display: flex;
  column-gap: 0.5rem;
  align-self: flex-end;
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

.edit-button {
  align-self: flex-end;
}

.edit-button, .save-button, .reset-button {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  align-self: flex-end;
}

</style>
