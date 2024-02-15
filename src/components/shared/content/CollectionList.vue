<template>
  <LoadingScreen v-if="isLoading"/>
  <div class="wrapper" v-else>
    <div class="top-bar">
      <SearchBar :initial-search-query="searchQuery"/>
      <button class="filter-button icon-wrapper" @click.stop="toggleFilters">
        <inline-svg :src="icons.filter"/>
      </button>
    </div>
    <CollectionFilters :is-shown="isFiltersShown"
                   @on-filters-cleared="() => isFiltersShown=false"
                   @on-filters-applied="() => isFiltersShown=false"/>

    <EmptyScreen v-if="!collections||collections.length==0" :has-filters="hasFilters">
      <template v-slot:no-filters>
        <div class="empty-screen">
          <slot name="empty-screen">
            <p>No collections found</p>
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
import CollectionFilters from "@/components/shared/filters/CollectionFilters.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import {CollectionSchema} from "dzelda-common";
import CollectionCard from "@/components/shared/content/CollectionCard.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";

export default defineComponent({
  name: "CollectionList",
  components: {PaginationControls, CollectionCard, EmptyScreen, CollectionFilters, InlineSvg, SearchBar, LoadingScreen},
  props: {
    isLoading: {type: Boolean, required: true},
    pageCount: {type: Number, required: true},
    page: Number,
    pageSize: Number,
    searchQuery: String,
    addedBy: String,
    level: Array as PropType<string[]>,
    collections: Object as PropType<CollectionSchema[] | null>
  },
  data() {
    return {
      isFiltersShown: false,
    };
  },
  computed: {
    hasFilters() {
      return !!this.addedBy || !!this.searchQuery || !!this.level;
    }
  },
  methods: {
    toggleFilters() {
      this.isFiltersShown = !this.isFiltersShown;
    },
    clearFilters() {
      this.$router.push({
        query: {...this.$route.query, level: undefined, addedBy: undefined, searchQuery: undefined, page: undefined}
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
  row-gap: 1rem;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  column-gap: 0.25rem;
}

.filter-button {
  border: 2px solid grey;
  border-radius: 5px;
}

.filter-button:hover {
  cursor: pointer;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 0.75rem;
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

</style>
