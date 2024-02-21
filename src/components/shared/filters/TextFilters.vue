<template>
  <BaseCollapsableDiv :isShown="isShown" :maxHeight="maxCardHeight" v-slot="{setContentElement}">
    <div :ref="(el) => setContentElement(el)">
      <BaseFiltersCard class="card">
        <h4>Filters</h4>
        <form @submit.prevent="applyFilters" @reset="clearFilters">
          <div class="filters-wrapper">
            <div v-if="!excludedFilters.has('addedBy')" class="form-row">
              <label for="author-input" class="filter-label">Author</label>
              <input id="author-input" type="text" v-model="addedBy" placeholder="Enter a username">
            </div>
            <div v-if="!excludedFilters.has('level')" class="form-row">
              <label class="filter-label">Level</label>
              <fieldset class="filter-levels">
                <label v-for="level in allLevels" class="box-label">
                  <input type="checkbox" :value="level.value" v-model="levels">
                  {{ level.label }}
                </label>
              </fieldset>
            </div>
            <div v-if="!excludedFilters.has('hasAudio')" class="form-row">
              <label class="filter-label">Has audio?</label>
              <fieldset class="filter-has-audio">
                <label class="box-label">
                  <input type="radio" :value="true" v-model="hasAudio">
                  Yes
                </label>
                <label class="box-label">
                  <input type="radio" :value="false" v-model="hasAudio">
                  No
                </label>
                <label class="box-label">
                  <input type="radio" :value="undefined" v-model="hasAudio">
                  Both
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
import {defineComponent, PropType} from "vue";
import BaseCollapsableDiv from "@/components/ui/BaseCollapsableDiv.vue";
import BaseFiltersCard from "@/components/ui/BaseFiltersCard.vue";
import {toSentenceCase} from "@/utils.js";
import {LanguageLevelSchema} from "dzelda-common";
import {useDebounceFn, useResizeObserver} from "@vueuse/core";

export const textFilterFields = ["addedBy", "level", "hasAudio"] as const;
export type TextFiltersObject = Partial<{ addedBy: string, level: string | string[], hasAudio: boolean }>;

export default defineComponent({
  name: "TextFilters",
  components: {BaseFiltersCard, BaseCollapsableDiv},
  props: {
    isShown: {type: Boolean, required: true},
    filters: {type: Object as PropType<TextFiltersObject>, default: {}},
    excludedFilters: {type: Object as PropType<Set<keyof TextFiltersObject>>, required: false, default: new Set()},
  },
  data() {
    return {
      addedBy: this.filters.addedBy ?? "",
      levels: this.filters.level ?? [],
      hasAudio: this.filters.hasAudio,
      maxCardHeight: undefined as number | undefined,
    };
  },
  watch: {
    filters() {
      this.addedBy = this.filters.addedBy ?? "";
      this.levels = this.filters.level ?? [];
      this.hasAudio = this.filters.hasAudio;
    }
  },
  methods: {
    applyFilters() {
      this.$router.push({
        query: {
          ...this.$route.query,
          addedBy: this.addedBy || undefined,
          level: this.levels,
          hasAudio: this.hasAudio != undefined ? `${this.hasAudio}` : undefined,
          page: undefined
        }
      });
      this.$emit("onFiltersApplied");
    },
    clearFilters() {
      const clearedFilters: Partial<Record<typeof textFilterFields[number], undefined>> = {};
      textFilterFields.forEach(f => clearedFilters[f] = undefined);
      this.$router.push({
        query: {
          ...this.$route.query,
          ...clearedFilters,
          searchQuery: undefined,
          page: undefined
        }
      });
      this.$emit("onFiltersCleared");
    }
  },
  setup() {
    return {
      allLevels: Object.values(LanguageLevelSchema).map(v => ({value: v, label: `${toSentenceCase(v).slice(0, -1)} ${v.slice(-1)}`}))
    };
  },
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
  row-gap: 1rem;
  align-items: flex-start;
}

.form-row {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.filter-label {
  font-size: 1rem;
  font-weight: bold;
  color: #00356b;
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

.filter-levels, .filter-has-audio {
  display: flex;
  column-gap: 1rem;
  flex-wrap: wrap;
}
</style>
