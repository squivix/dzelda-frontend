<template>
  <base-card :title="pageTitle" class="add-edit-lesson-base-card" v-if="editableCourses">
    <template v-slot:content>
      <form class="add-edit-lesson-form" @submit.prevent="onSubmit">
        <div class="file-inputs-div">
          <base-image :image-url="imageUrl" :fall-back-url="assets.lessonBlank"></base-image>

          <label for="image-input" class="file-input-label button-hollow">
            <FontAwesomeIcon icon="upload"></FontAwesomeIcon>
            Upload Image
          </label>
          <input id="image-input" type="file" accept="image/png, image/jpeg" @change="setImageFile">

          <audio controls ref="audio" :src="audioUrl">
            Your browser does not support the audio element.
          </audio>
          <label for="audio-input" class="file-input-label button-hollow">
            <FontAwesomeIcon icon="upload"></FontAwesomeIcon>
            Upload Audio
          </label>
          <input id="audio-input" type="file" accept="audio/*" @change="setAudioFile">


        </div>
        <div class="other-div">
          <label for="lesson-course">Course</label>
          <select required id="lesson-course" v-model="selectedCourse">
            <option value="" disabled selected>Select course</option>
            <option v-for="course in editableCourses" :key="course.id" :value="course.id">
              {{ course.title }}
            </option>

            <option>
              New Course
            </option>
          </select>
          <label for="lesson-title">Title</label>
          <input id="lesson-title" type="text" placeholder="Lesson Title" v-model="title" required>

          <label for="lesson-text">Text</label>
          <textarea placeholder="Lesson Text" id="lesson-text" v-model="text" required></textarea>

          <div class="buttons-div">
            <button id="save-button" type="submit" class="button-hollow">Save</button>
            <button id="save-and-open-button" type="submit" class="primary-button">Save & open</button>
          </div>
        </div>
      </form>

    </template>
  </base-card>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {useStore} from "@/stores/backend/rootStore.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import BaseImage from "@/components/ui/BaseImage.vue";
import {LessonSchema} from "dzelda-types";
import lessonBlank from "@/assets/images/lesson-blank.svg"

export default {
  name: "LessonAddEditPage",
  components: {BaseImage, BaseCard, FontAwesomeIcon},
  computed: {
    pageTitle() {
      return this.$route.name !== "edit-lesson" ? "Add Lesson" : "Edit Lesson";
    },
  },
  data() {
    return {
      lesson: null as LessonSchema | null,
      editableCourses: null,
      selectedCourse: "" as "" | number,
      title: "",
      text: "",
      image: null as File | null,
      audio: null as File | null,
      imageUrl: "",
      audioUrl: null as string | null,
    };
  },
  watch: {
    selectedCourse(newVal) {
      if (newVal === "New Course")
        this.$router.push({name: "add-course"});
    }
  },
  methods: {
    setImageFile(event) {
      this.image = event.target.files[0];
      this.imageUrl = URL.createObjectURL(this.image);
    },
    setAudioFile(event) {
      this.audio = event.target.files[0];
      this.audioUrl = URL.createObjectURL(this.audio);

      this.$refs.audio.load();
    },
    async fetchEditableCourses() {
      const response = await this.courseStore.fetchCourses({
        languageCode: this.$route.params.learningLanguage,
        addedBy: (await this.profileStore.fetchUserAccount()).username,
      });
      this.editableCourses = response.data;
    },
    async onSubmit(event) {
      if (this.lesson == null)
        await this.addLesson();
      else
        await this.editLesson();

      if (event.submitter.id === "save-button") {
        await this.$router.push({
          name: "edit-lesson",
          params: {learningLanguage: this.$route.params.learningLanguage, lessonId: this.lesson.id}
        });
      } else if (event.submitter.id === "save-and-open-button") {
        await this.$router.push({
          name: "lesson",
          params: {learningLanguage: this.$route.params.learningLanguage, lessonId: this.lesson.id}
        });
      }
    },
    async addLesson() {
      this.lesson = await this.lessonStore.createLesson({
        courseId: this.selectedCourse as number,
        title: this.title,
        text: this.text,
        image: this.image,
        audio: this.audio
      });

    },

    async editLesson() {
      await this.lessonStore.updateLesson({lessonId: this.$route.params.lessonId,}, {
        courseId: this.selectedCourse,
        title: this.title,
        text: this.text,
        image: this.image,
        audio: this.audio
      });
    }
  },
  async mounted() {
    await this.fetchEditableCourses();
    if (this.$route.name === "edit-lesson") {
      this.lesson = await this.lessonStore.fetchLesson({
        lessonId: this.$route.params.lessonId,
        languageCode: this.$route.params.learningLanguage
      });
      this.selectedCourse = this.lesson.course.id;
      this.title = this.lesson.title;
      this.text = this.lesson.text;
      this.imageUrl = this.lesson?.image ?? this.lesson?.course?.image ?? "";
      this.audioUrl = this.lesson?.audio ?? "";
    }
  },
  setup() {
    return {
      store: useStore(),
      courseStore: useCourseStore(),
      lessonStore: useLessonStore(),
      profileStore: useAuthStore(),
      assets: {lessonBlank: lessonBlank}
    }
  }
};


</script>

<style scoped>
.add-edit-lesson-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
  width: 70vw;
}

.add-edit-lesson-base-card:deep(header) {
  margin-bottom: 1rem;
}

.course-image {
  width: 200px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
}

.add-edit-lesson-form {
  display: flex;
  column-gap: 1rem;
}

.add-edit-lesson-form .file-inputs-div {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.add-edit-lesson-form .other-div {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

audio {
  width: auto;
}

.file-input-label {
  border-color: var(--primary-color-dark);
  color: var(--primary-color-dark);
  text-align: center;
}


.add-edit-lesson-form label {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.add-edit-lesson-form input, .add-edit-lesson-form select, .add-edit-lesson-form textarea {
  margin-bottom: 1rem;
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

input[type="file"] {
  display: none;
}
</style>
