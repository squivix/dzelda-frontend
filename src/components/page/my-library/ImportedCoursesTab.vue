<template>
  <LoadingScreen v-if="loading"/>
  <div class="tab-wrapper" v-else>
    <div class="top-bar">
      <search-bar :initial-search-query="queryParams.searchQuery"/>
      <button class="filter-button" @click.stop="toggleFilters">
        <font-awesome-icon icon="filter"/>
      </button>
    </div>

    <course-filters :is-shown="isFiltersShown"
                    @on-filters-cleared="() => isFiltersShown=false"
                    @on-filters-applied="() => isFiltersShown=false" :exclude="{addedBy:true}"/>
    <EmptyScreen v-if="!courses||courses.length==0" :has-filters="hasFilters">
      <template v-slot:no-filters>
        <div class="empty-screen">
          <router-link :to="{name:'add-course'}" class="inv-link add-course-button">
            <font-awesome-icon icon="circle-plus" class="empty-icon"/>
            Add courses and<br>they will appear here
          </router-link>
        </div>
      </template>
      <template v-slot:with-filters>
        <div class="empty-screen">
          <font-awesome-icon icon="magnifying-glass" class="empty-icon"/>
          <p>No courses match your query</p>

          <button @click="clearFilters" class="clear-filters-button square-button hollow-button link">Clear filters
            <font-awesome-icon :icon="['fas', 'filter-circle-xmark']"/>
          </button>
        </div>
      </template>
    </EmptyScreen>
    <ol class="course-grid" v-else>
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
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default defineComponent({
  name: "BookmarkedCoursesTab",
  components: {FontAwesomeIcon, EmptyScreen, LoadingScreen, CourseFilters, SearchBar, CourseCard, PaginationControls},
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 0.75rem;
}

.empty-screen {
  color: grey;
}

.empty-screen .empty-icon {
  color: lightgrey;
  width: 60px;
  height: 60px;
}

.empty-screen button {
  color: grey;
}

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
