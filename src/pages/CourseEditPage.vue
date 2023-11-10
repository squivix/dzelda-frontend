<template>
  <BaseCard title="Edit Course" class="edit-course-base-card">
    <template v-slot:content>
      <form class="edit-course-form" v-if="course" @submit.prevent="onSubmit">
        <BaseImageUploadInput :path="course!.image" :fallback="icons.courseBlank" v-model="image"/>

        <div class="inputs-div">
          <label for="course-title">Title</label>
          <input id="course-title" type="text" placeholder="Course Title" v-model="title" required>
          <label for="course-description">Description</label>
          <textarea id="course-description" placeholder="Course Description" v-model="description"></textarea>

          <label for="lesson-table">Lessons</label>
          <table id="lesson-table" class="">
            <thead class="lesson-thead">
            <th class="centered-table-col"><input type="checkbox" @change="selectAllLessons"></th>
            <th class="centered-table-col"></th>
            <th>Title</th>
            </thead>

            <draggable
                tag="tbody"
                class="lesson-rows"
                handle=".handle"
                v-model="lessons">
              <tr v-for="lesson in lessons" :key="lesson.id">
                <td class="centered-table-col">
                  <input type="checkbox" :value="lesson.id" v-model="selectedLessons">
                </td>
                <td class="handle centered-table-col">
                  <inline-svg :src="icons.dragBars"/>
                </td>
                <td>
                  <router-link
                      :to="{name:'edit-lesson', params:{learningLanguage:$route.params.learningLanguage, lessonId:lesson.id}}"
                      class="inv-link">
                    {{ lesson.title }}
                  </router-link>
                </td>
              </tr>
            </draggable>
          </table>


          <label for="is-public-checkbox" class="checkbox-label">
            <input type="checkbox" id="is-public-checkbox" v-model="isPublic" checked>
            Public
          </label>
          <button id="save-button" type="submit" class="primary-filled-button capsule-button">Save</button>
        </div>
      </form>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {VueDraggableNext} from "vue-draggable-next";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import BaseImage from "@/components/ui/BaseImage.vue";
import {CourseSchema, LessonSchema} from "dzelda-types";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import BaseImageUploadInput from "@/components/ui/BaseImageUploadInput.vue";

export default {
  name: "CourseEditPage",
  components: {
    BaseImageUploadInput,
    InlineSvg,
    BaseImage,
    BaseCard,
    draggable: VueDraggableNext,
  },
  data() {
    return {
      title: null as string | null,
      description: null as string | null,
      isPublic: true,
      level: null as ('beginner1' | 'beginner2' | 'intermediate1' | 'intermediate2' | 'advanced1' | 'advanced2' | null),
      lessons: null as LessonSchema[] | null,
      selectedLessons: [],
      image: undefined as File | "" | undefined,
      course: null as CourseSchema | null
    };
  },
  methods: {
    onSubmit() {
      this.editCourse();
      this.$router.push({name: "course", ...this.$route.params});
    },
    async editCourse() {
      await this.courseStore.updateCourse(
          {courseId: Number(this.$route.params.courseId as string)},
          {
            title: this.title,
            description: this.description,
            level: this.level,
            isPublic: this.isPublic,
            lessonsOrder: this.lessons.map(lesson => lesson.id),
            image: this.image
          }
      );
    },

    selectAllLessons(event) {
      if (event.target.checked)
        this.selectedLessons = this.lessons.map((lesson) => lesson.id);
      else
        this.selectedLessons = [];
    },
    async fetchCourse() {
      return await this.courseStore.fetchCourse({
        courseId: this.$route.params.courseId,
      });
    },

  },
  async mounted() {
    const course = await this.fetchCourse();
    this.course = course;
    this.title = course.title;
    this.level = course.level;
    this.description = course.description;
    this.isPublic = course.isPublic;
    this.lessons = course.lessons;
  },
  setup() {
    return {
      icons,
      courseStore: useCourseStore(),
    };
  }
};
</script>

<style scoped>

.edit-course-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
  width: 70vw;
}

.edit-course-base-card:deep(header) {
  margin-bottom: 1rem;
}

.edit-course-form {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
}

.inputs-div {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.edit-course-form label {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.edit-course-form input:not([type='checkbox']), .edit-course-form select, .edit-course-form textarea, #lesson-table {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.checkbox-label {
  margin-bottom: 1rem;
}

#save-button {
  align-self: flex-start;
}

#course-description {
  resize: none;
  height: 15vh;
}

.lesson-thead th:not(.centered-table-col) {
  text-align: start;
  vertical-align: middle;
  font-weight: bold;
}

.lesson-rows tr:nth-child(odd) {
  background-color: whitesmoke;
}

.lesson-rows td {
  vertical-align: middle;
  padding: 0.5rem 0.1rem;
}

.centered-table-col {
  text-align: center;
}


</style>
