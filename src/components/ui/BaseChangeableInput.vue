<template>
  <div class="base-changeable-input-div">
    <input
        type="text"
        ref="inputRef"
        v-bind="$attrs"
        :value="modelValue"
        :disabled="!changed"
        @input="onInput"
    />
    <button type="button" @click="toggleChangeInput" class="inv-button" v-if="!changed">
      Change
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "BaseChangeableInput",
  data() {
    return {
      changed: false
    };
  },
  props: {
    modelValue: String,
    clearOnChange: {type: Boolean, required: false, default: true}
  },
  emits: ["update:modelValue", "onChange"],
  methods: {
    toggleChangeInput() {
      this.changed = true;
      this.$emit("onChange");
      if (this.clearOnChange)
        this.$emit("update:modelValue", "");
    },
    onInput(event: Event) {
      this.$emit("update:modelValue", (event.target as HTMLInputElement).value);
    },
  },
});
</script>

<style scoped>
div {
  position: relative;
}

input {
  width: 100%;
  outline: none;
  margin: 0;
  padding: 0;
}

button {
  position: absolute;
  top: 3px;
  right: 7px;
  bottom: 3px;
  z-index: 2;
  padding: 0;
  font-family: sans-serif;
  user-select: none;
  color: #0288d1;
}

button:hover {
  cursor: pointer;
}
</style>
