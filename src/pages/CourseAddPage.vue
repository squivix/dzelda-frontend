<template>
  <BaseCard title="Add Course" class="add-course-base-card main-page-base-card">
    <template v-slot:content>
      <form class="add-course-form" @submit.prevent="onSubmit">
        <div class="image-section">
          <ImageUploadInput id="course-image-input" name="course image" :fallback="icons.books" v-model="image"
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

          <SubmitButton id="save-button"
                        type="submit"
                        class="primary-filled-button capsule-button"
                        :is-submitting="isSubmitting">
            {{ submittingMessage ?? "Save" }}
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
import {useStore} from "@/stores/backend/rootStore.js";

export default {
  name: "CourseAddPage",
  components: {SubmitButton, ImageUploadInput, InlineSvg, BaseCard, BaseImage},
  data() {
    return {
      title: "",
      description: "",      image: undefined as Blob | undefined,
      errorFields: {title: "", description: "", image: ""},
      isSubmitting: false,
      submittingMessage: undefined as string | undefined,
    };
  },
  watch: {
    isSubmitting() {
      if (!this.isSubmitting)
        this.submittingMessage = undefined;
    }
  },
  methods: {
    async onSubmit() {
      this.isSubmitting = true;
      this.errorFields = {title: "", description: "", image: ""};
      let imageUrl;
      if (this.image) {
        this.submittingMessage = "Uploading image";
        imageUrl = await this.store.uploadFile({
          fileField: "courseImage",
          fileExtension: "jpg",
          file: new File([this.image], "image.jpg"),
        });
        if (!imageUrl) {
          this.isSubmitting = false;
          return;
        }
      } else
        imageUrl = this.image;
      this.submittingMessage = "Creating course";
      const response = await this.courseStore.createCourse({
        languageCode: this.$route.params.learningLanguage as string,
        title: this.title,
        description: this.description,
        image: imageUrl,
      });
      this.isSubmitting = false;
      if (response.ok) {
        const newCourse = response.data;
        await this.$router.push({name: "edit-course", params: {courseId: newCourse.id}});
      } else {
        if ("fields" in response.error)
          this.errorFields = response.error.fields as { title: string, description: string, image: string };
      }
    },

  },
  setup() {
    return {
      icons,
      store: useStore(),
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

.image-section {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

@media screen and (max-width: 750px) {
  .add-course-form {
    flex-direction: column;
  }
}
</style>
