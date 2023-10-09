<template>
  <form @submit.prevent="onSearchSubmitted" class="search-form">
    <input type="text" class="search-input" placeholder="Search" v-model.trim="searchQuery">
    <button class="search-button">
      <font-awesome-icon icon="magnifying-glass"/>
    </button>
  </form>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "SearchBar",
  emits: ["onSearchSubmitted"],
  props: {initialSearchQuery: {type: String, required: true}},
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
  }
})
</script>

<style scoped>
.search-form {
  display: flex;
  flex-direction: row;
  column-gap: 0.2vw;
}

.search-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--primary-color);
  border: 1px solid var(--on-primary-color);
}

.search-button svg {
  color: var(--on-primary-color);
}

</style>