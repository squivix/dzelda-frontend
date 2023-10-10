<template>
  <base-card title="Edit Course" class="edit-course-base-card">
    <template v-slot:content>
      <form class="edit-course-form" @submit.prevent="onSubmit">
        <div class="file-inputs-div">
          <base-image :image-url="imageUrl" :fall-back-url="assets.courseBlank" class="course-image"
                      alt-text="course image"></base-image>
          <label for="image-input" class="file-input-label button-hollow">
            <FontAwesomeIcon icon="upload"></FontAwesomeIcon>
            Upload Image
          </label>
          <input id="image-input" type="file" accept="image/png, image/jpeg" @change="setImageFile" class="file-input">
        </div>

        <div class="other-inputs-div">
          <label for="course-title">Title</label>
          <input id="course-title" type="text" placeholder="Course Title" v-model="title" required>
          <label for="course-description">Description</label>
          <textarea id="course-description" placeholder="Course Description" v-model="description"></textarea>

          <!--TODO:make into component with auto complete -->
          <!--<label for="course-tags">Tags</label>-->
          <!--<input id="course-tags" placeholder="Course Tags">-->


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
                  <font-awesome-icon icon="grip-lines"></font-awesome-icon>
                </td>
                <td>
                  <router-link
                      :to="{name:'edit-lesson', params:{learningLanguage:$route.params.learningLanguage, lessonId:lesson.id}}">
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
  </base-card>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {VueDraggableNext} from "vue-draggable-next";
import {useCourseStore} from "@/stores/backend/courseStore.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import BaseImage from "@/components/ui/BaseImage.vue";
import courseBlank from "@/assets/images/course-blank.svg";
import {LessonSchema} from "dzelda-types";

export default {
  name: "CourseEditPage",
  components: {
    BaseImage,
    BaseCard,
    draggable: VueDraggableNext,
    FontAwesomeIcon
  },
  data() {
    return {
      title: null as string | null,
      description: null as string | null,
      isPublic: true,
      lessons: null as LessonSchema[] | null,
      selectedLessons: [],
      image: null as File | null,
      imageUrl: "",
    };
  },
  methods: {
    setImageFile(event: Event) {
      this.image = event.target.files[0];
      // noinspection JSUnresolvedFunction
      this.imageUrl = URL.createObjectURL(this.image);
    },
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
    this.title = course.title;
    this.description = course.description;
    this.isPublic = course.isPublic;
    this.imageUrl = course.image ?? "";
    this.lessons = course.lessons;
  },
  setup() {
    return {
      courseStore: useCourseStore(),
      assets: {courseBlank}
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

.file-inputs-div {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.other-inputs-div {
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

input[type="file"] {
  display: none;
}

.course-image {
  width: 200px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
}

.file-input-label {
  font-size: 0.5rem;
}
</style>
