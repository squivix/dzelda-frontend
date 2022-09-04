<template>
  <div>
    <ul v-if="recommendedLessons" class="lessons-list">
      <lesson-list-item v-for="lesson in recommendedLessons" :key="lesson.id" :lesson="lesson"></lesson-list-item>
    </ul>
  </div>
</template>

<script>
import LessonListItem from "@/components/page/content/LessonListItem.vue";
import {useLessonStore} from "@/stores/lesson";

export default {
  name: "BrowseTab",
  components: {LessonListItem},
  emits: ["onPageFetched"],
  data() {
    return {recommendedLessons: null};
  },
  methods: {
    async fetchRecommendedLessons() {
      const response = await this.lessonStore.fetchLessons({
        languageCode: this.$route.params.learningLanguage,
        sortBy: "best",
      });
      this.recommendedLessons = response.results;
      this.$emit("onPageFetched", Math.ceil(response.count / this.$query.maxPerPage));
    }
  },
  async mounted() {
    await this.fetchRecommendedLessons();
  },
  async created() {
    this.lessonStore = useLessonStore();
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