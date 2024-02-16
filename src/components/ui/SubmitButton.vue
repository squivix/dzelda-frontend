<template>
  <button @click="$emit('onClick')" :disabled="!enabled||isSubmitting">
    <inline-svg v-if="isSubmitting" :src="icons.loadingSpinnerOval"/>
    <inline-svg v-else-if="iconSrc" :src="iconSrc"/>
    <span v-if="!isSubmitting || keepText" :class="wrapperClass">
      <template v-if="isSubmitting&&submittingText">{{ submittingText }}</template>
      <slot v-else>

      </slot>
    </span>
  </button>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "SubmitButton",
  emits: ["onClick"],
  components: {InlineSvg},
  props: {
    enabled: {type: Boolean, default: true},
    isSubmitting: {type: Boolean, default: false},
    iconSrc: {type: String, required: false},
    keepText: {type: Boolean, default: true},
    submittingText: {type: String, required: false},
    wrapperClass: {type: String, default: ""}
  },
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 0.75rem;
}


</style>
