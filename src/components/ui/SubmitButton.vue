<template>
  <button @click="$emit('onClick')" :disabled="!enabled||isSubmitting">
    <InlineSvg v-if="isSubmitting" :src="icons.loadingSpinnerOval"/>
    <span v-if="!isSubmitting || keepText" :class="wrapperClass">
      <slot>

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
    keepText: {type: Boolean, default: true},
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
