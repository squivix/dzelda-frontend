<template>
  <div class="drop-zone unselectable">
    <input :id="id" type="file" v-bind="$attrs" @change="onChange">

    <label class="center-div" :for="id">
      <h5>Drop {{ name }} here or</h5>
      <button>
        <inline-svg :src="icons.upload"/>
        {{ buttonText }}
      </button>
      <p>Accepted file formats: {{ acceptedFileFormats }}</p>
      <p>Maximum file size: {{ prettyBytes(maxFileSizeInBytes) }}</p>
    </label>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import prettyBytes from "pretty-bytes";

export default defineComponent({
  name: "BaseDropZoneFileInput",
  components: {InlineSvg},

  props: {
    id: {type: String, default: "file-input"},
    buttonText: {type: String, default: "Upload"},
    name: {type: String, default: "your file"},
    acceptedFileFormats: {type: String},
    maxFileSizeInBytes: {type: Number, required: true}
  },
  methods: {
    onChange(event: Event) {
      this.$emit("onChange", (event.target as HTMLInputElement).files![0]);
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
  color: var(--secondary-color-dark);
  width: 50vw;
  height: 300px;
  max-width: 600px;
  min-width: 300px;
  display: grid;
  place-items: center;
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