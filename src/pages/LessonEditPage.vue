<template>
  <BaseCard title="Edit Lesson" class="edit-lesson-base-card main-page-base-card">
    <template v-slot:content>
      <LoadingScreen v-if="!lesson"/>
      <form class="edit-lesson-form" @submit.prevent="updateLesson" v-else>
        <div class="side-inputs">
          <div class="form-row">
            <label>Image</label>
            <ImageUploadInput id="lesson-image-input" fileTitle="lesson image" :oldImageUrl="lesson.image" :fallback="icons.bookOpen"
                              v-model="image"
                              :maxFileSizeInBytes="500_000"/>
            <p v-if="errorFields.image" class="error-message">{{ errorFields.image }}</p>
          </div>
          <div class="form-row">
            <label>Audio</label>
            <AudioUploadInput id="lesson-audio-input" fileTitle="lesson audio" :oldAudioUrl="lesson.audio" v-model="audio"
                              :maxFileSizeInBytes="100_000_000"/>
            <p v-if="errorFields.audio" class="error-message">{{ errorFields.audio }}</p>
          </div>
          <div class="form-row">
            <label for="lesson-course">Course</label>
            <select required id="lesson-course" v-model="selectedCourse">
              <option :value="undefined" selected>None</option>
              <option v-for="course in editableCourses" :key="course.id" :value="course.id">{{ course.title }}</option>
              <option>New Course</option>
            </select>
            <p v-if="errorFields.courseId" class="error-message">{{ errorFields.courseId }}</p>
          </div>
          <div class="form-row">
            <label>Level</label>
            <select v-model="level">
              <option v-for="level in LANGUAGE_LEVELS" :value="level">{{ toSentenceCase(level) }}</option>
            </select>
          </div>
        </div>
        <div class="main-inputs">
          <div class="form-row">
            <label for="lesson-title">Title</label>
            <input id="lesson-title" type="text" placeholder="Lesson Title" v-model="title" required maxlength="124">
            <p v-if="errorFields.title" class="error-message">{{ errorFields.title }}</p>
          </div>
          <div class="form-row">
            <label for="lesson-text">Text</label>
            <textarea placeholder="Lesson Text" id="lesson-text" v-model="text" required></textarea>
            <p v-if="text.length>25_000" class="warning-message">Long lessons are always slower, consider splitting into
              multiple lessons</p>
            <p v-if="errorFields.text" class="error-message">{{ errorFields.text }}</p>
          </div>
          <label for="is-public-checkbox" class="checkbox-label">
            <input type="checkbox" id="is-public-checkbox" v-model="isPublic" checked>
            Public
          </label>
          <div class="buttons-div">
            <SubmitButton id="save-and-open-button"
                          type="submit"
                          class="primary-filled-button big-button capsule-button"
                          :is-submitting="isSubmitting">
              {{ submittingMessage ?? "Save" }}
            </SubmitButton>
          </div>
        </div>
      </form>
      <BaseDialog :isOpen="isCreateCourseDialogShown" @onDismissed="onCreateCourseDialogDismissed">
        <h2>Add Course</h2>
        <CourseCreateForm @onCourseCreated="onCourseCreated"/>
      </BaseDialog>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import AudioUploadInput from "@/components/shared/AudioUploadInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import CourseCreateForm from "@/components/shared/add-course/CourseCreateForm.vue";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import {CourseSchema, LanguageLevelSchema, LessonSchema} from "dzelda-common";
import {toSentenceCase} from "@/utils.js";
import path from "path";
import {icons} from "@/icons.js";
import {LANGUAGE_LEVELS} from "@/constants.js";
import {useStore} from "@/stores/backend/rootStore.js";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {useUserStore} from "@/stores/backend/userStore.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";

