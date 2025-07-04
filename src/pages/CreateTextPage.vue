<template>
  <form class="create-text-form" @submit.prevent="addText">
    <div class="side-inputs">
      <div class="form-row">
        <label>Image</label>
        <ImageUploadInput id="text-image-input" fileTitle="text image" :fallback="icons.bookOpen"
                          v-model="image"
                          :maxFileSizeInBytes="mebiBytes(1)"/>
        <p v-if="errorFields.image" class="error-message">{{ errorFields.image }}</p>
      </div>
      <div class="form-row">
        <label>Audio</label>
        <AudioUploadInput id="text-audio-input" fileTitle="text audio" v-model="audio"
                          :maxFileSizeInBytes="mebiBytes(100)"/>
        <p v-if="errorFields.audio" class="error-message">{{ errorFields.audio }}</p>
      </div>
      <div>
        <div class="form-row">
          <label for="text-collection">Collection</label>
          <select required id="text-collection" v-model="selectedCollection">
            <option :value="null" selected>None</option>
            <option v-for="collection in editableCollections" :key="collection.id" :value="collection.id">
              {{ collection.title }}
            </option>
            <option value="new-collection">New Collection</option>
          </select>
          <p v-if="errorFields.collectionId" class="error-message">{{ errorFields.collectionId }}</p>
        </div>
        <div class="form-row">
          <label>Level</label>
          <select v-model="level">
            <option v-for="level in LanguageLevel" :value="level">{{ toSentenceCase(level) }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="main-inputs">
      <div class="form-row">
        <label for="text-title">Title</label>
        <input id="text-title" type="text" placeholder="Enter the title" v-model="title" required maxlength="124" :dir="title!=''?readingDirection:'ltr'">
        <p v-if="errorFields.title" class="error-message">{{ errorFields.title }}</p>
      </div>
      <div class="form-row">
        <label for="text-text">Text</label>
        <textarea placeholder="Enter the text" id="text-content" v-model="content" required :dir="content!=''?readingDirection:'ltr'"></textarea>
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
      <div class="form-row">
        <label for="text-is-public-checkbox" class="checkbox-label" :title="isCollectionSelected?'Depends on collection public/private status':''">
          <input type="checkbox" id="text-is-public-checkbox" v-model="isPublic" :disabled="isCollectionSelected">
          Public
        </label>
      </div>
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
    <h2>Create Collection</h2>
    <CreateCollectionForm :languageCode="pathParams.learningLanguage" @onCollectionCreated="onCollectionCreated"/>
  </BaseDialog>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import {useTextStore} from "@/stores/backend/textStore.js";
import {useStore} from "@/stores/backend/rootStore.js";
import type {CollectionSchema} from "dzelda-common";
import {LanguageLevel, mebiBytes} from "dzelda-common";
import {useUserStore} from "@/stores/backend/userStore.js";
import {icons} from "@/icons.js";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import type {PropType} from "vue";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import AudioUploadInput from "@/components/shared/AudioUploadInput.vue";
import path from "path";
import {toSentenceCase} from "@/utils";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import CreateCollectionForm from "@/components/shared/create-collection/CreateCollectionForm.vue";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default {
  name: "CreateTextPage",
  components: {
    ConfirmDialog,
    CreateCollectionForm, BaseDialog, AudioUploadInput, ImageUploadInput, SubmitButton, BaseCard
  },
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string }>, required: true},
    queryParams: {type: Object as PropType<{ collectionId?: number }>, required: true}
  },
  data() {
    return {
      editableCollections: null as CollectionSchema[] | null,
      selectedCollection: null as number | null,
      title: "",
      content: "",
      level: LanguageLevel.ADVANCED_1,
      isPublic: false,
      image: undefined as Blob | undefined,
      audio: undefined as File | undefined,
      isSubmitting: false,
      submittingMessage: undefined as string | undefined,
      errorFields: {title: "", content: "", image: "", audio: "", collectionId: ""},
      isCreateCollectionDialogShown: false,
    };
  },
  computed: {
    isCollectionSelected() {
      return this.selectedCollection != null
    },
    readingDirection() {
      return this.languageStore.currentLanguageDir;
    }
  },
  watch: {
    selectedCollection(newVal: string) {
      if (newVal === "new-collection")
        this.isCreateCollectionDialogShown = true;
      else if (newVal != null && this.editableCollections !== null) {
        this.isPublic = this.editableCollections.find((c) => c.id == this.selectedCollection)!.isPublic;
      }
    },
  },
  methods: {
    toSentenceCase,
    async fetchEditableCollections() {
      const response = await this.collectionStore.fetchCollections({
        languageCode: this.pathParams.learningLanguage,
        addedBy: "me",
        pageSize: 100,
      }, {secure: true});
      this.editableCollections = response.data;
    },
    async addText() {
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

      this.submittingMessage = "Creating text";
      const response = await this.textStore.createText({
        collectionId: this.selectedCollection,
        languageCode: this.pathParams.learningLanguage,
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
    },
  },
  async mounted() {
    await this.fetchEditableCollections();
    if (this.editableCollections!.some(collection => collection.id == this.queryParams.collectionId))
      this.selectedCollection = this.queryParams.collectionId!;
    this.$router.replace({query: {...this.queryParams, collectionId: undefined}});
  },
  setup() {
    return {
      icons,
      mebiBytes,
      toSentenceCase,
      LanguageLevel,
      store: useStore(),
      collectionStore: useCollectionStore(),
      textStore: useTextStore(),
      userStore: useUserStore(),
      languageStore: useLanguageStore(),
    };
  }
};


</script>

<style scoped>
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
  flex: 1;
}

.main-inputs {
  display: flex;
  flex-direction: column;
  flex: 3;
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
  .create-text-form {
    flex-direction: column;
  }

  .side-inputs {
    row-gap: 0.5rem;
  }
}
</style>
