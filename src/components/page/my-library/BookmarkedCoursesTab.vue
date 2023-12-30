<template>
  <CourseList :is-loading="isLoading"
              :page-count="pageCount"
              :page="queryParams.page"
              :pageSize="queryParams.pageSize"
              :searchQuery="queryParams.searchQuery"
              :addedBy="queryParams.addedBy"
              :level="queryParams.level"
              :courses="courses">
    <template v-slot:empty-screen>
      <inline-svg :src="icons.bookWithBookmark" class="empty-icon"/>
      <p>Courses you bookmark
        <br>
        will appear here</p>
    </template>
  </CourseList>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CourseSchema} from "dzelda-common";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import CourseList from "@/components/shared/content/CourseList.vue";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "BookmarkedCoursesTab",
  components: {CourseList, InlineSvg},
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
      isLoading: false,
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
      this.isLoading = true;
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
      this.isLoading = false;
    },
  },
  setup() {
    return {
      icons,
      courseStore: useCourseStore()
    };
  }
});
</script>

<style scoped>

</style>