export default defineComponent({
  name: "LessonEditPage",
  components: {LoadingScreen, BaseDialog, ImageUploadInput, CourseCreateForm, BaseCard, SubmitButton, AudioUploadInput},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string, lessonId: number }>, required: true},
  },
  data() {
    return {
      lesson: null as LessonSchema | null,
      editableCourses: null as CourseSchema[] | null,
      selectedCourse: null as number  | null,
      title: "",
      text: "",
      level: undefined as LanguageLevelSchema | undefined,
      isPublic: true,
      image: undefined as Blob | undefined,
      audio: undefined as File | undefined,
      isSubmitting: false,
      submittingMessage: undefined as string | undefined,
      errorFields: {title: "", text: "", image: "", audio: "", courseId: ""},
      isCreateCourseDialogShown: false,
    };
  },
  watch: {
    selectedCourse(newVal) {
      if (newVal === "New Course")
        this.isCreateCourseDialogShown = true;
    },
  },
  methods: {
    toSentenceCase,
    async fetchLesson() {
      this.lesson = await this.lessonStore.fetchLesson({lessonId: this.pathParams.lessonId});
      this.title = this.lesson.title;
      this.text = this.lesson.text;
      this.level = this.lesson.level;
      this.isPublic = this.lesson.isPublic;
      this.selectedCourse = this.lesson.course?.id ?? undefined;
    },
    async fetchEditableCourses() {
      const response = await this.courseStore.fetchCourses({
        languageCode: this.pathParams.learningLanguage,
        addedBy: "me",
      }, {secure: true});
      this.editableCourses = response.data;
    },
    async updateLesson() {
      this.errorFields = {title: "", text: "", image: "", audio: "", courseId: ""};
      this.isSubmitting = true;
      let imageUrl, audioUrl;
      if (this.image) {
        this.submittingMessage = "Uploading image";
        imageUrl = await this.store.uploadFile({
          fileField: "lessonImage",
          fileExtension: ".jpg",
          file: new File([this.image], "image.jpg"),
        });
        if (!imageUrl) {
          this.isSubmitting = false;
          return;
        }
      } else
        imageUrl = this.image;
      if (this.audio) {
        this.submittingMessage = "Uploading audio";
        audioUrl = await this.store.uploadFile({
          fileField: "lessonAudio",
          fileExtension: path.extname(this.audio.name),
          file: this.audio
        });
        if (!audioUrl) {
          this.isSubmitting = false;
          return;
        }
      } else
        audioUrl = this.audio;

      this.submittingMessage = "Updating lesson";
      const response = await this.lessonStore.updateLesson({lessonId: this.lesson!.id}, {
        courseId: this.selectedCourse,
        title: this.title,
        text: this.text,
        level: this.level,
        isPublic: this.isPublic,
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
        this.submittingMessage = undefined;
        if ("fields" in response.error)
          this.errorFields = response.error.fields as {
            title: string, text: string,
            courseId: string, image: string, audio: string,
          };
      }
    },
    onCourseCreated(newCourse: CourseSchema) {
      this.isCreateCourseDialogShown = false;
      this.editableCourses!.push(newCourse);
      this.selectedCourse = newCourse.id;
    },
    onCreateCourseDialogDismissed() {
      this.isCreateCourseDialogShown = false;
      this.selectedCourse = null;
    }
  },
  async mounted() {
    await this.fetchLesson();
    await this.fetchEditableCourses();
  },
  setup() {
    return {
      icons,
      toSentenceCase,
      LANGUAGE_LEVELS,
      store: useStore(),
      courseStore: useCourseStore(),
      lessonStore: useLessonStore(),
      userStore: useUserStore(),
    };
  }
});
</script>

<style scoped>
.edit-lesson-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
}

.edit-lesson-base-card:deep(header) {
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  margin-bottom: 1rem;
}

dialog {
  width: 70vw;
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
  .edit-lesson-form {
    flex-direction: column;
  }

  .side-inputs {
    row-gap: 0.5rem;
  }
}
</style>
