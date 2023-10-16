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
      <router-link :to="{name:'add-course'}" class="inv-link add-course-button">
        <font-awesome-icon icon="circle-plus" class="empty-icon"/>
        Add courses and<br>they will appear here
      </router-link>
    </template>
  </CourseList>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CourseSchema} from "dzelda-types";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import CourseCard from "@/components/shared/content/CourseCard.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import CourseFilters from "@/components/shared/filters/CourseFilters.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
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
      this.fetchImportedCourses();
    }
  },
  async mounted() {
    await this.fetchImportedCourses();
  },
  methods: {
    async fetchImportedCourses() {
      this.loading = true;
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
      this.loading = false;
    },
    toggleFilters() {
      this.isFiltersShown = !this.isFiltersShown;
    },
    clearFilters() {
      this.$router.push({
        query: {
          ...this.$route.query, level: undefined, addedBy: undefined, page: undefined, searchQuery: undefined
        }
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
.add-course-button {
  display: flex;
  color: grey;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  row-gap: 0.5rem;
}

.add-course-button:hover, .add-course-button:hover svg {
  color: #183153;
}
</style>
