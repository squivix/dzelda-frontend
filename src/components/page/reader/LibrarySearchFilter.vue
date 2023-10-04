<template>
  <search-filter :initial-search-query="searchQuery">
    <template v-slot:filters>

    </template>
  </search-filter>
</template>

<script lang="ts">
import SearchFilter from "@/components/ui/SearchFilter.vue";

export default {
  name: "LibrarySearchFilter",
  components: {SearchFilter},
  props: {
    searchQuery: {
      type: String,
      required: true
    }
  },
  methods: {}
};
</script>

<style scoped>

</style>