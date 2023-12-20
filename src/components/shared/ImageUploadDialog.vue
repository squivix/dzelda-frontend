<template>
  <BaseDialog class="base-dialog" :is-open="isShown" @onDismissed="onDismissed" @onClosingTransitionEnd="clearData">
    <div v-if="!imageFile" class="upload-div">
      <BaseDropZoneFileInput :id="id"
                             :fileTitle="fileTitle"
                             :acceptedFileExtensions="acceptedFileExtensions"
                             :maxFileSizeInBytes="maxFileSizeInBytes"
                             @onChange="setImageFile">
      </BaseDropZoneFileInput>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </div>
    <div class="cropper-div" v-else>
      <Cropper class="cropper"
               backgroundClass="cropper-background"
               ref="cropper"
               :src="imageUrl"
               :stencilComponent="circular?$options.components!.CircleStencil:$options.components!.RectangleStencil"
               :stencil-props="{aspectRatio: 1}"
               @error="onCropperError"
      />
      <div class="bottom-div">
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        <div class="buttons-div">
          <button class="primary-hollow-button square-button" type="button" @click="closeDialog">Cancel</button>
          <SubmitButton :is-submitting="isSubmitting" class="primary-filled-button square-button" type="button"
                        @click="submitImage">Submit
          </SubmitButton>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import {CircleStencil, Cropper, RectangleStencil} from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import BaseDropZoneFileInput from "@/components/ui/BaseDropZoneFileInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import prettyBytes from "pretty-bytes";
import path from "path";

export default defineComponent({
  name: "ImageUploadDialog",
  components: {SubmitButton, BaseDialog, BaseDropZoneFileInput, Cropper, RectangleStencil, CircleStencil},
  emits: ["onClosed", "onSubmit"],
  props: {
    isShown: {type: Boolean},
    id: {type: String, required: true},
    fileTitle: {type: String},
    maxFileSizeInBytes: {type: Number},
    acceptedFileExtensions: {type: Array as PropType<string[]>, default: [".jpeg", ".jpg", ".png"]},
    circular: {type: Boolean, default: false},
  },
  data() {
    return {
      imageFile: undefined as File | undefined,
      isSubmitting: false,
      errorMessage: "",
    };
  },
  computed: {
    imageUrl() {
      if (this.imageFile)
        return URL.createObjectURL(this.imageFile);
      return undefined;
    }
  },
  methods: {
    setImageFile(file: File) {
      if (!this.acceptedFileExtensions.includes(path.extname(file.name))) {
        this.errorMessage = `File type not accepted`;
        return;
      }
      this.imageFile = file;
      this.errorMessage = "";
    },
    clearData() {
      this.imageFile = undefined;
      this.isSubmitting = false;
      this.errorMessage = "";
    },
    onCropperError() {
      this.clearData();
      this.errorMessage = `Error reading image file`;
    },
    onDismissed() {
      if (!this.imageFile)
        this.closeDialog();
    },
    closeDialog() {
      this.$emit("onClosed");
    },
    async submitImage() {
      this.isSubmitting = true;
      await this.$nextTick();
      const cropper = this.$refs.cropper as InstanceType<typeof Cropper>;
      const {canvas} = cropper.getResult();
      canvas!.toBlob((blob) => {
        if (!blob || blob.size > (this.maxFileSizeInBytes ?? Infinity)) {
          this.errorMessage = !blob
              ? "Failed to crop image"
              : `Image too big (${prettyBytes(blob.size)}), must be no more than ${prettyBytes(this.maxFileSizeInBytes!)}`;
          this.isSubmitting = false;
          return;
        }
        this.$emit("onSubmit", blob);
      }, "image/jpeg");
    }
  }
});
</script>

<style scoped>

.base-dialog > :deep(div) {
  padding: 0;
}

.upload-div {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.cropper-div {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  overflow: hidden;
}

.cropper {
  width: 600px;
  height: 50vh;
}

.bottom-div {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  margin: 0 1rem;
}

.buttons-div {
  display: flex;
  justify-content: space-between;
  column-gap: 2rem;
  margin-bottom: 1rem;
}

.buttons-div button {
  padding: 0.5rem 1rem;
  flex-grow: 1;
}

:deep(.cropper-background) {
  background-color: white;
}

/*TODO decide if you wanna allow transparency in images -> support png*/
/*:deep(.cropper-background) {*/
/*background-image: url('/src/assets/images/checkered.svg');*/
/*background-size: 20px 20px;*/
/*}*/
</style>
