<template>
  <form @submit.prevent="onSubmit">
    <template v-if="!file||isChangingFile">
      <BaseDropZoneFileInput class="drop-zone"
                             id="imported-file-input"
                             :acceptedFileExtensions="['.pdf','.epub']"
                             :maxFileSizeInBytes="maxFileSizeInBytes"
                             @onChange="onFileUploaded">
      </BaseDropZoneFileInput>
    </template>
    <LoadingScreen v-else-if="isLoadingFile"/>
    <template v-else>
      <div class="uploaded-file-div">
        <FileTile :fileName="file.name"/>
        <button class="inv-button icon-text-wrapper change-button unselectable" type="button" @click="isChangingFile=true">
          <inline-svg :src="icons.pen"/>
          Change
        </button>
      </div>
      <div>
        <div class="collection-section">
          <div class="side-inputs">
            <div class="image-section">
              <label>Image</label>

              <ImageUploadInput id="collection-image-input" name="collection image" :fallback="icons.books" v-model="image"
                                :maxFileSizeInBytes="mebiBytes(1)"/>
              <p v-if="errorFields.image" class="error-message">{{ errorFields.image }}</p>
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
              <label for="collection-title">Title</label>
              <input id="collection-title" type="text" maxlength="255" placeholder="Collection Title" v-model="title" required>
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
            <div class="form-row" v-if="errorMessage">
              <p class="error-message">{{ errorMessage }}</p>
            </div>
            <div class="form-row" v-if="file&&file?.size>=mebiBytes(1)&&isSubmitting">
              <p class="warning-message">
                This may take a while, please be patient...
              </p>
            </div>


            <SubmitButton id="save-button"
                          type="submit"
                          class="primary-filled-button big-button capsule-button"
                          :submittingText="submittingMessage"
                          :isSubmitting="isSubmitting">
              Save
            </SubmitButton>
          </div>
        </div>
      </div>
    </template>
  </form>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import path from "path";
import {extractFileContent, extractFileTitle} from "@/components/page/import-file/FileImporter.js";
import prettyBytes from "pretty-bytes";
import BaseDropZoneFileInput from "@/components/ui/BaseDropZoneFileInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import FileTile from "@/components/ui/FileTile.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import {splitTextWithDelimiters, toSentenceCase} from "@/utils.js";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import {LanguageLevel, mebiBytes, megaBytes} from "dzelda-common";
import {useTextStore} from "@/stores/backend/textStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import {useStore} from "@/stores/backend/rootStore.js";

export default defineComponent({
  name: "ImportFilePage",
  components: {ImageUploadInput, LoadingScreen, InlineSvg, SubmitButton, BaseCard, BaseDropZoneFileInput, FileTile},
  props: {
    maxFileSizeInBytes: {type: Number, default: megaBytes(50)},
    pathParams: {type: Object as PropType<{ learningLanguage: string }>, required: true},
  },
  data() {
    return {
      file: undefined as File | undefined,
      errorMessage: "",
      title: "",
      description: "",
      level: LanguageLevel.ADVANCED_1,
      image: undefined as Blob | undefined,
      isPublic: true,
      errorFields: {title: "", description: "", image: ""},
      isSubmitting: false,
      submittingMessage: "",
      isChangingFile: false,
      isLoadingFile: false,
      selectedOutlineIds: new Set<string>(),
      texts: null as string[] | null
    };
  },
  computed: {},
  methods: {
    async onFileUploaded(file: File) {
      const extension = path.parse(file.name).ext?.toLowerCase();
      if (![".pdf", ".epub"].includes(extension)) {
        this.errorMessage = `File type not accepted`;
        return;
      }
      if (file.size > (this.maxFileSizeInBytes ?? Infinity)) {
        this.errorMessage = `File too big (${prettyBytes(file.size)}), must be no more than ${prettyBytes(this.maxFileSizeInBytes!)}`;
        return;
      }
      this.file = file;
      this.isChangingFile = false;
      this.texts = null;

      this.isLoadingFile = true;
      this.title = await extractFileTitle(file);
      this.isLoadingFile = false;
    },
    async onSubmit() {
      this.isSubmitting = true;
      if (!this.texts) {
        this.submittingMessage = "Extracting text...";
        const fullContent = await extractFileContent(this.file!);
        this.texts = splitTextWithDelimiters(fullContent, 5_000, 15_000, [".", "?", "!", "\n\n", "\n", " "]);
      }
      this.submittingMessage = "Creating collection...";

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
      const response = await this.collectionStore.createCollection({
        languageCode: this.pathParams.learningLanguage,
        title: this.title,
        description: this.description,
        isPublic: this.isPublic,
        image: imageUrl,
        texts: this.texts.map((textContent, i) => ({
          title: `Part ${i + 1}`,
          content: textContent,
          isPublic: this.isPublic,
          level: this.level
        }))
      });
      this.isSubmitting = false;
      if (response.ok) {
        this.messageBarStore.addTopBarMessage({text: "We'll let you know when the file finishes importing", type: MessageType.INFO});
        this.$router.push({name: "explore"});
      } else {
        this.errorMessage = response.error.message;
      }
    }

  },
  setup() {
    return {
      icons,
      mebiBytes,
      LanguageLevel,
      toSentenceCase,
      randomUUID: () => crypto.randomUUID(),
      store: useStore(),
      collectionStore: useCollectionStore(),
      textStore: useTextStore(),
      messageBarStore: useMessageBarStore()
    };
  }
});
</script>

<style scoped>
#collection-description {
  resize: none;
  height: 15vh;
}

.uploaded-file-div {
  display: flex;
  justify-content: space-between;
}

.uploaded-file-div > .change-button {
  text-decoration: underline;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.drop-zone {
  align-self: stretch;
  width: auto;
  height: 30vh;
  max-width: unset;
}

label {
  font-size: 1.25rem;
}

.collection-section {
  display: flex;
  column-gap: 1rem;
}

.collection-section > .main-inputs {
  flex: 3;
}

.image-section {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}
</style>
