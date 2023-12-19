<template>
  <BaseDialog :is-open="isShown" @onDismissed="$emit('onClosed')" @onClosingTransitionEnd="clearErrorMessage">
    <BaseDropZoneFileInput class="drop-zone"
                           :id="id"
                           :fileTitle="fileTitle"
                           :acceptedFileExtensions="acceptedFileExtensions"
                           :maxFileSizeInBytes="maxFileSizeInBytes"
                           @onChange="submitFile">
    </BaseDropZoneFileInput>
    <p class="error-message" v-if="externalErrorMessage||errorMessage">{{ externalErrorMessage || errorMessage }}</p>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseDropZoneFileInput from "@/components/ui/BaseDropZoneFileInput.vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import prettyBytes from "pretty-bytes";
import path from "path";

export default defineComponent({
  name: "FileUploadDialog",
  components: {BaseDialog, BaseDropZoneFileInput},
  props: {
    id: {type: String, required: true},
    isShown: {type: Boolean},
    fileTitle: {type: String},
    circular: {type: Boolean, default: false},
    acceptedFileExtensions: {type: Array as PropType<string[]>},
    maxFileSizeInBytes: {type: Number},
    externalErrorMessage: {type: String}
  },
  data() {
    return {
      errorMessage: "",
    };
  },
  methods: {
    async submitFile(file: File) {
      if (this.acceptedFileExtensions && !this.acceptedFileExtensions.includes(path.extname(file.name))) {
        this.errorMessage = `File type not accepted`;
        return;
      }
      if (file.size > (this.maxFileSizeInBytes ?? Infinity)) {
        this.errorMessage = `File too big (${prettyBytes(file.size)}), must be no more than ${prettyBytes(this.maxFileSizeInBytes!)}`;
        return;
      }
      this.errorMessage = "";
      this.$emit("onSubmit", file);
    },
    clearErrorMessage() {
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
