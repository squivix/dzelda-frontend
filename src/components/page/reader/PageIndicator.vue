<template>
  <div class="page-indicators">
    <button v-if="pages[0]!=1" class="start-end-button inv-button" @click="$emit('onPageIndicatorClicked', 1)">
      <inline-svg :src="icons.doubleArrowLeft"/>
    </button>
    <button v-for="p in pages" class="inv-button" @click="$emit('onPageIndicatorClicked', p)">
      <div :class="{indicator:true, 'current':p==currentPage, 'hide':pageCount<2}"></div>
    </button>
    <button v-if="pages[pages.length-1]!=pageCount" class="start-end-button inv-button" @click="$emit('onPageIndicatorClicked', pageCount)">
      <inline-svg :src="icons.doubleArrowRight"/>
    </button>
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
    indicatorLimit: {type: Number, default: 30},
  },
  data() {
    return {
      beforeCurrentCount: 10,
      afterCurrentCount: 10,
    };
  },
  computed: {
    pages() {
      let pages = [];
      let start = Math.max(1, this.currentPage - this.beforeCurrentCount);
      let end = Math.min(this.pageCount + 1, start + Math.min(this.beforeCurrentCount + this.afterCurrentCount + 1, this.pageCount));
      for (let i = start; i < end; i++)
        pages.push(i);
      return pages;
    },
  },
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
.page-indicators {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

button {
  padding: 4px;
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

.start-end-button {
  display: grid;
  place-items: center;
}

.start-end-button svg {
  width: 12px;
  height: 12px;
  color: var(--secondary-color);
}

.hide {
  visibility: hidden;
  pointer-events: none;
}
</style>
