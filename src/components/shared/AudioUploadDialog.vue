<template>
  <BaseDialog :is-open="isShown" @onDismissed="$emit('onClosed')" @onClosingTransitionEnd="clearData">
    <BaseDropZoneFileInput class="drop-zone"
                           :id="id"
                           :fileTitle="fileTitle"
                           :acceptedFileExtensions="acceptedFileExtensions"
                           :maxFileSizeInBytes="maxFileSizeInBytes"
                           @onChange="setAudioFile">
    </BaseDropZoneFileInput>
    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    <audio v-if="audioFile" :src="src" @error="onAudioError" @canplay="submitAudioFile"></audio>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import BaseDropZoneFileInput from "@/components/ui/BaseDropZoneFileInput.vue";
import path from "path";
import prettyBytes from "pretty-bytes";

export default defineComponent({
  name: "AudioUploadDialog",
  components: {BaseDropZoneFileInput, BaseDialog},
  emits: ["onSubmit", "onClosed"],
  props: {
    id: {type: String, required: true},
    isShown: {type: Boolean},
    fileTitle: {type: String},
    acceptedFileExtensions: {type: Array as PropType<string[]>, default: [".mp3"]},
    maxFileSizeInBytes: {type: Number},
  },
  data() {
    return {
      audioFile: undefined as File | undefined,
      errorMessage: "",
    };
  },
  computed: {
    src() {
      return this.audioFile !== undefined ? URL.createObjectURL(this.audioFile) : undefined;
    }
  },
  methods: {
    setAudioFile(file: File) {
      if (this.acceptedFileExtensions && !this.acceptedFileExtensions.includes(path.extname(file.name))) {
        this.errorMessage = `File type not accepted`;
        return;
      }
      if (file.size > (this.maxFileSizeInBytes ?? Infinity)) {
        this.errorMessage = `File too big (${prettyBytes(file.size)}), must be no more than ${prettyBytes(this.maxFileSizeInBytes!)}`;
        return;
      }
      this.audioFile = file;
      this.errorMessage = "";
    },
    submitAudioFile() {
      if (this.audioFile)
        this.$emit("onSubmit", this.audioFile);
    },
    onAudioError() {
      if (this.audioFile !== undefined) {
        this.errorMessage = "Failed to read audio file";
        this.audioFile = undefined;
      }
    },
    clearData() {
      this.audioFile = undefined;
      this.errorMessage = "";
    }
  }
});
</script>

<style scoped>

.drop-zone {
  margin-bottom: 1rem;
}
</style>
