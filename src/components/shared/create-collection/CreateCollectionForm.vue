<template>
  <form class="create-collection-form" @submit.prevent="onSubmit">
    <div class="image-section">
      <label>Image</label>
      <ImageUploadInput id="collection-image-input" name="collection image" :fallback="icons.books" v-model="image"
                        :maxFileSizeInBytes="mebiBytes(1)"/>
      <p v-if="errorFields.image" class="error-message">{{ errorFields.image }}</p>
    </div>
    <div class="main-inputs">
      <div class="form-row">
        <label for="collection-title">Title</label>
        <input id="collection-title" type="text" maxlength="255" placeholder="Collection Title" v-model="title"
               required>
        <p v-if="errorFields.title" class="error-message">{{ errorFields.title }}</p>
      </div>
      <div class="form-row">
        <label for="collection-description">Description</label>
        <textarea id="collection-description" maxlength="500" placeholder="Collection Description"
                  v-model="description"></textarea>
        <p v-if="errorFields.description" class="error-message">{{ errorFields.description }}</p>
      </div>
      <div class="form-row">
        <label for="collection-is-public-checkbox" class="checkbox-label">
          <input type="checkbox" id="collection-is-public-checkbox" v-model="isPublic" checked>
          Public
        </label>
      </div>
      <SubmitButton id="save-button"
                    type="submit"
                    class="primary-filled-button big-button capsule-button"
                    :isSubmitting="isSubmitting">
        {{ submittingMessage ?? "Save" }}
      </SubmitButton>
    </div>
  </form>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import {icons} from "@/icons.js";
import {useStore} from "@/stores/backend/rootStore.js";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import {mebiBytes} from "dzelda-common";

export default defineComponent({
  name: "CreateCollectionForm",
  components: {ImageUploadInput, SubmitButton},
  emits: ["onCollectionCreated"],
  props: {
    languageCode: {type: String, required: true},
  },
  data() {
    return {
      title: "",
      description: "", image: undefined as Blob | undefined,
      errorFields: {title: "", description: "", image: ""},
      isSubmitting: false,
      isPublic: true,
      submittingMessage: undefined as string | undefined,
    };
  },
  watch: {
    isSubmitting() {
      if (!this.isSubmitting)
        this.submittingMessage = undefined;
    }
  },
  methods: {
    async onSubmit() {
      this.isSubmitting = true;
      this.errorFields = {title: "", description: "", image: ""};
      let imageUrl;
      if (this.image) {
        this.submittingMessage = "Uploading image";
        imageUrl = await this.store.uploadFile({
          fileField: "collectionImage",
          fileExtension: ".jpg",
          file: new File([this.image], "image.jpg"),
        });
        if (!imageUrl) {
          this.isSubmitting = false;
          return;
        }
      } else
        imageUrl = this.image;
      this.submittingMessage = "Creating Collection";
      const response = await this.collectionStore.createCollection({
        languageCode: this.languageCode,
        title: this.title,
        description: this.description,
        isPublic: this.isPublic,
        image: imageUrl,
      });
      this.isSubmitting = false;
      if (response.ok) {
        const newCollection = response.data;
        this.$emit("onCollectionCreated", newCollection);
      } else {
        if ("fields" in response.error)
          this.errorFields = response.error.fields as { title: string, description: string, image: string };
      }
    },

  },
  setup() {
    return {
      icons,
      mebiBytes,
      store: useStore(),
      collectionStore: useCollectionStore(),
    };
  }
});
</script>

<style scoped>
.create-collection-form {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
}

.main-inputs {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}


.create-collection-form label {
  font-size: 1.25rem;
}

#save-button {
  align-self: flex-start;
}

#collection-description {
  resize: none;
  height: 15vh;
}

.image-section {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

@media screen and (max-width: 750px) {
  .create-collection-form {
    flex-direction: column;
  }
}
</style>
