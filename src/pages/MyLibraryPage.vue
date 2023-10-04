<template>
  <base-card title="My Library" class="library-base-card">
    <template v-slot:content>
      <div class="top-bar">
        <select class="course-lesson-select" v-model="showListOf">
          <option name="lessons">Lessons</option>
          <option name="courses">Courses</option>
        </select>
        <div class="search-filter-wrapper">
          <library-search-filter :search-query="queryParams.searchQuery"
          />
        </div>
      </div>
      <div v-if="loading">

      </div>
      <ol class="lesson-list" v-else-if="showListOf===MyLibraryPageTab.LESSONS">
        <li v-for="lesson in lessons" :key="lesson.id">
          <lesson-list-item
              :lesson="lesson">
          </lesson-list-item>
        </li>
      </ol>

      <ol class="course-list" v-else-if="showListOf===MyLibraryPageTab.COURSES">
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
          :per-page-select-label="`${showListOf} Per Page`">
      </pagination-controls>
    </template>
  </base-card>
</template>
<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import CourseCard from "@/components/shared/content/CourseCard.vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import PaginationControls from "@/components/ui/PaginationControls.vue";
import LibrarySearchFilter from "@/components/page/reader/LibrarySearchFilter.vue";
import {defineComponent, PropType} from "vue";
import type {WatchStopHandle} from "vue"
import {useQuery} from "@oarepo/vue-query-synchronizer";
import {CourseSchema, LessonSchema} from "dzelda-types";

enum MyLibraryPageTab {
  LESSONS = "Lessons",
  COURSES = "Courses",
}

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
      showListOf: MyLibraryPageTab.LESSONS,
      pageCount: 0,
      loading: true,
    };
  },
  watch: {
    showListOf() {
      this.fetchContent();
    },
    queryParams() {
      this.fetchContent()
    }
  },
  async mounted() {
    await this.fetchContent();
  },
  methods: {
    async fetchContent() {
      this.loading = true;
      if (this.showListOf === MyLibraryPageTab.LESSONS)
        await this.fetchLessons();
      else if (this.showListOf === MyLibraryPageTab.COURSES)
        await this.fetchSavedCourses();
      this.loading = false;
    },
    async fetchLessons() {
      const response = await this.lessonStore.fetchLibraryLessons(
          {
            languageCode: this.pathParams.learningLanguage,
            page: this.queryParams.page,
            pageSize: this.queryParams.pageSize,
            searchQuery: this.queryParams.searchQuery || undefined,
          });
      this.lessons = response.data;
      this.pageCount = response.pageCount;
    },
    async fetchSavedCourses() {
      const response = await this.courseStore.fetchLibraryCourses({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        searchQuery: this.queryParams.searchQuery,
      });
      this.courses = response.data;
      this.pageCount = response.pageCount;
    }
  },
  setup() {
    return {
      courseStore: useCourseStore(),
      lessonStore: useLessonStore(),
      MyLibraryPageTab
    }
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

.course-lesson-select {
  flex-basis: 10rem;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
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