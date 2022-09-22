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
      <ol class="lesson-list" v-else-if="showListOf==='Lessons'">
        <li v-for="lesson in lessons" :key="lesson.id">
          <lesson-list-item
              :lesson="lesson">
          </lesson-list-item>
        </li>
      </ol>

      <ol class="course-list" v-else>
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
          :current-page="$query.page"
          :maxPerPage="$query.maxPerPage"
          :per-page-select-label="`${showListOf} Per Page`"
          :per-page-select-options="PER_PAGE_SELECT_OPTIONS">
      </pagination-controls>
    </template>
  </base-card>
</template>
<script>
import BaseCard from "@/components/ui/BaseCard.vue";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import CourseCard from "@/components/shared/content/CourseCard.vue";
import {useLessonStore} from "@/stores/lesson.js";
import {useCourseStore} from "@/stores/course.js";
import PaginationControls from "@/components/ui/PaginationControls.vue";
import LibrarySearchFilter from "@/components/page/reader/LibrarySearchFilter.vue";

export default {
  name: "MyLibraryPage",
  components: {LessonListItem, PaginationControls, LibrarySearchFilter, CourseCard, BaseCard},
  data() {
    return {
      lessons: null,
      courses: null,
      showListOf: "Lessons",
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
      this.$watch("$query.page", this.fetchContent),
      this.$watch("$query.maxPerPage", this.refetchPage),
      this.$watch("$query.searchQuery", this.refetchPage)
    ];
  },
  methods: {
    refetchPage() {
      if (!this.$query.page || this.$query.page === 1)
        this.fetchContent();
      else
        this.$query.page = 1;
    },
    async fetchContent() {
      this.loading = true;
      if (this.showListOf === "Lessons")
        await this.fetchLessons();
      else if (this.showListOf === "Courses")
        await this.fetchSavedCourses();
      this.loading = false;
    },
    async fetchLessons() {
      const response = await this.lessonStore.fetchLibraryLessons(
          {
            languageCode: this.$route.params.learningLanguage,
            page: this.$query.page,
            maxPerPage: this.$query.maxPerPage,
            searchQuery: this.$query.searchQuery,
          });
      this.lessons = response.results;
      this.pageCount = Math.ceil(response.count / this.$query.maxPerPage);
    },
    async fetchSavedCourses() {
      const response = await this.courseStore.fetchLibraryCourses({
        languageCode: this.$route.params.learningLanguage,
        page: this.$query.page,
        maxPerPage: this.$query.maxPerPage,
        searchQuery: this.$query.searchQuery,
      });
      this.courses = response.results;
      this.pageCount = Math.ceil(response.count / this.$query.maxPerPage);
    }
  }, beforeRouteLeave() {
    while (this.unwatchesOnRouteExit.length)
      (this.unwatchesOnRouteExit.pop())();
  },
  created() {
    this.courseStore = useCourseStore();
    this.lessonStore = useLessonStore();
  }
};
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