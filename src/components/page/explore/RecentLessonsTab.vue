<template>
  <div>
    <ul v-if="lessons" class="lessons-list">
      <lesson-list-item v-for="lesson in lessons" :key="lesson.id" :lesson="lesson"/>
    </ul>
    <pagination-controls :page-count="pageCount"></pagination-controls>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {useQuery} from "@oarepo/vue-query-synchronizer";
import {LessonSchema} from "dzelda-types";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import PaginationControls from "@/components/ui/PaginationControls.vue";

export default defineComponent({
  name: "RecentLessonsTab",
  components: {PaginationControls, LessonListItem},
  data() {
    return {
      lessons: [] as LessonSchema[],
      pageCount: 0,
    }
  },
  methods: {
    async fetchLessons() {
      const response = await this.lessonStore.fetchLessons({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.maxPerPage,
        sortBy: "createdDate",
        sortOrder: "desc"
      });
      this.lessons = response.data!;
      this.pageCount = response.pageCount!;
    }
  },
  async mounted() {
    await this.fetchLessons();
  },
  setup() {
    return {
      lessonStore: useLessonStore(),
      queryParams: useQuery()
    };
  }
})
</script>

<style scoped>
.lessons-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}
</style>