<template>
  <base-collapsable-div :is-shown="isShown">
    <base-filters-card>
      <form>
        <label>Level</label>

      </form>
    </base-filters-card>
  </base-collapsable-div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import BaseCollapsableDiv from "@/components/ui/BaseCollapsableDiv.vue";
import BaseFiltersCard from "@/components/ui/BaseFiltersCard.vue";

export default defineComponent({
  name: "CourseFilters",
  components: {BaseFiltersCard, BaseCollapsableDiv},
  props: {isShown: {type: Boolean, required: true}}
})
</script>

<style scoped>

</style>