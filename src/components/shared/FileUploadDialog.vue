<template>
  <BaseDialog class="base-dialog" :is-open="isShown" @onDismissed="$emit('onClosed')">
    <BaseDropZoneFileInput :id="id"
                           :fileTitle="fileTitle"
                           :acceptedFileExtensions="acceptedFileExtensions"
                           :maxFileSizeInBytes="maxFileSizeInBytes"
                           @onChange="setFile">
    </BaseDropZoneFileInput>
    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseDropZoneFileInput from "@/components/ui/BaseDropZoneFileInput.vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import prettyBytes from "pretty-bytes";

export default defineComponent({
  name: "FileUploadDialog",
  components: {BaseDialog, BaseDropZoneFileInput},
  props: {
    id: {type: String, required: true},
    isShown: {type: Boolean},
    fileTitle: {type: String},
    circular: {type: Boolean, default: false},
    acceptedFileExtensions: {type: Array as PropType<string[]>},
    maxFileSizeInBytes: {type: Number}
  },
  data() {
    return {
      errorMessage: "",
    };
  },
  watch: {
    imageFile() {
      this.errorMessage = "";
    }
  },
  methods: {
    setFile(file: File) {
      if (this.acceptedMimeTypes && !this.acceptedMimeTypes.includes(file.type)) {
        this.errorMessage = `File type not accepted`;
        return;
      }
      this.submitFile(file);
    },
    async submitFile(file: File) {
      if (file.size > (this.maxFileSizeInBytes ?? Infinity)) {
        this.errorMessage = `File too big (${prettyBytes(file.size)}), must be no more than ${prettyBytes(this.maxFileSizeInBytes!)}`;
        return;
      }
      this.$emit("onSubmit", file);
    }
  }
});
</script>

<style scoped>

</style>
