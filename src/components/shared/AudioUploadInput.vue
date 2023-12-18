<template>
  <div>
    <audio v-show="src" controls ref="audio" :src="src">
      Your browser does not support the audio element.
    </audio>
    <button class="inv-button" @click="isUploadDialogShown=true" type="button">
      <inline-svg :src="icons.upload"/>
      Upload Audio
    </button>
    <FileUploadDialog :id="id"
                      :maxFileSizeInBytes="maxFileSizeInBytes"
                      :acceptedFileExtensions="['.mp3']"
                      :fileTitle="fileTitle"
                      :isShown="isUploadDialogShown"
                      @onSubmit="setAudio"
                      @onClosed="isUploadDialogShown=false"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import FileUploadDialog from "@/components/shared/FileUploadDialog.vue";
import {useStore} from "@/stores/backend/rootStore.js";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "AudioUploadInput",
  components: {FileUploadDialog, InlineSvg},
  props: {
    id: {type: String, required: true},
    modelValue: {type: [Object, String] as PropType<File | "">},
    fileTitle: {type: String},
    oldAudioPath: {type: String, default: ""},
    maxFileSizeInBytes: {type: Number, required: true}
  },
  data() {
    return {
      isUploadDialogShown: false,
    };
  },
  computed: {
    src() {
      //if no new audio use old audio
      if (this.modelValue === undefined)
        return this.oldAudioPath ? `${this.store.resourceUrl}/${this.oldAudioPath}` : "";
      //if old audio was cleared use nothing
      else if (this.modelValue === "")
        return "";
      //if new audio was uploaded use new audio
      else
        return URL.createObjectURL(this.modelValue);
    },
  },
  methods: {
    setAudio(audioBlob: Blob) {
      this.$emit("update:modelValue", audioBlob);
      this.isUploadDialogShown = false;
    },
    clearAudio() {
      //if an audio has been uploaded but not submitted, cancel upload, and leave last audio unchanged
      if (this.modelValue)
        this.$emit("update:modelValue", undefined);
      //if no audio has been uploaded clear old audio
      else
        this.$emit("update:modelValue", "");
    },
  },
  setup() {
    return {store: useStore(), icons};
  }
});
</script>

<style scoped>

</style>
