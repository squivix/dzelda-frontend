<template>
  <BaseCard v-if="!loading && course" :title="course.title" class="course-base-card">
    <template v-slot:content>
      <ol class="lesson-list">
        <li v-for="lesson in course.lessons" :key="lesson.id" class="lesson">
          <lesson-list-item :lesson="{...lesson, course}" :show-course="false">
          </lesson-list-item>
        </li>
      </ol>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {CourseSchema} from "dzelda-types";

export default {
  name: "CoursePage",
  components: {LessonListItem, BaseCard},
  data() {
    return {
      course: null as CourseSchema | null,
      loading: true,
    };
  },
  async mounted() {
    this.loading = true;
    await this.fetchCourse();
    this.loading = false;
  },
  methods: {
    async fetchCourse() {
      this.course = await this.courseStore.fetchCourse({courseId: Number(this.$route.params.courseId as string)});
    },
  },
  setup() {
    return {
      courseStore: useCourseStore(),
      lessonStore: useLessonStore()
    }
  }
}
</script>

<style scoped>
.course-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
</style>