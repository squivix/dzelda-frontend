<template>
  <div class="page-indicators">
    <button v-if="pageCount>indicatorLimit&&start>0" class="start-end-button inv-button" @click="$emit('onPageIndicatorClicked', 1)">
      <inline-svg :src="icons.doubleArrowLeft"/>
    </button>
    <button v-for="i in (end-start)" class="inv-button" @click="$emit('onPageIndicatorClicked', i+start)">
      <div :class="{indicator:true, 'current':(i+start)==currentPage}"></div>
    </button>
    <button v-if="pageCount>indicatorLimit&&end<pageCount" class="start-end-button inv-button" @click="$emit('onPageIndicatorClicked', pageCount)">
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
  computed: {
    start() {
      return Math.max(0, this.currentPage - Math.floor(this.indicatorLimit / 2));
    },
    end() {
      return Math.min(this.pageCount, this.currentPage + Math.floor(this.indicatorLimit / 2));
    }
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

.start-end-button svg {
  color: var(--secondary-color);
}

</style>
