<template>
  <div class="file-inputs-div">
    <button v-if="enabled && !!src" class="clear-image-button" @click="clearImage" type="button">
      <inline-svg :src="icons.cross"/>
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
    <ImageUploadDialog :maxFileSizeInBytes="maxFileSizeInBytes"
                       :name="name"
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
import BaseDropZoneFileInput from "@/components/ui/BaseDropZoneFileInput.vue";

export default defineComponent({
  name: "BaseImageUploadInput",
  components: {BaseDropZoneFileInput, BaseImage, InlineSvg, ImageUploadDialog},
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
    modelValue: {type: [Object, String] as PropType<Blob | "">},
    name: {type: String},
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

.file-inputs-div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="file"] {
  display: none;
}

.clear-image-button {
  align-self: flex-end;
  display: grid;
  place-items: center;
  padding: 8px;
  border: none;
  background-color: red;
  fill: white;
  border-radius: 50%;
}

.clear-image-button svg {
  width: 10px;
  height: 10px;
}

.circular {
  border-radius: 50%;
}

.hidden {
  display: none !important;
}
</style>
