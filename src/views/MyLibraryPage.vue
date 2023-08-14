<template>
  <base-card title="My Library" class="library-base-card">
    <template v-slot:content>
      <div class="top-bar">
        <!--TODO maybe replace select with tabs-->
        <select class="course-lesson-select" v-model="showListOf">
          <option name="lessons">Lessons</option>
          <option name="courses">Courses</option>
        </select>
        <div class="search-filter-wrapper">
          <library-search-filter>

          </library-search-filter>
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
      <!--suppress JSUnresolvedVariable -->
      <pagination-controls
          v-if="pageCount"
          :page-count="pageCount"
          :current-page="queryParams.page"
          :maxPerPage="queryParams.maxPerPage"
          :per-page-select-label="`${showListOf} Per Page`"
          :per-page-select-options="PER_PAGE_SELECT_OPTIONS">
      </pagination-controls>
    </template>
  </base-card>
</template>
<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import CourseCard from "@/components/shared/content/CourseCard.vue";
import {useLessonStore} from "@/stores/lessonStore.js";
import {useCourseStore} from "@/stores/courseStore.js";
import PaginationControls from "@/components/ui/PaginationControls.vue";
import LibrarySearchFilter from "@/components/page/reader/LibrarySearchFilter.vue";
import {defineComponent} from "vue";
import type {WatchStopHandle} from "vue"
import {useQuery} from "@oarepo/vue-query-synchronizer";

enum MyLibraryPageTab {
  LESSONS = "Lessons",
  COURSES = "Courses",
}

export default defineComponent({
  name: "MyLibraryPage",
  components: {LessonListItem, PaginationControls, LibrarySearchFilter, CourseCard, BaseCard},
  data() {
    return {
      lessons: null as object[] | null,
      courses: null as object[] | null,
      showListOf: MyLibraryPageTab.LESSONS,
      searchQuery: null,
      pageCount: 0,
      loading: true,
      PER_PAGE_SELECT_OPTIONS: [10, 15, 20, 50]
    };
  },
  watch: {
    showListOf() {
      this.fetchContent();
    }
  },
  async mounted() {
    await this.fetchContent();
    this.unwatchesOnRouteExit = [
      this.$watch("queryParams.page", this.fetchContent),
      this.$watch("queryParams.maxPerPage", this.refetchPage),
      this.$watch("queryParams.searchQuery", this.refetchPage)
    ];
  },
  methods: {
    refetchPage() {
      if (!this.queryParams.page || this.queryParams.page === 1)
        this.fetchContent();
      else
        this.queryParams.page = 1;
    },
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
            languageCode: this.$route.params.learningLanguage,
            page: this.queryParams.page,
            pageSize: this.queryParams.maxPerPage,
            searchQuery: this.queryParams.searchQuery,
          });
      this.lessons = response.data;
      this.pageCount = response.pageCount;
    },
    async fetchSavedCourses() {
      const response = await this.courseStore.fetchLibraryCourses({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.maxPerPage,
        searchQuery: this.queryParams.searchQuery,
      });
      this.courses = response.data;
      this.pageCount =response.pageCount;
    }
  },
  beforeRouteLeave() {
    while (this.unwatchesOnRouteExit.length)
      (this.unwatchesOnRouteExit.pop())!();
  },
  setup() {
    return {
      courseStore: useCourseStore(),
      lessonStore: useLessonStore(),
      queryParams: useQuery(),
      unwatchesOnRouteExit: [] as WatchStopHandle[],
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