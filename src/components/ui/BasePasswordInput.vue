<template>
  <div class="base-password-div">
    <input type="password"
           ref="password"
           :minlength="minLength"
           v-bind="$attrs"
           :value="modelValue"
           @input="onInput"
    />
    <button type="button" @click="toggleShowPassword" class="inv-button">
      <inline-svg :src="isShown?icons.hide:icons.show"/>
    </button>
  </div>
</template>
<script lang="ts">
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {InputType} from "zlib";

export default {
  name: "BasePasswordInput",
  components: {InlineSvg},
  inheritAttrs: false,
  props: {
    modelValue: String,
    minLength: {
      type: Number,
      required: false,
      default: 8
    }
  },
  data() {
    return {
      isShown: false,
    };
  },

  emits: ["update:modelValue"],
  methods: {
    toggleShowPassword() {
      const input = this.$refs.password as HTMLInputElement;
      if (input.type === "password") {
        input.type = "text";
      } else {
        input.type = "password";
      }
      this.isShown = !this.isShown;
    },
    onInput(event: Event) {
      this.$emit("update:modelValue", (event.target as HTMLInputElement).value);
    },
  },
  setup() {
    return {icons};
  }
};
</script>
<style scoped>
div {
  position: relative;
}

input {
  width: 100%;
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
}
</style>
