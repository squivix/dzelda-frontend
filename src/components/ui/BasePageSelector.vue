<template>
  <ol>
    <li>
      <button class="page-button" :disabled="currentPage<=1" @click="onPageClicked(1)">
        <inline-svg :src="icons.doubleArrowLeft"/>
      </button>
    </li>
    <li>
      <button class="page-button" :disabled="currentPage<=1" @click="onPageClicked(currentPage-1)">
        <inline-svg :src="icons.arrowLeft"/>
      </button>
    </li>

    <li v-for="page in pages" :key="page">
      <button v-if="!Number.isNaN(Number(page))"
              :class="{'page-button':true, 'current-page-button':page===currentPage}"
              @click="onPageClicked(page)">
        {{ page }}
      </button>
      <template v-else>
        {{ page }}
      </template>
    </li>

    <li>
      <button class="page-button icon-wrapper" :disabled="currentPage>=pageCount" @click="onPageClicked(currentPage+1)">
        <inline-svg :src="icons.arrowRight"/>
      </button>
    </li>
    <li>
      <button class="page-button" :disabled="currentPage>=pageCount" @click="onPageClicked(pageCount)">
        <inline-svg :src="icons.doubleArrowRight"/>
      </button>
    </li>
  </ol>
</template>

<script lang="ts">
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default {
  name: "BasePageSelector",
  components: {InlineSvg},
  emits: ["onPageClicked"],
  props: {
    pageCount: {type: Number, required: true,},
    currentPage: {type: Number, required: true},
  },
  data() {
    return {
      pages: null as number[] | null,
      beforeCurrentCount: 2,
      afterCurrentCount: 2,
    };
  },
  watch: {
    pageCount() {
      this.updatePages(this.currentPage);
    }
  },
  methods: {
    onPageClicked(page: number) {
      this.$emit("onPageClicked", page);
      this.updatePages(page);
    },
    updatePages(currentPage: number) {
      let pages = [];
      let start = Math.max(1, currentPage - this.beforeCurrentCount);
      let end = Math.min(this.pageCount + 1, start + Math.min(this.beforeCurrentCount + this.afterCurrentCount + 1, this.pageCount));
      for (let i = start; i < end; i++)
        pages.push(i);
      this.pages = pages;
    }
  },
  mounted() {
    this.updatePages(this.currentPage);
  },
  setup() {
    return {icons};
  }

};
</script>

<style scoped>
ol {
  display: flex;
  flex-direction: row;
  column-gap: 1vw;
  align-self: center;

}

li {
  text-align: center;
  vertical-align: middle;
}

.page-button {
  background-color: transparent;
  color: black;
  border: 1px solid grey;
  border-radius: 3px;
  padding: 0.75rem 0;
  width: 8vw;
  max-width: 40px;
  height: 100%;
}

.page-button:hover {
  cursor: pointer;
}

.current-page-button {
  background-color: var(--primary-color);
  color: var(--on-primary-color);
}

.page-button svg {
  width: 10px;
  height: 10px;
}
</style>
