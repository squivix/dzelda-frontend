<template>
  <div class="file-inputs-div">
    <button v-if="enabled && !!src" class="inv-button clear-image-button"
            :style="{'margin-bottom': !circular?'0.5rem':'0'}"
            @click="clearImage" type="button">
      <inline-svg :src="icons.crossRound"/>
    </button>
    <button class="image-wrapper inv-button" type="button" :disabled="!enabled" @click="isUploadDialogShown=true">
      <BaseImage class="base-image"
                 :image-url="src"
                 :fall-back-url="fallback"
                 :circular="circular"/>
      <div :class="{'image-overlay':true, 'circular':circular, 'hidden':!enabled}">
        <div>
          <inline-svg :src="icons.pen"/>
          Edit
        </div>
      </div>
    </button>
    <ImageUploadDialog :id="id"
                       :maxFileSizeInBytes="maxFileSizeInBytes"
                       :fileTitle="fileTitle"
                       :isShown="isUploadDialogShown"
                       :circular="circular"
                       @onSubmit="setImage"
                       @onClosed="isUploadDialogShown=false"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import {useStore} from "@/stores/backend/rootStore.js";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import ImageUploadDialog from "@/components/shared/ImageUploadDialog.vue";

export default defineComponent({
  name: "ImageUploadInput",
  components: {BaseImage, InlineSvg, ImageUploadDialog},
  emits: ["update:modelValue"],
  computed: {
    src() {
      //if no new image use old image
      if (this.modelValue === undefined)
        return this.oldImagePath ? `${this.store.resourceUrl}/${this.oldImagePath}` : "";
      //if old image was cleared use nothing
      else if (this.modelValue === "")
        return "";
      //if new image was uploaded use new image
      else
        return URL.createObjectURL(this.modelValue);
    },
  },
  props: {
    id: {type: String, required: true},
    modelValue: {type: [Object, String] as PropType<Blob | "">},
    fileTitle: {type: String},
    oldImagePath: {type: String, default: ""},
    fallback: {type: String, required: false},
    enabled: {type: Boolean, required: false, default: true},
    circular: {type: Boolean, required: false, default: false},
    maxFileSizeInBytes: {type: Number, required: true}
  },
  data() {
    return {
      isUploadDialogShown: false,
    };
  },
  methods: {
    setImage(imageBlob: Blob) {
      this.$emit("update:modelValue", imageBlob);
      this.isUploadDialogShown = false;
    },
    clearImage() {
      //if an image has been uploaded but not submitted, cancel upload, and leave last image unchanged
      if (this.modelValue)
        this.$emit("update:modelValue", undefined);
      //if no image has been uploaded clear old image
      else
        this.$emit("update:modelValue", "");
    },
  },
  setup() {
    return {icons, store: useStore()};
  }
});
</script>

<style scoped>
.image-wrapper {
  position: relative;
  cursor: default;
}

.image-wrapper:not([disabled]) {
  cursor: pointer;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  color: #FFF;
}

.image-wrapper:hover .image-overlay {
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 30%);
}

.image-overlay div {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
}

.image-overlay div svg {
  width: 25px;
  height: 25px;
}

input[type="file"] {
  display: none;
}

.clear-image-button {
  color: red;
}

.clear-image-button svg {
  width: 20px;
  height: 20px;
}

.circular {
  border-radius: 50%;
}

.hidden {
  display: none !important;
}
</style>
