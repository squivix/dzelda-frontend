<template>
  <base-card :title="pageTitle" class="add-edit-lesson-base-card">
    <template v-slot:content>
      <form class="add-edit-lesson-form" @submit.prevent="onSubmit">
        <div class="image-div">
          <img :src="imageUrl" class="lesson-image" alt="lesson image">
          <label for="image-input" class="image-input-label button-hollow">
            <FontAwesomeIcon icon="upload"></FontAwesomeIcon>
            Upload Image
          </label>
          <input id="image-input" type="file" accept="image/png, image/jpeg">
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

<script>
import BaseCard from "@/components/ui/BaseCard.vue";
import {useCourseStore} from "@/stores/course";
import {useLessonStore} from "@/stores/lesson";
import {useProfileStore} from "@/stores/profile.js";
import {useStore} from "@/stores/index.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "LessonAddEditPage",
  components: {BaseCard, FontAwesomeIcon},
  computed: {
    pageTitle() {
      return this.lesson === null ? "Add Lesson" : "Edit Lesson";
    },
    imageUrl() {
      if (this.lesson?.image)
        return this.lesson.image;
      else
        return this.defaultImageUrl;
    },
    defaultImageUrl() {
      return `${this.store.baseUrl}/media/blank-image.png`;
    }
  },
  data() {
    return {
      lesson: null,
      editableCourses: null,
      selectedCourse: "",
      title: "",
      text: "",
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
        //TODO replace me with username
        languageCode: this.$route.params.learningLanguage,
        editableBy: (await this.profileStore.fetchUserProfile()).username,
      });
      this.editableCourses = response.results;
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
        courseId: this.selectedCourse,
        title: this.title,
        text: this.text,
      });

    },

    async editLesson() {
      await this.lessonStore.updateLesson({
        lessonId: this.$route.params.lessonId,
        courseId: this.selectedCourse,
        title: this.title,
        text: this.text,
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
      this.selectedCourse = this.lesson.course;
      this.title = this.lesson.title;
      this.text = this.lesson.text;
    }
  },
  created() {
    this.store = useStore();
    this.courseStore = useCourseStore();
    this.lessonStore = useLessonStore();
    this.profileStore = useProfileStore();
  }
}


</script>

<style scoped>
.add-edit-lesson-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
}

.add-edit-lesson-base-card:deep(header) {
  margin-bottom: 1rem;
}

.lesson-image {
  width: 200px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
}

.add-edit-lesson-form {
  display: flex;
  column-gap: 1rem;
}

.add-edit-lesson-form .image-div {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.add-edit-lesson-form .other-div {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.image-input-label {
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