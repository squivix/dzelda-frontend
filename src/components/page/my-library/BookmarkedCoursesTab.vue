<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CourseSchema} from "dzelda-types";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import PaginationControls from "@/components/ui/PaginationControls.vue";
import CourseCard from "@/components/shared/content/CourseCard.vue";

export default defineComponent({
  name: "BookmarkedCoursesTab",
  components: {CourseCard, PaginationControls},
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
      courseStore: useCourseStore()
    };
  }
});
</script>

<style scoped>

</style>
