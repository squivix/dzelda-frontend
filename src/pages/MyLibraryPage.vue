<template>
  <base-card title="My Library" class="library-base-card">
    <template v-slot:content>
      <div class="top-bar">
        <div class="search-filter-wrapper">
          <library-search-filter :search-query="queryParams.searchQuery"
          />
        </div>
      </div>
      <div v-if="loading">

      </div>

      <ol class="course-list">
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
    </template>
  </base-card>
</template>
<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import CourseCard from "@/components/shared/content/CourseCard.vue";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import PaginationControls from "@/components/ui/PaginationControls.vue";
import LibrarySearchFilter from "@/components/page/reader/LibrarySearchFilter.vue";
import {defineComponent, PropType} from "vue";
import {CourseSchema, LessonSchema} from "dzelda-types";

export default defineComponent({
  name: "MyLibraryPage",
  components: {LessonListItem, PaginationControls, LibrarySearchFilter, CourseCard, BaseCard},
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
        searchQuery: string
      }>,
      required: true
    },
  },
  data() {
    return {
      lessons: null as LessonSchema[] | null,
      courses: null as CourseSchema[] | null,
      pageCount: 0,
      loading: true,
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
    }
  },
  setup() {
    return {
      courseStore: useCourseStore(),
    };
  }
});
</script>

<style scoped>
.library-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
  width: 70vw;
}

.library-base-card:deep(header) {
  margin-bottom: 1rem;
}

.top-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 0.5vw;
}

.search-filter-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 0.75rem;
}

.course-list li {
  max-width: 400px;
}
</style>
