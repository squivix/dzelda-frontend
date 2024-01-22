<template>
  <BaseCard title="Edit Course" class="edit-course-base-card main-page-base-card">
    <template v-slot:content>
      <LoadingScreen v-if="isLoading || !course"/>
      <form v-else class="edit-course-form" @submit.prevent="submitEditCourse">
        <div class="side-inputs">
          <ImageUploadInput id="course-image-input" :oldImagePath="course.image" name="course image"
                            :fallback="icons.books" v-model="image"
                            :maxFileSizeInBytes="500_000"/>
          <p v-if="errorFields.image" class="error-message">{{ errorFields.image }}</p>
        </div>
        <div class="main-inputs">
          <div class="form-row">
            <label for="course-title">Title</label>
            <input id="course-title" type="text" maxlength="255" placeholder="Course Title" v-model="title" required>
            <p v-if="errorFields.title" class="error-message">{{ errorFields.title }}</p>
          </div>
          <div class="form-row">
            <label for="course-description">Description</label>
            <textarea id="course-description" maxlength="500" placeholder="Course Description"
                      v-model="description"></textarea>
            <p v-if="errorFields.description" class="error-message">{{ errorFields.description }}</p>
          </div>
          <div class="form-row">
            <label for="lesson-table">Lessons</label>

            <p v-if="lessons?.length==0">No lessons in course</p>
            <LessonOrderTable v-else v-model="lessons"/>
            <router-link :to="{name:'add-lesson', query:{courseId:course.id}}" class="inv-link add-lesson-button">
              <inline-svg :src="icons.plusRound" class="empty-icon"/>
              Add lesson
            </router-link>
          </div>
          <SubmitButton id="save-button"
                        type="submit"
                        class="primary-filled-button capsule-button"
                        :is-submitting="isSubmitting">
            Save
          </SubmitButton>
        </div>
      </form>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {VueDraggableNext} from "vue-draggable-next";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import {CourseSchema, LessonSchema} from "dzelda-common";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import LessonOrderTable from "@/components/page/edit-course/LessonOrderTable.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import {PropType} from "vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {useStore} from "@/stores/backend/rootStore.js";

export default {
  name: "CourseEditPage",
  components: {
    LoadingScreen,
    EmptyScreen, LessonOrderTable, SubmitButton,
    ImageUploadInput, InlineSvg, BaseCard, draggable: VueDraggableNext,
  },
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string, courseId: number }>, required: true}
  },
  data() {
    return {
      course: null as CourseSchema | null,
      title: undefined as string | undefined,
      description: undefined as string | undefined,
      lessons: undefined as LessonSchema[] | undefined,
      image: undefined as Blob | "" | undefined,
      errorFields: {title: "", description: "", image: ""},
      isSubmitting: false,
      isLoading: false,
    };
  },
  methods: {
    async submitEditCourse() {
      this.isSubmitting = true;
      let imageUrl;
      if (this.image)
        imageUrl = await this.store.uploadFile({
          fileField: "courseImage",
          fileExtension: "jpg",
          file: new File([this.image], "image.jpg"),
        });
      else
        imageUrl = this.image;

      const response = await this.courseStore.updateCourse(
          {courseId: this.pathParams.courseId},
          {
            title: this.title!,
            description: this.description!,
            lessonsOrder: this.lessons!.map(lesson => lesson.id),
            image: imageUrl
          }
      );
      this.isSubmitting = false;
      if (response.ok)
        this.$router.push({name: "course", ...this.pathParams});
      else {
        if ("fields" in response.error)
          this.errorFields = response.error.fields as { title: string, description: string, image: string };
      }
    },
    async fetchCourse() {
      return await this.courseStore.fetchCourse({courseId: this.pathParams.courseId});
    },

  },
  async mounted() {
    this.isLoading = true;
    const course = await this.fetchCourse();
    this.isLoading = false;
    this.course = course;

    this.title = course.title;
    this.description = course.description;
    this.lessons = course.lessons;
  },
  setup() {
    return {icons, store: useStore(), courseStore: useCourseStore(),};
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
}

.edit-course-base-card:deep(header) {
  margin-bottom: 1rem;
}

.edit-course-form {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
}

.main-inputs {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

label {
  font-size: 1.25rem;
}

input:not([type='checkbox']), select, textarea {
  font-size: 1rem;
}

#save-button {
  align-self: flex-start;
}

#course-description {
  resize: none;
  height: 15vh;
}

.lessons-empty-screen > div, .add-lesson-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 0.5rem;
}

.add-lesson-button {
  color: grey;
}

.add-lesson-button svg {
  width: 30px;
  height: 30px;
}

.add-lesson-button:hover {
  color: #183153;
}


.form-row {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.side-inputs {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}


@media screen and (max-width: 750px) {
  .edit-course-form {
    flex-direction: column;
  }
}

</style>
