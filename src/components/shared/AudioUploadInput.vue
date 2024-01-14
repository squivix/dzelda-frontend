<template>
  <div class="input-wrapper">
    <div class="buttons-div">
      <button class="upload-button inv-button icon-text-button" @click="isUploadDialogShown=true" type="button">
        <template v-if="src">
          <inline-svg :src="icons.pen"/>
          Edit
        </template>
        <template v-else>
          <inline-svg :src="icons.upload"/>
          Upload
        </template>

      </button>
      <button class="clear-button inv-button icon-text-button" v-if="!!src" @click="clearAudio" type="button">
        <inline-svg :src="icons.crossRound"/>
        Clear
      </button>
    </div>
    <audio controls v-if="src" ref="audio" :src="src">Your browser does
      not support the audio element.
    </audio>

    <AudioUploadDialog :id="id"
                       :maxFileSizeInBytes="maxFileSizeInBytes"
                       :fileTitle="fileTitle"
                       :isShown="isUploadDialogShown"
                       @onSubmit="setAudio"
                       @onClosed="isUploadDialogShown=false"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useStore} from "@/stores/backend/rootStore.js";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import AudioUploadDialog from "@/components/shared/AudioUploadDialog.vue";

export default defineComponent({
  name: "AudioUploadInput",
  components: {AudioUploadDialog, InlineSvg},
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
        return this.oldAudioPath;
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
.input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

audio {
  max-width: 200px;
}

.icon-text-button svg {
  width: 20px;
  height: 20px;
}

.buttons-div {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.buttons-div button {
  color: var(--on-background-color);
}
</style>
