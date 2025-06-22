<template>
  <LoadingScreen v-if="isLoading"/>
  <div class="wrapper" v-else>
    <template v-if="showSearchFilters">
      <div class="top-bar">
        <SearchBar :initialSearchQuery="searchQuery"/>
        <button v-if="remainingFilters.size!=0" class="filter-button icon-wrapper" @click.stop="toggleFilters">
          <inline-svg :src="icons.filter"/>
        </button>
      </div>
      <CollectionFilters v-if="remainingFilters.size!=0"
                         :isShown="isFiltersShown"
                         :filters="filters"
                         :excludedFilters="excludedFilters"
                         @onFiltersCleared="() => isFiltersShown=false"
                         @onFiltersApplied="() => isFiltersShown=false"/>
    </template>
    <EmptyScreen v-if="!collections||collections.length==0" :hasFilters="hasQuery">
      <template v-slot:no-filters>
        <div class="empty-screen">
          <slot name="empty-screen">
            <p>{{ emptyMessage }}</p>
          </slot>
        </div>
      </template>
      <template v-slot:with-filters>
        <div class="empty-screen">
          <inline-svg :src="icons.search" class="empty-icon"/>
          <p>No collections match your query</p>

          <button @click="clearFilters" class="clear-filters-button inv-button link">
            <inline-svg :src="icons.removeFilter"/>
            Clear query
          </button>
        </div>
      </template>
    </EmptyScreen>

    <ol class="collection-grid" v-else>
      <li v-for="collection in collections" :key="collection.id">
        <CollectionCard :collection="collection"/>
      </li>
    </ol>

    <PaginationControls
        v-if="pageCount"
        :page-count="pageCount"
        :page="page"
        :page-size="pageSize"
        :per-page-select-label="`Collections Per Page`">
    </PaginationControls>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import CollectionFilters, {collectionFilterFields, CollectionFiltersObject} from "@/components/shared/filters/CollectionFilters.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import type {CollectionSchema} from "dzelda-common";
import CollectionCard from "@/components/shared/content/CollectionCard.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import {isEmptyObject, setDifference} from "@/utils.js";
import TextFilters from "@/components/shared/filters/TextFilters.vue";

export default defineComponent({
  name: "CollectionList",
  components: {TextFilters, PaginationControls, CollectionCard, EmptyScreen, CollectionFilters, InlineSvg, SearchBar, LoadingScreen},
  props: {
    isLoading: {type: Boolean, required: true},
    pageCount: {type: Number, required: true},
    page: Number,
    pageSize: Number,
    searchQuery: String,
    filters: {type: Object as PropType<CollectionFiltersObject>, default: {}},
    addedBy: String,
    showSearchFilters: {type: Boolean, default: true},
    collections: Object as PropType<CollectionSchema[] | null>,
    emptyMessage: {type: String, default: "No collections found"},
    excludedFilters: {type: Object as PropType<Set<typeof collectionFilterFields[number]>>, required: false, default: new Set()}
  },
  data() {
    return {
      isFiltersShown: false,
    };
  },
  computed: {
    hasQuery() {
      return !isEmptyObject(this.filters) || !!this.searchQuery;
    },
    remainingFilters() {
      return setDifference(new Set(collectionFilterFields), this.excludedFilters);
    }
  },
  methods: {
    toggleFilters() {
      this.isFiltersShown = !this.isFiltersShown;
    },
    clearFilters() {
      const clearedFilters: Partial<Record<typeof collectionFilterFields[number], undefined>> = {};
      collectionFilterFields.forEach(f => clearedFilters[f] = undefined);
      this.$router.push({
        query: {...this.$route.query, ...clearedFilters, searchQuery: undefined, page: undefined}
      });
      this.isFiltersShown = false;
    }
  },
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  column-gap: 0.25rem;
  margin-bottom: 1rem;
}

.filter-button {
  border: 2px solid grey;
  border-radius: 5px;
  cursor: pointer;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 0.75rem;
  margin-bottom: 1rem;
}

.clear-filters-button {
  display: flex;
  align-items: center;
  column-gap: 1rem;
  font-size: 0.9rem;
}

.clear-filters-button svg {
  width: 20px;
  height: 20px;
}

@media screen and (max-width: 350px) {
  .collection-grid {
    display: flex;
    flex-direction: column;
  }
}
</style>
