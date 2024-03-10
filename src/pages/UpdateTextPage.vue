<template>
  <BaseCard title="Update Text" class="update-text-base-card main-page-base-card">
    <template v-slot:content>
      <LoadingScreen v-if="!text"/>
      <form class="update-text-form" @submit.prevent="updateText" v-else>
        <div class="side-inputs">
          <div class="form-row">
            <label>Image</label>
            <ImageUploadInput id="text-image-input" fileTitle="text image" :oldImageUrl="text.image" :fallback="icons.bookOpen"
                              v-model="image"
                              :maxFileSizeInBytes="500_000"/>
            <p v-if="errorFields.image" class="error-message">{{ errorFields.image }}</p>
          </div>
          <div class="form-row">
            <label>Audio</label>
            <AudioUploadInput id="text-audio-input" fileTitle="text audio" :oldAudioUrl="text.audio" v-model="audio"
                              :maxFileSizeInBytes="100_000_000"/>
            <p v-if="errorFields.audio" class="error-message">{{ errorFields.audio }}</p>
          </div>
          <div class="form-row">
            <label for="text-collection">Collection</label>
            <select required id="text-collection" v-model="selectedCollection">
              <option :value="null" selected>None</option>
              <option v-for="collection in editableCollections" :key="collection.id" :value="collection.id">{{ collection.title }}</option>
              <option value="new-collection">New Collection</option>
            </select>
            <p v-if="errorFields.collectionId" class="error-message">{{ errorFields.collectionId }}</p>
          </div>
          <div class="form-row">
            <label>Level</label>
            <select v-model="level">
              <option v-for="level in LANGUAGE_LEVELS" :value="level">{{ toSentenceCase(level) }}</option>
            </select>
          </div>
        </div>
        <div class="main-inputs">
          <div class="form-row">
            <label for="text-title">Title</label>
            <input id="text-title" type="text" placeholder="Enter the title" v-model="title" required maxlength="124">
            <p v-if="errorFields.title" class="error-message">{{ errorFields.title }}</p>
          </div>
          <div class="form-row">
            <label for="text-content">Text</label>
            <textarea placeholder="Enter the text" id="text-content" v-model="content" required></textarea>
            <p v-if="content.length>25_000" class="warning-message">
              <template v-if="isSubmitting">
                Please be patient...
              </template>
              <template v-else>
                Long texts are always slower, consider splitting into multiple texts
              </template>
            </p>
            <p v-if="errorFields.content" class="error-message">{{ errorFields.content }}</p>
          </div>
          <label for="is-public-checkbox" class="checkbox-label">
            <input type="checkbox" id="is-public-checkbox" v-model="isPublic" checked>
            Public
          </label>
          <div class="buttons-div">
            <SubmitButton id="save-and-open-button"
                          type="submit"
                          class="primary-filled-button big-button capsule-button"
                          :is-submitting="isSubmitting">
              {{ submittingMessage ?? "Save" }}
            </SubmitButton>
          </div>
        </div>
      </form>
      <BaseDialog :isOpen="isCreateCollectionDialogShown" @onDismissed="onCreateCollectionDialogDismissed">
        <h2>Add Collection</h2>
        <CreateCollectionForm @onCollectionCreated="onCollectionCreated"/>
      </BaseDialog>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import AudioUploadInput from "@/components/shared/AudioUploadInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import {CollectionSchema, LanguageLevelSchema, TextSchema} from "dzelda-common";
import {toSentenceCase} from "@/utils.js";
import path from "path";
import {icons} from "@/icons.js";
import {LANGUAGE_LEVELS} from "@/constants.js";
import {useStore} from "@/stores/backend/rootStore.js";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import {useTextStore} from "@/stores/backend/textStore.js";
import {useUserStore} from "@/stores/backend/userStore.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";

