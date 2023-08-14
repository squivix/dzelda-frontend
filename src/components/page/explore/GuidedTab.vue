<template>
  <div>
    <ol v-if="guidedCourses" class="course-list">
      <course-card v-for="course in guidedCourses" :key="course.id" :course="course"></course-card>
    </ol>
  </div>
</template>

<script lang="ts">
import CourseCard from "@/components/shared/content/CourseCard.vue";
import {useCourseStore} from "@/stores/courseStore.js";
import constants from "@/constants.js";

export default {
  name: "GuidedTab",
  components: {CourseCard},
  data() {
    return {
      guidedCourses: null,
      constants
    };
  },
  methods: {
    async fetchGuidedCourses() {
      const response = await this.courseStore.fetchCourses({
        languageCode: this.$route.params.learningLanguage,
        addedBy: GUIDED_USERNAME,
      });
      this.guidedCourses = response.results;
      this.$emit("onPageFetched", Math.ceil(response.count / this.$query.maxPerPage));
    }
  },
  async mounted() {
    await this.fetchGuidedCourses();
  },
  created() {
    this.courseStore = useCourseStore();
  }
};
</script>

<style scoped>

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 0.75rem;
}

.course-list li {
  max-width: 400px;
}
</style>