<template>
  <search-filter
      @onFiltersApplied="onFiltersApplied">
    <template v-slot:filters>
      <label class="filter-label">Level</label>
      <fieldset class="filter-levels">
        <div class="checkbox-label">
          <input id="filter-level-1-checkbox"
                 type="checkbox"
                 :value="constants.SAVED_VOCAB_LEVELS.LEVEL_1"
                 v-model="filters.levels">
          <label for="filter-level-1-checkbox">Level 1</label>
        </div>
        <div class="checkbox-label">
          <input id="filter-level-2-checkbox"
                 type="checkbox"
                 :value="constants.SAVED_VOCAB_LEVELS.LEVEL_2"
                 v-model="filters.levels">
          <label for="filter-level-2-checkbox">Level 2</label>
        </div>
        <div class="checkbox-label">
          <input id="filter-level-3-checkbox"
                 type="checkbox"
                 :value="constants.SAVED_VOCAB_LEVELS.LEVEL_3"
                 v-model="filters.levels">
          <label for="filter-level-3-checkbox">Level 3</label>
        </div>
        <div class="checkbox-label">
          <input id="filter-level-4-checkbox"
                 type="checkbox"
                 :value="constants.SAVED_VOCAB_LEVELS.LEVEL_4"
                 v-model="filters.levels">
          <label for="filter-level-4-checkbox">Level 4</label>
        </div>

        <div class="checkbox-label">
          <input id="filter-level-learned-checkbox"
                 type="checkbox"
                 :value="constants.SAVED_VOCAB_LEVELS.LEARNED"
                 v-model="filters.levels">
          <label for="filter-level-learned-checkbox">Learned</label>
        </div>
      </fieldset>
    </template>
  </search-filter>

</template>

<script lang="ts">
import constants from "@/constants.ts";
import SearchFilter from "@/components/ui/SearchFilter.vue";

export default {
  name: "VocabSearchFilter",
  components: {SearchFilter},
  props: {}, data() {
    return {
      filters: {
        levels: this.$query.level
      },
      constants
    };
  },
  methods: {
    onFiltersApplied() {
      this.$query.level = this.filters.levels;
    },
  },
};
</script>

<style scoped>
.filter-label {
  font-weight: bold;
}

.filter-levels {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
}
</style>