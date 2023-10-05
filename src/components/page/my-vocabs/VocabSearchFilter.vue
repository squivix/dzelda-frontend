<template>
  <search-filter
      :initial-search-query="initialSearchQuery"
      @onFiltersApplied="onFiltersApplied"
  >
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
import constants from "@/constants";
import SearchFilter from "@/components/ui/SearchFilter.vue";
import {PropType} from "vue";
import {VocabLevelSchema} from "dzelda-types";

export default {
  name: "VocabSearchFilter",
  components: {SearchFilter},
  props: {
    initialLevels: {type: Array as PropType<VocabLevelSchema[]>, required: true},
    initialSearchQuery: {type: String, required: true}
  },
  data() {
    return {
      filters: {
        levels: this.initialLevels
      },
    };
  },
  methods: {
    onFiltersApplied() {
      this.$router.push({query: {...this.$route.query, level: this.filters.levels, page: undefined}})
    },
  },
  setup() {
    return {
      constants
    }
  }
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