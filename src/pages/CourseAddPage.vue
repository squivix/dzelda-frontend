<template>
  <base-card title="Add Course" class="add-course-base-card">
    <template v-slot:content>

      <form class="add-course-form" @submit.prevent="onSubmit">
        <div class="file-inputs-div">

          <base-image :image-url="imageUrl" :fall-back-url="icons.courseBlank"
                      alt-text="course image"></base-image>

          <label for="image-input" class="file-input-label inv-button">
            <inline-svg :src="icons.upload"/>
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
import {useCourseStore} from "@/stores/backend/courseStore.js";
import BaseImage from "@/components/ui/BaseImage.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default {
  name: "CourseAddPage",
  components: {InlineSvg, BaseCard, BaseImage},
  data() {
    return {
      title: "",
      description: "",
      isPublic: true,
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
    async onSubmit() {
      const newCourse = await this.addCourse();
      //TODO move this somewhere more general
      if (this.$route.query["redir"])
        await this.$router.push({path: this.$route.query["redir"]});
      else
        await this.$router.push({
          name: "edit-course",
          params: {courseId: newCourse.id, learningLanguage: this.$route.params.learningLanguage}
        });
    },

    async addCourse() {
      return this.courseStore.createCourse({
        languageCode: this.$route.params.learningLanguage as string,
        title: this.title,
        description: this.description,
        isPublic: this.isPublic,
        image: this.image,
      });
    }
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

.add-course-form label {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.add-course-form input:not([type=checkbox]), .add-course-form select, .add-course-form textarea {
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
  display: flex;
  align-items: center;
  column-gap: 1rem;
}

.file-input-label svg {
  width: 30px;
  height: 30px;
}
</style>
