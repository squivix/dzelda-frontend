<template>
  <div class="tile">
    <inline-svg v-if="iconSrc" :src="iconSrc"/>
    <p>{{ baseFileName }}</p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {icons} from "@/icons.js";
import path from "path";
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "FileTile",
  components: {InlineSvg},
  props: {
    fileName: {type: String, required: true,},
  },
  computed: {
    baseFileName() {
      return path.parse(this.fileName).name;
    },
    fileExtension() {
      return path.parse(this.fileName).ext;
    },
    iconSrc() {
      if (this.fileExtension == ".pdf")
        return icons.pdfFile;
      else if (this.fileExtension == ".epub")
        return icons.epubFile;
      else
        return "";
    }
  },
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
.tile {
  display: flex;
  column-gap: 0.25rem;
  align-items: center;
}

.tile svg {
  width: 40px;
  height: 40px;
  color: var(--primary-color);
}
</style>
