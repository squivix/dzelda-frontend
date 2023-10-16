<template>
  <CourseList :is-loading="loading"
              :page-count="pageCount"
              :page="queryParams.page"
              :pageSize="queryParams.pageSize"
              :searchQuery="queryParams.searchQuery"
              :addedBy="queryParams.addedBy"
              :level="queryParams.level"
              :courses="courses">
    <template v-slot:empty-screen>
      <font-awesome-icon icon="book-bookmark" class="empty-icon"/>
      <p>Courses you bookmark
        <br>
        will appear here</p>
    </template>
  </CourseList>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CourseSchema} from "dzelda-types";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import CourseList from "@/components/shared/content/CourseList.vue";

export default defineComponent({
  name: "BookmarkedCoursesTab",
  components: {CourseList},
  props: {
    pathParams: {
      type: Object as PropType<{
        learningLanguage: string
      }>,
      required: true
    },
    queryParams: {
      type: Object as PropType<{
        page?: number,
        pageSize?: number,
        searchQuery?: string,
        addedBy?: string,
        level?: string[]
      }>,
      required: true
    },
  },
  data() {
    return {
      courses: null as CourseSchema[] | null,
      pageCount: 0,
      loading: true,
      isFiltersShown: false,
    };
  },
  computed: {
    hasFilters() {
      return !!this.queryParams.addedBy || !!this.queryParams.searchQuery || !!this.queryParams.level;
    }
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
        level: this.queryParams.level,
        addedBy: this.queryParams.addedBy,
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
    },
    clearFilters() {
      this.$router.push({
        query: {...this.$route.query, level: undefined, addedBy: undefined, searchQuery: undefined, page: undefined}
      });
      this.isFiltersShown = false;
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
