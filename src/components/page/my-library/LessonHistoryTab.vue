<template>
  <LoadingScreen v-if="loading"/>
  <div class="tab-wrapper" v-else>

    <EmptyScreen v-if="!lessons||lessons.length==0" :has-filters="false">
      <template v-slot:no-filters>
        <div class="empty-screen">
          <font-awesome-icon icon="clock-rotate-left" class="empty-icon"/>
          <p>No lessons in history</p>
        </div>
      </template>
    </EmptyScreen>
    <ul v-if="lessons" class="lessons-list">
      <lesson-list-item v-for="lesson in lessons" :key="lesson.id" :lesson="lesson"/>
    </ul>
    <pagination-controls
        v-if="pageCount"
        :page="queryParams.page"
        :page-size="queryParams.pageSize"
        :page-count="pageCount"
        per-page-select-label="Lessons Per Page"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {LessonSchema} from "dzelda-types";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import CourseFilters from "@/components/shared/filters/CourseFilters.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";

export default defineComponent({
  name: "LessonHistoryTab",
  components: {EmptyScreen, CourseFilters, LoadingScreen, PaginationControls, LessonListItem},
  data() {
    return {
      lessons: [] as LessonSchema[],
      pageCount: 0,
      loading: true,
    };
  },
  props: {
    queryParams: {
      type: Object as PropType<{ page: number, pageSize: number }>,
      required: true
    },
  },
  watch: {
    queryParams() {
      this.fetchLessons()
    }
  },
  methods: {
    async fetchLessons() {
      this.loading = true;
      const response = await this.lessonStore.fetchLessonsInHistory({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        sortBy: "title",
        sortOrder: "desc"
      });
      this.lessons = response.data!;
      this.pageCount = response.pageCount!;
      this.loading = false;
    }
  },
  async mounted() {
    await this.fetchLessons();
  },
  setup() {
    return {
      lessonStore: useLessonStore()
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

.lessons-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.empty-screen {
  color: grey;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  align-items: center;
}

.empty-screen .empty-icon {
  color: lightgrey;
  width: 60px;
  height: 60px;
}

.empty-screen button {
  color: grey;
  font-size: 1rem;
}
</style>
