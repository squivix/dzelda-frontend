<template>
  <search-filter @onSearchSubmitted="onSearchSubmitted"
                 @onFiltersApplied="onFiltersApplied"
                 :initial-search-query="initialSearchQuery">
    <template v-slot:filters>
      <label class="filter-label">Level</label>
      <fieldset class="filter-levels">
        <div class="checkbox-label">
          <input id="filter-level-1-checkbox"
                 type="checkbox"
                 :value="savedVocabLevels.LEVEL_1"
                 v-model="filters.levels">
          <label for="filter-level-1-checkbox">Level 1</label>
        </div>
        <div class="checkbox-label">
          <input id="filter-level-2-checkbox"
                 type="checkbox"
                 :value="savedVocabLevels.LEVEL_2"
                 v-model="filters.levels">
          <label for="filter-level-2-checkbox">Level 2</label>
        </div>
        <div class="checkbox-label">
          <input id="filter-level-3-checkbox"
                 type="checkbox"
                 :value="savedVocabLevels.LEVEL_3"
                 v-model="filters.levels">
          <label for="filter-level-3-checkbox">Level 3</label>
        </div>
        <div class="checkbox-label">
          <input id="filter-level-4-checkbox"
                 type="checkbox"
                 :value="savedVocabLevels.LEVEL_4"
                 v-model="filters.levels">
          <label for="filter-level-4-checkbox">Level 4</label>
        </div>

        <div class="checkbox-label">
          <input id="filter-level-learned-checkbox"
                 type="checkbox"
                 :value="savedVocabLevels.LEARNED"
                 v-model="filters.levels">
          <label for="filter-level-learned-checkbox">Learned</label>
        </div>
      </fieldset>
    </template>
  </search-filter>

</template>

<script>
import {SAVED_VOCAB_LEVELS} from "@/constants.js";
import SearchFilter from "@/components/general/ui/SearchFilter.vue";
import {updateQueryParams} from "@/components/page/reader/shared.js";

export default {
  name: "VocabSearchFilter",
  components: {SearchFilter},
  emits: ['onFiltersApplied', 'onSearchSubmitted'],
  props: {
    initialFilters: {
      type: Object,
      required: true
    }
  }, data() {
    return {
      filters: this.initialFilters,
    };
  },

  computed: {
    savedVocabLevels() {
      return SAVED_VOCAB_LEVELS;
    },
    initialSearchQuery() {
      return this.$route.query.searchQuery;
    },
  },
  methods: {
    onSearchSubmitted(searchQuery) {
      this.$emit('onSearchSubmitted', searchQuery);
    },
    onFiltersApplied() {
      this.updateQueryParams({level: this.filters.levels}).then(() => this.$emit('onFiltersApplied'));
    },
    updateQueryParams
  },
}
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