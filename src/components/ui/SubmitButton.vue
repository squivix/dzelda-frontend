<template>
  <button @click="$emit('onClick')" :disabled="isSubmitting">
    <InlineSvg v-if="isSubmitting" :src="icons.loadingSpinnerOval" class="hidden"/>
    <p>
    <slot v-if="!isSubmitting || keepText">

    </slot>
    </p>
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
    isSubmitting: {type: Boolean, default: false},
    keepText: {type: Boolean, default: true}
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
