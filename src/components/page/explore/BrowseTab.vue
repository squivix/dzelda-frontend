<template>
  <div>
    <ul v-if="recommendedLessons" class="lessons-list">
      <lesson-list-item v-for="lesson in recommendedLessons" :key="lesson.id" :lesson="lesson"></lesson-list-item>
    </ul>
  </div>
</template>

<script lang="ts">
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {LessonSchema} from "dzelda-types";
import {useQuery} from "@oarepo/vue-query-synchronizer";

export default {
  name: "BrowseTab",
  components: {LessonListItem},
  emits: ["onPageFetched"],
  data() {
    return {recommendedLessons: null as LessonSchema[] | null};
  },
  methods: {
    async fetchRecommendedLessons() {
      const response = await this.lessonStore.fetchLessons({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.maxPerPage,
        sortBy: "learnersCount",
        sortOrder: "desc"
      });
      this.recommendedLessons = response.data!;
      this.$emit("onPageFetched", Math.ceil(response.pageCount!));
    }
  },
  async mounted() {
    await this.fetchRecommendedLessons();
  },
  setup() {
    return {
      lessonStore: useLessonStore(),
      queryParams: useQuery()
    };
  }
}
</script>

<style scoped>
.lessons-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}
</style>