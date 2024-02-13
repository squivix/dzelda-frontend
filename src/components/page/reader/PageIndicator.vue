<template>
  <div class="bar">
    <div v-for="page in  pageCount" :class="{'section-indicator':true,  'current-section-indicator':page<=currentPage}" @click="$emit('onPageIndicatorClicked', page)"></div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "PageIndicator",
  components: {InlineSvg},
  props: {
    currentPage: {type: Number, required: true},
    pageCount: {type: Number, required: true},
  },
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
.bar {
  width: 80%;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-evenly;
  column-gap: 0.5rem;
}

.section-indicator {
  background-color: lightgray;
  height: 0.5rem;
  flex-grow: 1;
  cursor: pointer;
}

.current-section-indicator {
  background-color: var(--secondary-color);
}


</style>
