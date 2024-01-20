<template>
  <button @click="$emit('onClick')" class="inv-button" :disabled="disabled">
    <div>
      <inline-svg v-if="iconSrc" :src="iconSrc" width="20px"/>
      <span v-if="text">{{ text }}</span>
    </div>
  </button>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "PagePanelButton",
  components: {InlineSvg},
  props: {iconSrc: {type: String}, text: {type: String}, disabled: {type: Boolean, default: false}},
  methods: {},
});
</script>

<style scoped>
button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 0.8rem;
}

button:hover:not([disabled]) {
  cursor: pointer;
  background-color: var(--secondary-color-light);
}
button[disabled]
{
  cursor: auto;
}

svg {
  width: 20px;
  height: 20px;
  stroke: var(--secondary-color);
  color: var(--secondary-color);
}

button[disabled] svg {
  visibility: hidden;
}

button:hover:not([disabled]) svg {
  stroke-width: 0.4rem;
}

</style>
