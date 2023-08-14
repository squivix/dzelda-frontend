<template>
  <search-filter @onSearchSubmitted="onSearchSubmitted"
                 @onFiltersApplied="onFiltersApplied">
    <template v-slot:filters>

    </template>
  </search-filter>
</template>

<script lang="ts">
import SearchFilter from "@/components/ui/SearchFilter.vue";

export default {
  name: "LibrarySearchFilter",
  components: {SearchFilter},
  emits: ["onSearchSubmitted", "onFiltersApplied"],
  methods: {
    onSearchSubmitted() {
      this.$emit("onSearchSubmitted");
    }, onFiltersApplied() {
      this.$emit("onFiltersApplied");
    },
  }

};
</script>

<style scoped>

</style>