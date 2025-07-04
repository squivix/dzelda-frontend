<template>
  <div class="drop-zone unselectable"
       :class="{'highlighted':isHighlighted}"
       @drop.prevent.stop="dropFile"
       @dragover.prevent
       @dragenter="onDragEnter"
       @dragleave="onDragLeave">
    <input :id="id" type="file" :accept="acceptedFileExtensions?.join(', ')??''" v-bind="$attrs" @change="onChange">

    <label class="center-div" :for="id">
      <h5>Drop {{ fileTitle }} here or</h5>
      <button>
        <inline-svg :src="icons.upload"/>
        {{ buttonText }}
      </button>
      <div class="bottom-text">
        <p v-if="acceptedFileExtensions">Accepted file formats: {{ acceptedFileExtensions.join(",") }}</p>
        <p v-if="maximumFileSize">Maximum file size: {{ maximumFileSize }}</p>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import type {PropType} from "vue";
import {defineComponent} from "vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import prettyBytes from "pretty-bytes";


export default defineComponent({
  name: "BaseDropZoneFileInput",
  components: {InlineSvg},
  props: {
    id: {type: String, required: true},
    buttonText: {type: String, default: "Upload"},
    fileTitle: {type: String, default: "your file"},
    acceptedFileExtensions: {type: Array as PropType<string[]>},
    maxFileSizeInBytes: {type: Number}
  },
  data() {
    return {
      isHighlighted: false,
      innerDragEnterCount: 0
    };
  },
  computed: {
    maximumFileSize() {
      if (this.maxFileSizeInBytes)
        return prettyBytes(this.maxFileSizeInBytes);
    }
  },
  methods: {
    onChange(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file)
        this.$emit("onChange", file);
    },
    onDragEnter() {
      this.innerDragEnterCount++;
      this.isHighlighted = true;
    },
    onDragLeave() {
      this.innerDragEnterCount--;
      if (this.innerDragEnterCount == 0)
        this.isHighlighted = false;
    },
    dropFile(event: DragEvent) {
      this.isHighlighted = false;
      const file = event.dataTransfer?.files[0];
      if (file)
        this.$emit("onChange", file);
    }
  },
  setup() {
    return {icons, prettyBytes};
  }
});
</script>

<style scoped>
.drop-zone {
  border: 3px dashed var(--secondary-color);
  color: var(--secondary-color);
  width: 50vw;
  height: 300px;
  max-width: 600px;
  min-width: 250px;
  display: grid;
  place-items: center;
}

.drop-zone.highlighted {
  background-color: var(--secondary-faint-color);
}

.center-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.5rem;
}

input[type=file] {
  display: none;
}

label {
  cursor: pointer;
}
.bottom-text{
  text-align: center;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}
h5 {
  font-size: 1.5rem;
}

button {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  background-color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
  color: var(--on-secondary-color);
  font-size: 1rem;
  border-radius: 30px;
  font-weight: bold;
  padding: 0.75rem 1rem;
  pointer-events: none;
}

button svg {
  width: 20px;
  height: 20px;
}

</style>
