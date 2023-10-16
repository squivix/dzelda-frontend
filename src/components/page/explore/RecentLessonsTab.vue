<template>
  <LessonList :page-count="pageCount"
              :page-size="queryParams.pageSize"
              :page="queryParams.page"
              :is-loading="isLoading"
              :lessons="lessons"
              empty-message="No lessons found in this language"
  />
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {LessonSchema} from "dzelda-types";
import LessonList from "@/components/shared/content/LessonList.vue";

export default defineComponent({
  name: "RecentLessonsTab",
  components: {LessonList},
  data() {
    return {
      lessons: [] as LessonSchema[],
      pageCount: 0,
      isLoading: false,
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
      this.isLoading = true;
      const response = await this.lessonStore.fetchLessons({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        sortBy: "createdDate",
        sortOrder: "desc"
      });
      this.lessons = response.data!;
      this.pageCount = response.pageCount!;
      this.isLoading = false;
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
</style>
