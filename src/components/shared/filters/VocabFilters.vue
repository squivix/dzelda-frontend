<template>
  <BaseCollapsableDiv :isShown="isShown" :maxHeight="maxCardHeight" v-slot="{setContentElement}">
    <div :ref="(el) => setContentElement(el)">
      <BaseFiltersCard class="card" @mousedown.stop>
        <h4>Filters</h4>
        <form @submit.prevent="applyFilters" @reset="clearFilters">
          <div class="filters-wrapper">
            <div class="form-row" v-if="!excludedFilters.has('level')">
              <h5 class="filter-label">Level</h5>
              <fieldset class="filter-levels">
                <label v-for="level in allLevels" class="box-label">
                  <input type="checkbox" :value="level.value" v-model="levels">
                  {{ level.label }}
                </label>
              </fieldset>
            </div>
          </div>
          <div class="buttons-wrapper">
            <button type="reset" class="primary-hollow-button square-button">Clear</button>
            <button type="submit" class="primary-filled-button square-button">Apply</button>
          </div>
        </form>
      </BaseFiltersCard>
    </div>
  </BaseCollapsableDiv>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {PropType} from "vue";
import BaseCollapsableDiv from "@/components/ui/BaseCollapsableDiv.vue";
import BaseFiltersCard from "@/components/ui/BaseFiltersCard.vue";
import type {VocabLevelSchema} from "dzelda-common";
import {VocabLevel} from "dzelda-common";

type VocabFiltersObject = { level: VocabLevelSchema | VocabLevelSchema[] };
export default defineComponent({
  name: "VocabFilters",
  components: {BaseFiltersCard, BaseCollapsableDiv},
  emits: ["onFiltersApplied", "onFiltersCleared"],
  props: {
    isShown: {type: Boolean, required: true},
    filters: {type: Object as PropType<VocabFiltersObject>, default: {}},
    excludedFilters: {type: Object as PropType<Set<keyof VocabFiltersObject>>, required: false, default: new Set()}
  },
  data() {
    return {
      levels: this.filters.level ?? [],
      maxCardHeight: undefined as number | undefined,
    };
  },
  watch: {
    filters() {
      this.levels = this.filters.level ?? [];
    }
  },
  methods: {
    applyFilters() {
      this.$router.push({
        query: {
          ...this.$route.query,
          level: this.levels,
          page: undefined
        }
      });
      this.$emit("onFiltersApplied");
    },
    clearFilters() {
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
    return {
      allLevels: [
        {value: VocabLevel.LEVEL_1, label: "Level 1"},
        {value: VocabLevel.LEVEL_2, label: "Level 2"},
        {value: VocabLevel.LEVEL_3, label: "Level 3"},
        {value: VocabLevel.LEVEL_4, label: "Level 4"},
        {value: VocabLevel.LEARNED, label: "Learned"},
      ]
    };
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
  color: var(--panel-new-text-color);
  margin-bottom: 0.5rem;
}

form {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
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
}

.filter-levels {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1rem;
  color: var(--on-background-color);
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
