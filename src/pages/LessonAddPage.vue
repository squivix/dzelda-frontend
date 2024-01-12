<template>
  <BaseCard title="Add Lesson" class="add-lesson-base-card main-page-base-card">
    <template v-slot:content>
      <form class="add-lesson-form" @submit.prevent="addLesson">
        <div class="side-inputs">
          <div class="form-row">
            <label>Image</label>
            <ImageUploadInput id="lesson-image-input" fileTitle="lesson image" :fallback="icons.bookOpen"
                              v-model="image"
                              :maxFileSizeInBytes="500_000"/>
            <p v-if="errorFields.image" class="error-message">{{ errorFields.image }}</p>
          </div>
          <div class="form-row">
            <label>Audio</label>
            <AudioUploadInput id="lesson-audio-input" fileTitle="lesson audio" v-model="audio"
                              :maxFileSizeInBytes="100_000_000"/>
            <p v-if="errorFields.audio" class="error-message">{{ errorFields.audio }}</p>
          </div>
        </div>
        <div class="main-inputs">
          <div class="form-row">
            <label for="lesson-course">Course</label>
            <select required id="lesson-course" v-model="selectedCourse">
              <option value="" disabled selected>Select course</option>
              <option v-for="course in editableCourses" :key="course.id" :value="course.id">{{ course.title }}</option>
              <option>New Course</option>
            </select>
            <p v-if="errorFields.courseId" class="error-message">{{ errorFields.courseId }}</p>
          </div>
          <div class="form-row">
            <label for="lesson-title">Title</label>
            <input id="lesson-title" type="text" placeholder="Lesson Title" v-model="title" required maxlength="124">
            <p v-if="errorFields.title" class="error-message">{{ errorFields.title }}</p>
          </div>
          <div class="form-row">
            <label for="lesson-text">Text</label>
            <textarea placeholder="Lesson Text" id="lesson-text" v-model="text" required></textarea>
            <p v-if="text.length>10_000" class="warning-message">Long lessons are always slower, consider splitting into
              multiple lessons</p>
            <p v-if="errorFields.text" class="error-message">{{ errorFields.text }}</p>
          </div>
          <div class="buttons-div">
            <SubmitButton id="save-and-open-button"
                          type="submit"
                          class="primary-filled-button capsule-button"
                          :is-submitting="isSubmitting">
              Save & open
            </SubmitButton>
          </div>
        </div>
      </form>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {useStore} from "@/stores/backend/rootStore.js";
import {CourseSchema} from "dzelda-common";
import {useUserStore} from "@/stores/backend/userStore.js";
import {icons} from "@/icons.js";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import {PropType} from "vue";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import AudioUploadInput from "@/components/shared/AudioUploadInput.vue";

export default {
  name: "LessonAddPage",
  components: {AudioUploadInput, ImageUploadInput, SubmitButton, BaseCard},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string }>, required: true},
    queryParams: {type: Object as PropType<{ courseId?: number }>, required: true}
  },
  data() {
    return {
      editableCourses: null as CourseSchema[] | null,
      selectedCourse: "" as number | "",
      title: "",
      text: "",
      image: undefined as Blob | undefined,
      audio: undefined as File | undefined,
      audioUrl: null as string | null,
      isSubmitting: false,
      errorFields: {title: "", text: "", image: "", audio: "", courseId: ""},
    };
  },
  watch: {
    selectedCourse(newVal) {
      if (newVal === "New Course")
        this.$router.push({name: "add-course"});
    }
  },
  methods: {
    async fetchEditableCourses() {
      const response = await this.courseStore.fetchCourses({
        languageCode: this.pathParams.learningLanguage,
        addedBy: "me",
      }, {secure: true});
      this.editableCourses = response.data;
    },
    async addLesson() {
      this.errorFields = {title: "", text: "", image: "", audio: "", courseId: ""};
      this.isSubmitting = true;
      let imageUrl, audioUrl;
      if (this.image)
        imageUrl = await this.store.uploadFile({
          fileField: "lessonImage",
          fileExtension: "jpg",
          file: new File([this.image], "image.jpg"),
        });
      else
        imageUrl = this.image;
      if (this.audio)
        audioUrl = await this.store.uploadFile({
          fileField: "lessonAudio",
          fileExtension: "mp3",
          file: this.audio
        });
      else
        audioUrl = this.audio;

      const response = await this.lessonStore.createLesson({
        courseId: this.selectedCourse as number,
        title: this.title,
        text: this.text,
        image: imageUrl,
        audio: audioUrl
      });
      this.isSubmitting = false;
      if (response.ok) {
        const lesson = response.data;
        await this.$router.push({
          name: "lesson",
          params: {lessonId: lesson.id}
        });
      } else {
        if ("fields" in response.error)
          this.errorFields = response.error.fields as {
            title: string, text: string,
            courseId: string, image: string, audio: string,
          };
      }
    },
  },
  async mounted() {
    await this.fetchEditableCourses();
    if (this.editableCourses!.some(course => course.id == this.queryParams.courseId))
      this.selectedCourse = this.queryParams.courseId!;
    this.$router.replace({query: {...this.queryParams, courseId: undefined}});
  },
  setup() {
    return {
      icons,
      store: useStore(),
      courseStore: useCourseStore(),
      lessonStore: useLessonStore(),
      userStore: useUserStore(),
    };
  }
};


</script>

<style scoped>
.add-lesson-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
}

.add-lesson-base-card:deep(header) {
  margin-bottom: 1rem;
}

form {
  display: flex;
  column-gap: 1rem;
}

.side-inputs {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.main-inputs {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

label {
  font-size: 1.25rem;
}

input, select, textarea {

  font-size: 1rem;
}

select {
  width: 100%;
  text-overflow: ellipsis;
}

#lesson-text {
  resize: none;
  height: 35vh;
}

.buttons-div {
  display: flex;
  flex-direction: row;
  column-gap: 0.25rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  margin-bottom: 0.5rem;
}

@media screen and (max-width: 750px) {
  .add-lesson-form {
    flex-direction: column;
  }
}
</style>
