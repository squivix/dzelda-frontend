<template>
  <form @submit.prevent="onSearchSubmitted" class="search-form">
    <input type="text" class="search-input" placeholder="Search" v-model.trim="searchQuery">
    <button class="search-button icon-wrapper">
      <inline-svg :src="icons.search"/>
    </button>
  </form>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "SearchBar",
  emits: ["onSearchSubmitted"],
  components: {InlineSvg},
  props: {initialSearchQuery: {type: String, required: false, default: ""}},
  data() {
    return {
      searchQuery: this.initialSearchQuery,
    };
  },
  methods: {
    onSearchSubmitted() {
      this.$router.push({query: {...this.$route.query, searchQuery: this.searchQuery || undefined, page: undefined}});
      this.$emit("onSearchSubmitted", this.searchQuery);
    },
  },
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
.search-form {
  display: flex;
  flex-direction: row;
  column-gap: 0.2vw;
  align-items: center;
}

.search-button {
  aspect-ratio: 1 / 1;
  width: 35px;
  height: 35px;
  border-radius: 5px;
  background-color: var(--primary-color);
  border: 1px solid var(--on-primary-color);
}

.search-button svg {
  fill: var(--on-primary-color);
}

</style>
