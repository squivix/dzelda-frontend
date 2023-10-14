<template>
  <LoadingScreen v-if="loading"/>
  <div class="tab-wrapper" v-else>
    <EmptyScreen v-if="!lessons||lessons.length==0" message="No lessons found in this language"/>
    <ul v-if="lessons&&lessons.length>0" class="lessons-list">
      <lesson-list-item v-for="lesson in lessons" :key="lesson.id" :lesson="lesson"/>
    </ul>

    <pagination-controls v-if="pageCount"
                         :page="queryParams.page"
                         :page-size="queryParams.pageSize"
                         :page-count="pageCount"
                         perPageSelectLabel="Lessons Per Page"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {LessonSchema} from "dzelda-types";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";

export default defineComponent({
  name: "RecentLessonsTab",
  components: {EmptyScreen, LoadingScreen, PaginationControls, LessonListItem},
  data() {
    return {
      lessons: [] as LessonSchema[],
      pageCount: 0,
      loading: false,
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
      this.fetchLessons();
    }
  },
  methods: {
    async fetchLessons() {
      this.loading = true;
      const response = await this.lessonStore.fetchLessons({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        sortBy: "createdDate",
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
</style>
