<template>
  <BaseCard v-if="!loading && course" :title="course.title" class="course-base-card main-page-base-card">
    <template v-slot:content>
      <div class="page-wrapper">
        <div class="side-pane">

          <BaseImage class="course-image" :image-url="course.image" :fall-back-url="icons.books" alt-text="course image"/>
          <h3>Created by</h3>
          <p>{{ course.addedBy}}</p>
          <h3>Description</h3>
          <textarea class="description" readonly>{{ course.description }}</textarea>
          <div class="buttons-div">
            <button class="bookmark-button inv-button" @click="toggleCourseIsBookmarked">
              <inline-svg :src="icons.bookmark"
                          :class="`${course.isBookmarked?'bookmark-filled':'bookmark-hollow'}`"/>
            </button>
            <router-link :to="{ name: 'edit-course' , params:{courseId:course.id}}" v-if="course.addedBy==userStore.userAccount?.username">
              <inline-svg :src="icons.pen"/>
            </router-link>
          </div>
        </div>
        <div class="lessons-pane">
          <h2>Lessons</h2>
          <ol class="lesson-list" v-if="course.lessons.length>0">
            <li v-for="lesson in course.lessons" :key="lesson.id" class="lesson">
              <LessonListItem :lesson="{...lesson, course}" :show-course="false">
              </LessonListItem>
            </li>
          </ol>
          <EmptyScreen v-else message="No lessons in course"></EmptyScreen>
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {CourseSchema} from "dzelda-common";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {useUserStore} from "@/stores/backend/userStore.js";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import BaseImage from "@/components/ui/BaseImage.vue";

export default {
  name: "CoursePage",
  components: {BaseImage, EmptyScreen, InlineSvg, LessonListItem, BaseCard},
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
      lessonStore: useLessonStore(),
      userStore: useUserStore(),
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
}

.page-wrapper {
  display: flex;
  column-gap: 1rem;
  justify-content: space-between;
}

.side-pane {
  flex-basis: auto;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.course-image {
  align-self: center;
}

.lessons-pane {
  flex: 3;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.description {
  min-height: 15vh;
  word-wrap: break-word;
  resize: none;
  border: 1px solid lightgray;

}

.buttons-div {
  display: flex;
  column-gap: 1rem
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

h3 {
  font-weight: bold;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

@media screen and (max-width: 750px) {
  .page-wrapper {
    flex-direction: column;
  }
}
</style>
