<template>
  <LoadingScreen v-if="loading"/>
  <div v-else>
    <ul v-if="lessons" class="lessons-list">
      <lesson-list-item v-for="lesson in lessons" :key="lesson.id" :lesson="lesson"/>
    </ul>
    <pagination-controls :page="queryParams.page" :page-size="queryParams.pageSize" :page-count="pageCount"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {LessonSchema} from "dzelda-types";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";

export default defineComponent({
  name: "LessonHistoryTab",
  components: {LoadingScreen, PaginationControls, LessonListItem},
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
.lessons-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}
</style>
