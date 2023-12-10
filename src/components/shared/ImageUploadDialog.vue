<template>
  <BaseDialog class="base-dialog" :is-open="isShown" @onDismissed="onDismissed" @onClosingTransitionEnd="clearData">
    <div v-if="!imageFile" class="upload-div">
      <BaseDropZoneFileInput accept="image/jpeg, image/png"
                             :name="name"
                             :acceptedFileFormats="acceptedFileFormats"
                             :maxFileSizeInBytes="maxFileSizeInBytes"
                             @onChange="setImageFile"/>
    </div>

    <div class="cropper-div" v-else>
      <Cropper class="cropper"
               ref="cropper"
               :src="imageUrl"
               :stencil-props="{aspectRatio: 1}"/>
      <div class="bottom-div">
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        <div class="buttons-div">
          <button class="primary-hollow-button square-button" type="reset" @click="closeDialog">Cancel</button>
          <SubmitButton :is-submitting="isSubmitting" class="primary-filled-button square-button" type="button"
                        @click="submitImage">Submit
          </SubmitButton>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import {Cropper} from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import BaseDropZoneFileInput from "@/components/ui/BaseDropZoneFileInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import prettyBytes from "pretty-bytes";

export default defineComponent({
  name: "ImageUploadDialog",
  components: {SubmitButton, BaseDialog, BaseDropZoneFileInput, Cropper},
  emits: ["onClosed", "onSubmit"],
  props: {
    isShown: {type: Boolean},
    name: {type: String},
    acceptedFileFormats: {type: String, default: "JPG, PNG"},
    maxFileSizeInBytes: {type: Number, required: true}
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
      this.imageFile = file;
    },
    clearData() {
      this.imageFile = undefined;
      this.isSubmitting = false;
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
        if (!blob || blob.size > this.maxFileSizeInBytes) {
          this.errorMessage = !blob
              ? "Failed to crop image"
              : `Image too big (${prettyBytes(blob.size)}), must be no more than ${prettyBytes(this.maxFileSizeInBytes)}`;
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
}

.cropper-div {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
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

</style>
