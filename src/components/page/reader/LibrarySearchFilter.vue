<template>
  <base-collapsable-div :is-shown="isShown" @on-transition-changed="()=>isTransitioning=!isTransitioning">
    <div>

    </div>
  </base-collapsable-div>
</template>

<script lang="ts">
import SearchFilter from "@/components/ui/SearchFilter.vue";
import BaseCollapsableDiv from "@/components/ui/BaseCollapsableDiv.vue";

export default {
  name: "LibrarySearchFilter",
  components: {BaseCollapsableDiv, SearchFilter},
  props: {
    searchQuery: {
      type: String,
      required: true
    }
  },
  data() {
    return {isShown: true, isTransitioning: false};
  },
  methods: {}
};
</script>

<style scoped>

</style>
