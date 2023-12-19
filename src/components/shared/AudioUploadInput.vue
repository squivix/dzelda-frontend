<template>
  <div class="input-wrapper">
    <div class="buttons-div">
      <button class="upload-button inv-button icon-button" @click="isUploadDialogShown=true" type="button">
        <template v-if="src">
          <inline-svg :src="icons.pen"/>
          Edit
        </template>
        <template v-else>
          <inline-svg :src="icons.upload"/>
          Upload
        </template>

      </button>
      <button class="clear-button inv-button icon-button" v-if="!!src" @click="clearAudio" type="button">
        <inline-svg :src="icons.crossRound"/>
        Clear
      </button>
    </div>
    <audio controls v-if="src" ref="audio" :src="src" @error="onAudioError" @canplay="closeDialog">Your browser does
      not support the audio element.
    </audio>

    <FileUploadDialog :id="id"
                      :maxFileSizeInBytes="maxFileSizeInBytes"
                      :externalErrorMessage="errorMessage"
                      :acceptedFileExtensions="['.mp3', '.m4a']"
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
      errorMessage: "",
    };
  },
  watch: {
    isUploadDialogShown() {
      if (!this.isUploadDialogShown)
        this.errorMessage = "";
    }
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
    },
    onAudioError() {
      if (this.modelValue) {
        this.errorMessage = "Failed to read audio file";
        this.$emit("update:modelValue", undefined);
      }
    },
    closeDialog() {
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
.input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

audio {
  max-width: 200px;
}

.icon-button svg {
  width: 20px;
  height: 20px;
}

.buttons-div {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.clear-button {
}
</style>
