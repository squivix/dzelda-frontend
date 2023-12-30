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
      <router-link :to="{name:'add-course'}" class="inv-link add-course-button">
        <inline-svg :src="icons.plusRound" class="empty-icon"/>
        Add courses and<br>they will appear here
      </router-link>
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
  components: {InlineSvg, CourseList},
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
      isLoading: true,
    };
  },
  watch: {
    queryParams() {
      this.fetchImportedCourses();
    }
  },
  async mounted() {
    await this.fetchImportedCourses();
  },
  methods: {
    async fetchImportedCourses() {
      this.isLoading = true;
      const response = await this.courseStore.fetchCourses({
        languageCode: this.$route.params.learningLanguage as string,
        level: this.queryParams.level,
        addedBy: "me",
        sortBy: "createdDate",
        sortOrder: "desc",
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        searchQuery: this.queryParams.searchQuery || undefined,
      }, {secure: true});
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
.add-course-button {
  display: flex;
  color: grey;
  flex-direction: column;
  align-items: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  row-gap: 0.5rem;
}

.add-course-button:hover, .add-course-button:hover svg {
  color: #183153;
}

</style>
