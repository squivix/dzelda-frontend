<template>
  <div>
    <ul v-if="lessons" class="lessons-list">
      <lesson-list-item v-for="lesson in lessons" :key="lesson.id" :lesson="lesson"/>
    </ul>
    <pagination-controls :page="queryParams.page" :page-size="queryParams.pageSize" :page-count="pageCount"
                         @on-pagination-changed="fetchLessons"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {LessonSchema} from "dzelda-types";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import PaginationControls from "@/components/ui/PaginationControls.vue";
import {PropType} from "vue/dist/vue.js";

export default defineComponent({
  name: "RecentLessonsTab",
  components: {PaginationControls, LessonListItem},
  data() {
    return {
      lessons: [] as LessonSchema[],
      pageCount: 0,
    };
  },
  props: {
    queryParams: {
      type: Object as PropType<{ page: number, pageSize: number }>,
      required: true
    },
  },
  watch: {},
  methods: {
    async fetchLessons() {
      const response = await this.lessonStore.fetchLessons({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
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
