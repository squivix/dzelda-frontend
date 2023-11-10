<template>
  <BaseCard v-if="!loading && course" :title="course.title" class="course-base-card">
    <template v-slot:all>
      <header>
        <h1>{{ course.title }}</h1>
        <button class="bookmark-button inv-button" @click="toggleCourseIsBookmarked">

          <inline-svg :src="icons.bookmark"
                      :class="`${course.isBookmarked?'bookmark-filled':'bookmark-hollow'}`"/>
        </button>
      </header>
      <p>{{ course.description }}</p>
      <h2>Lessons</h2>
      <ol class="lesson-list">
        <li v-for="lesson in course.lessons" :key="lesson.id" class="lesson">
          <LessonListItem :lesson="{...lesson, course}" :show-course="false">
          </LessonListItem>
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
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default {
  name: "CoursePage",
  components: {InlineSvg, LessonListItem, BaseCard},
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
    async toggleCourseIsBookmarked() {
      if (this.course!.isBookmarked)
        await this.courseStore.removeCourseFromUserBookmarks({courseId: this.course!.id});
      else
        await this.courseStore.addCourseToUserBookmarks({courseId: this.course!.id});
      this.course!.isBookmarked = !this.course!.isBookmarked;
    },
  },
  setup() {
    return {
      icons,
      courseStore: useCourseStore(),
      lessonStore: useLessonStore()
    };
  }
};
</script>

<style scoped>
.course-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  justify-content: flex-start;
  align-items: stretch;
  width: 70vw;
}

header {
  display: flex;
  justify-content: space-between;
}

.bookmark-button:hover {
  cursor: pointer;
}

.bookmark-button svg {
  width: 20px;
  height: 20px;
  overflow: visible;
}

.bookmark-filled {
  fill: var(--primary-color);
  stroke: var(--primary-color);
}

.bookmark-hollow {
  fill: none;
  stroke-width: 56px;
  stroke: var(--primary-color);
}

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.5rem;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

</style>
