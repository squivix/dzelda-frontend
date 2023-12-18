<template>
  <BaseCard title="Add Course" class="add-course-base-card">
    <template v-slot:content>

      <form class="add-course-form" @submit.prevent="onSubmit">
        <div class="image-level-section">
          <ImageUploadInput name="course image" :fallback="icons.books" v-model="image" :maxFileSizeInBytes="500_000"/>
          <p v-if="errorFields.image" class="error-message">{{ errorFields.image }}</p>
          <div class="form-row">
            <label>Level</label>
            <select v-model="level">
              <option v-for="level in LANGUAGE_LEVELS" :value="level">{{ toSentenceCase(level) }}</option>
            </select>
          </div>
        </div>
        <div class="inputs-div">
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

          <label for="is-public-checkbox" class="checkbox-label">
            <input type="checkbox" id="is-public-checkbox" v-model="isPublic" checked>
            Public
          </label>

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
import {useCourseStore} from "@/stores/backend/courseStore.js";
import BaseImage from "@/components/ui/BaseImage.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import {LANGUAGE_LEVELS} from "@/constants.js";
import {toSentenceCase} from "@/utils.js";
import {LanguageLevelSchema} from "dzelda-types";

export default {
  name: "CourseAddPage",
  components: {SubmitButton, ImageUploadInput, InlineSvg, BaseCard, BaseImage},
  data() {
    return {
      title: "",
      description: "",
      isPublic: true,
      level: LANGUAGE_LEVELS.ADVANCED_1,
      image: undefined as Blob | undefined,
      errorFields: {title: "", description: "", image: ""},
      isSubmitting: false,
    };
  },
  methods: {
    async onSubmit() {
      this.isSubmitting = true;
      this.errorFields = {title: "", description: "", image: ""};
      const response = await this.courseStore.createCourse({
        languageCode: this.$route.params.learningLanguage as string,
        title: this.title,
        description: this.description,
        isPublic: this.isPublic,
        image: this.image,
        level: this.level as LanguageLevelSchema
      });
      this.isSubmitting = false;
      if (response.ok) {
        const newCourse = response.data;
        //TODO redir query param
        // if (this.$route.query["redir"])
        //   await this.$router.push({path: this.$route.query["redir"]});
        await this.$router.push({name: "course", params: {courseId: newCourse.id}});
      } else {
        const error = response.error;
        if (error.code == 400)
          this.errorFields = error.fields as { title: string, description: string, image: string };
        else if (error.code == 413 || error.code == 415)
          this.errorFields.image = error.message;
      }
    },

  },
  setup() {
    return {
      icons,
      LANGUAGE_LEVELS, toSentenceCase,
      courseStore: useCourseStore(),
    };
  }
};
</script>

<style scoped>

.add-course-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
  width: 70vw;
}

.add-course-base-card:deep(header) {
  margin-bottom: 1rem;
}

.add-course-form {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
}

.main-inputs {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.form-row {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-course-form label {
  font-size: 1.25rem;
}

.add-course-form input:not([type=checkbox]), .add-course-form select, .add-course-form textarea {
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

.image-level-section {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

</style>