export default defineComponent({
  name: "UpdateTextPage",
  components: {LoadingScreen, BaseDialog, ImageUploadInput, BaseCard, SubmitButton, AudioUploadInput},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string, textId: number }>, required: true},
  },
  data() {
    return {
      text: null as TextSchema | null,
      editableCollections: null as CollectionSchema[] | null,
      selectedCollection: null as number | null,
      title: "",
      content: "",
      level: undefined as LanguageLevelSchema | undefined,
      isPublic: true,
      image: undefined as Blob | undefined,
      audio: undefined as File | undefined,
      isSubmitting: false,
      submittingMessage: undefined as string | undefined,
      errorFields: {title: "", content: "", image: "", audio: "", collectionId: ""},
      isCreateCollectionDialogShown: false,
    };
  },
  watch: {
    selectedCollection(newVal) {
      if (newVal === "new-collection")
        this.isCreateCollectionDialogShown = true;
    },
  },
  methods: {
    toSentenceCase,
    async fetchText() {
      this.text = await this.textStore.fetchText({textId: this.pathParams.textId});
      this.title = this.text.title;
      this.content = this.text.content;
      this.level = this.text.level;
      this.isPublic = this.text.isPublic;
      this.selectedCollection = this.text?.collection?.id ?? null;
    },
    async fetchEditableCollections() {
      const response = await this.collectionStore.fetchCollections({
        languageCode: this.pathParams.learningLanguage,
        addedBy: "me",
      }, {secure: true});
      this.editableCollections = response.data;
    },
    async updateText() {
      this.errorFields = {title: "", content: "", image: "", audio: "", collectionId: ""};
      this.isSubmitting = true;
      let imageUrl, audioUrl;
      if (this.image) {
        this.submittingMessage = "Uploading image";
        imageUrl = await this.store.uploadFile({
          fileField: "textImage",
          fileExtension: ".jpg",
          file: new File([this.image], "image.jpg"),
        });
        if (!imageUrl) {
          this.isSubmitting = false;
          return;
        }
      } else
        imageUrl = this.image;
      if (this.audio) {
        this.submittingMessage = "Uploading audio";
        audioUrl = await this.store.uploadFile({
          fileField: "textAudio",
          fileExtension: path.extname(this.audio.name),
          file: this.audio
        });
        if (!audioUrl) {
          this.isSubmitting = false;
          return;
        }
      } else
        audioUrl = this.audio;

      this.submittingMessage = "Updating text";
      const response = await this.textStore.updateText({textId: this.text!.id}, {
        collectionId: this.selectedCollection,
        title: this.title,
        content: this.content,
        level: this.level,
        isPublic: this.isPublic,
        image: imageUrl,
        audio: audioUrl
      });
      this.isSubmitting = false;
      if (response.ok) {
        const text = response.data;
        await this.$router.push({
          name: "text",
          params: {textId: text.id}
        });
      } else {
        this.submittingMessage = undefined;
        if ("fields" in response.error)
          this.errorFields = response.error.fields as {
            title: string, content: string,
            collectionId: string, image: string, audio: string,
          };
      }
    },
    onCollectionCreated(newCollection: CollectionSchema) {
      this.isCreateCollectionDialogShown = false;
      this.editableCollections!.push(newCollection);
      this.selectedCollection = newCollection.id;
    },
    onCreateCollectionDialogDismissed() {
      this.isCreateCollectionDialogShown = false;
      this.selectedCollection = null;
    }
  },
  async mounted() {
    await this.fetchText();
    await this.fetchEditableCollections();
  },
  setup() {
    return {
      icons,
      toSentenceCase,
      LANGUAGE_LEVELS,
      store: useStore(),
      collectionStore: useCollectionStore(),
      textStore: useTextStore(),
      userStore: useUserStore(),
    };
  }
});
</script>

<style scoped>
.update-text-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
}

.update-text-base-card:deep(header) {
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  margin-bottom: 1rem;
}

dialog {
  width: 70vw;
}

form {
  display: flex;
  column-gap: 1rem;
}

.side-inputs {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.main-inputs {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

label {
  font-size: 1.25rem;
}

input, select, textarea {
  font-size: 1rem;
}

select {
  width: 100%;
  text-overflow: ellipsis;
}

#text-content {
  resize: none;
  height: 35vh;
}

.buttons-div {
  display: flex;
  flex-direction: row;
  column-gap: 0.25rem;
}

@media screen and (max-width: 750px) {
  .update-text-form {
    flex-direction: column;
  }

  .side-inputs {
    row-gap: 0.5rem;
  }
}
</style>
