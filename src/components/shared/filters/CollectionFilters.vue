<template>
  <BaseCollapsableDiv :isShown="isShown" :maxHeight="maxCardHeight" v-slot="{setContentElement}">
    <div :ref="(el) => setContentElement(el)">
      <BaseFiltersCard class="card">
        <h4>Filters</h4>
        <form @submit.prevent="applyFilters" @reset="clearFilters">
          <div class="filters-wrapper">
            <template v-if="!excludedFilters.has('addedBy')">
              <label for="author-input" class="filter-label">Author</label>
              <input id="author-input" type="text" v-model="addedBy" placeholder="Enter a username">
            </template>
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
import constants from "@/constants.js";

export const collectionFilterFields = ["addedBy"] as const;
export type CollectionFiltersObject = Partial<{ addedBy: string }>
export default defineComponent({
  name: "CollectionFilters",
  components: {BaseFiltersCard, BaseCollapsableDiv},
  emits: ["onFiltersApplied", "onFiltersCleared"],
  props: {
    isShown: {type: Boolean, required: true},
    filters: {type: Object as PropType<CollectionFiltersObject>, default: {}},
    excludedFilters: {type: Object as PropType<Set<keyof CollectionFiltersObject>>, required: false, default: new Set()}
  },
  data() {
    return {
      addedBy: this.filters.addedBy,
      maxCardHeight: undefined as number | undefined,
    };
  },
  watch: {
    filters() {
      this.addedBy = this.filters.addedBy ?? "";
    }
  },
  methods: {
    applyFilters() {
      this.$router.push({
        query: {
          ...this.$route.query,
          addedBy: this.addedBy || undefined,
          page: undefined
        }
      });
      this.$emit("onFiltersApplied");
    },
    clearFilters() {
      const clearedFilters: Partial<Record<typeof collectionFilterFields[number], undefined>> = {};
      collectionFilterFields.forEach(f => clearedFilters[f] = undefined);
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
</style>
