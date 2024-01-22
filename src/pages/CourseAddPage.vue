<template>
  <BaseCard title="Add Course" class="add-course-base-card main-page-base-card">
    <template v-slot:content>
      <CourseCreateForm @onCourseCreated="redirectToEditPage"/>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import CourseCreateForm from "@/components/shared/add-course/CourseCreateForm.vue";
import {CourseSchema} from "dzelda-common";

export default {
  name: "CourseAddPage",
  components: {BaseCard, CourseCreateForm},
  methods: {
    async redirectToEditPage(newCourse: CourseSchema) {
      await this.$router.push({name: "edit-course", params: {courseId: newCourse.id}});
    }
  }

};
</script>

<style scoped>

</style>
