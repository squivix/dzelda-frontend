<template>
  <div class="file-inputs-div">
    <input id="profile-picture-input" type="file" class="file-input" :disabled="!enabled"
           ref="fileInputRef" accept="image/png, image/jpeg" @change="onChange">
    <button v-if="enabled && (path||previewUrl)" class="clear-image-button" @click="clearImage" type="button">
      <inline-svg :src="icons.cross"/>
    </button>
    <label for="profile-picture-input">
      <base-image :image-url="src"
                  :fall-back-url="fallback"
                  :circular="circular"
      />
    </label>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import BaseImage from "@/components/ui/BaseImage.vue";
import {useStore} from "@/stores/backend/rootStore.js";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "BaseImageUploadInput",
  components: {BaseImage, InlineSvg},
  emits: ["update:modelValue"],
  computed: {
    src() {
      if (this.isPreview)
        return this.previewUrl;
      if (this.path == "")
        return ""
      return `${this.store.resourceUrl}/${this.path}`
    }
  },
  props: {
    path: {type: String, required: true},
    fallback: {type: String, required: false},
    modelValue: {type: [Object, String] as PropType<File | undefined | "">},
    enabled: {type: Boolean, required: false, default: true},
    circular: {type: Boolean, required: false, default: false},
  },
  data() {
    return {
      isPreview: false,
      previewUrl: "" as string | undefined,
    }
  },
  watch: {
    modelValue(imageFile: File | undefined | "") {
      this.previewUrl = imageFile ? URL.createObjectURL(imageFile) : "";
    },
    enabled(enabled) {
      if (!enabled)
        this.isPreview = false;
    },
  },
  methods: {
    onChange(event: Event) {
      const file = (event.target as HTMLInputElement).files![0];
      if (file) {
        this.$emit("update:modelValue", file)
        this.isPreview = true;
      }
    },
    clearImage() {
      //if an image has been uploaded but not submitted, cancel upload, and leave last image unchanged
      if (this.previewUrl) {
        this.$emit("update:modelValue", undefined)
        this.isPreview = false;
        (this.$refs.fileInputRef as HTMLInputElement).value = "";
      }
      //if no image has been uploaded clear last image
      else {
        this.$emit("update:modelValue", "")
        this.isPreview = true;
        this.previewUrl = undefined;
      }
    }
  },
  setup() {
    return {icons, store: useStore()}
  }
})
</script>

<style scoped>
.file-inputs-div {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

input[type="file"] {
  display: none;
}

input:not([disabled]) + label:hover {
  cursor: pointer;
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
</style>