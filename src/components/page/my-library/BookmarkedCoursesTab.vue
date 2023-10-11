<template>
  <div class="tab-wrapper">
    <div class="top-bar">
      <search-bar :initial-search-query="queryParams.searchQuery"/>
      <button class="filter-button" @click.stop="toggleFilters">
        <font-awesome-icon icon="filter"/>
      </button>
    </div>

    <course-filters :is-shown="isFiltersShown"
                    @on-filters-cleared="() => isFiltersShown=false"
                    @on-filters-applied="() => isFiltersShown=false"/>

    <div v-if="loading">
    </div>
    <ol class="course-grid">
      <li v-for="course in courses" :key="course.id">
        <course-card
            :course="course">
        </course-card>
      </li>
    </ol>
    <pagination-controls
        v-if="pageCount"
        :page-count="pageCount"
        :page="queryParams.page"
        :page-size="queryParams.pageSize"
        :per-page-select-label="`Courses Per Page`">
    </pagination-controls>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CourseSchema} from "dzelda-types";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import CourseCard from "@/components/shared/content/CourseCard.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import CourseFilters from "@/components/shared/filters/CourseFilters.vue";

export default defineComponent({
  name: "BookmarkedCoursesTab",
  components: {CourseFilters, SearchBar, CourseCard, PaginationControls},
  props: {
    pathParams: {
      type: Object as PropType<{
        learningLanguage: string
      }>,
      required: true
    },
    queryParams: {
      type: Object as PropType<{
        page: number,
        pageSize: number,
        searchQuery: string,
        level: string[]
      }>,
      required: true
    },
  },
  data() {
    return {
      courses: null as CourseSchema[] | null,
      pageCount: 0,
      loading: true,
      isFiltersShown: false
    };
  },
  watch: {
    queryParams() {
      this.fetchSavedCourses();
    }
  },
  async mounted() {
    await this.fetchSavedCourses();
  },
  methods: {
    async fetchSavedCourses() {
      this.loading = true;
      const response = await this.courseStore.fetchUserBookmarkedCourses({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        searchQuery: this.queryParams.searchQuery || undefined,
      });
      this.courses = response.data;
      this.pageCount = response.pageCount;
      this.loading = false;
    },
    toggleFilters() {
      this.isFiltersShown = !this.isFiltersShown;
    }
  },
  setup() {
    return {
      courseStore: useCourseStore()
    };
  }
});
</script>

<style scoped>
.tab-wrapper {
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
  height: 30px;
}

.filter-button:hover {
  cursor: pointer;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 0.75rem;
}

.course-grid li {
  max-width: 300px;
}
</style>
