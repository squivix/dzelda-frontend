<template>
  <LoadingScreen v-if="isLoading"/>
  <div class="wrapper" v-else>
    <div class="top-bar">
      <search-bar :initial-search-query="searchQuery"/>
      <button class="filter-button icon-wrapper" @click.stop="toggleFilters">
        <inline-svg :src="icons.filter"/>
      </button>
    </div>
    <course-filters :is-shown="isFiltersShown"
                    @on-filters-cleared="() => isFiltersShown=false"
                    @on-filters-applied="() => isFiltersShown=false"/>

    <EmptyScreen v-if="!courses||courses.length==0" :has-filters="hasFilters">
      <template v-slot:no-filters>
        <div class="empty-screen">
          <slot name="empty-screen">
            <p>No courses found</p>
          </slot>
        </div>
      </template>
      <template v-slot:with-filters>
        <div class="empty-screen">
          <inline-svg :src="icons.search" class="empty-icon"/>
          <p>No courses match your query</p>

          <button @click="clearFilters" class="clear-filters-button inv-button link">
            <inline-svg :src="icons.removeFilter"/>
            Clear query
          </button>
        </div>
      </template>
    </EmptyScreen>

    <ol class="course-grid" v-else>
      <li v-for="course in courses" :key="course.id">
        <course-card
            :course="course">
        </course-card>
      </li>
    </ol>

    <pagination-controls
        v-if="pageCount"
        :page-count="pageCount"
        :page="page"
        :page-size="pageSize"
        :per-page-select-label="`Courses Per Page`">
    </pagination-controls>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import CourseFilters from "@/components/shared/filters/CourseFilters.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import {CourseSchema} from "dzelda-types";
import CourseCard from "@/components/shared/content/CourseCard.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";

export default defineComponent({
  name: "CourseList",
  components: {PaginationControls, CourseCard, EmptyScreen, CourseFilters, InlineSvg, SearchBar, LoadingScreen},
  data() {
    return {
      isFiltersShown: false,
    }
  },
  props: {
    isLoading: {type: Boolean, required: true},
    pageCount: {type: Number, required: true},
    page: Number,
    pageSize: Number,
    searchQuery: String,
    addedBy: String,
    level: Array as PropType<string[]>,
    courses: Object as PropType<CourseSchema[] | null>
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
    return {icons}
  }
})
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
  align-items: center;
  column-gap: 0.25rem;
}

.filter-button {
  border: 2px solid grey;
  border-radius: 5px;
  width: 30px;
  height: 30px;
}

.filter-button:hover {
  cursor: pointer;
}

.course-grid {
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