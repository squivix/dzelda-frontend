<template>
  <base-collapsable-div :is-shown="isShown">
    <base-filters-card class="card">
      <h4>Filters</h4>
      <form @submit.prevent="applyFilters" @reset="clearFilters">
        <div class="filters-wrapper">
          <h5 class="filter-label">Level</h5>
          <fieldset class="filter-levels" v-if="!exclude.levels">
            <div class="checkbox-label">
              <input id="filter-beginner-1-checkbox"
                     type="checkbox"
                     :value="constants.LANGUAGE_LEVELS.BEGINNER_1"
                     v-model="levels">
              <label for="filter-beginner-1-checkbox">Beginner 1</label>
            </div>
            <div class="checkbox-label">
              <input id="filter-beginner-2-checkbox"
                     type="checkbox"
                     :value="constants.LANGUAGE_LEVELS.BEGINNER_2"
                     v-model="levels">
              <label for="filter-beginner-2-checkbox">Beginner 2</label>
            </div>
            <div class="checkbox-label">
              <input id="filter-intermediate-1-checkbox"
                     type="checkbox"
                     :value="constants.LANGUAGE_LEVELS.INTERMEDIATE_1"
                     v-model="levels">
              <label for="filter-intermediate-1-checkbox">Intermediate 1</label>
            </div>
            <div class="checkbox-label">
              <input id="filter-intermediate-2-checkbox"
                     type="checkbox"
                     :value="constants.LANGUAGE_LEVELS.INTERMEDIATE_2"
                     v-model="levels">
              <label for="filter-intermediate-2-checkbox">Intermediate 2</label>
            </div>
            <div class="checkbox-label">
              <input id="filter-advanced-1-checkbox"
                     type="checkbox"
                     :value="constants.LANGUAGE_LEVELS.ADVANCED_1"
                     v-model="levels">
              <label for="filter-advanced-1-checkbox">Advanced 1</label>
            </div>
            <div class="checkbox-label">
              <input id="filter-advanced-2-checkbox"
                     type="checkbox"
                     :value="constants.LANGUAGE_LEVELS.ADVANCED_2"
                     v-model="levels">
              <label for="filter-advanced-2-checkbox">Advanced 2</label>
            </div>
          </fieldset>
          <template v-if="!exclude.addedBy">
            <label for="author-input" class="filter-label">Course Author</label>
            <input id="author-input" type="text" v-model="addedBy">
          </template>
        </div>
        <div class="buttons-wrapper">
          <button type="reset" class="primary-hollow-button square-button">Clear</button>
          <button type="submit" class="primary-filled-button square-button">Apply</button>
        </div>
      </form>
    </base-filters-card>
  </base-collapsable-div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseCollapsableDiv from "@/components/ui/BaseCollapsableDiv.vue";
import BaseFiltersCard from "@/components/ui/BaseFiltersCard.vue";
import constants from "@/constants.js";

export default defineComponent({
  name: "CourseFilters",
  components: {BaseFiltersCard, BaseCollapsableDiv},
  emits: ["onFiltersApplied", "onFiltersCleared"],
  props: {
    isShown: {type: Boolean, required: true},
    exclude: {type: Object as PropType<{ [k in "levels" | "addedBy"]?: boolean }>, required: false, default: []}
  },
  data() {
    return {
      levels: [],
      addedBy: ""
    };
  },
  methods: {
    applyFilters() {
      this.$router.push({
        query: {
          ...this.$route.query,
          level: this.levels.length == 0 ? undefined : this.levels,
          addedBy: this.addedBy || undefined,
          page: undefined
        }
      });
      this.$emit("onFiltersApplied");
    },
    clearFilters() {
      this.levels = [];
      this.addedBy = "";
      this.$router.push({
        query: {
          ...this.$route.query,
          level: undefined,
          addedBy: undefined,
          page: undefined
        }
      });
      this.$emit("onFiltersCleared");
    }
  },
  setup() {
    return {constants};
  }
});
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

h4 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #00356b;
}

form {
  display: flex;
  flex-direction: column;

}

.filters-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  align-items: flex-start;
}

.filter-label {
  font-size: 1rem;
  font-weight: bold;
  color: #00356b;
}

.filter-levels {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1rem;
}


.buttons-wrapper {
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;

}

.buttons-wrapper button {
  padding: 5px 20px;
  font-size: 0.9rem;
}
</style>
