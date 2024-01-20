<template>
  <div class="page-indicators">
    <button v-for="i in pageCount" class="inv-button" @click="$emit('onPageIndicatorClicked', i)">
      <div :class="{indicator:true, 'current':i==currentPage}"></div>
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "PageIndicator",
  props: {currentPage: {type: Number, required: true}, pageCount: {type: Number, required: true}}
});
</script>

<style scoped>
.page-indicators {
  display: flex;
}

button {
  padding: 5px;
}

.indicator {
  width: 12px;
  height: 12px;
  background-color: lightgray;
  border-radius: 50%;
}

.indicator:hover {
  cursor: pointer;
}

.indicator.current {
  background-color: var(--secondary-color);
}
</style>
