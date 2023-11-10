<template>
  <LoadingScreen v-if="isLoading"/>
  <div class="wrapper">
    <EmptyScreen v-if="!lessons||lessons.length==0" :message="emptyMessage"/>
    <ul v-if="lessons" class="lessons-list">
      <LessonListItem v-for="lesson in lessons" :key="lesson.id" :lesson="lesson"/>
    </ul>
    <PaginationControls v-if="pageCount"
                        :page="page"
                        :page-size="pageSize"
                        :page-count="pageCount"
                        perPageSelectLabel="Lessons Per Page"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import {LessonSchema} from "dzelda-types";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";

export default defineComponent({
  name: "LessonList",
  components: {EmptyScreen, LoadingScreen, PaginationControls, LessonListItem},
  props: {
    lessons: {type: Object as PropType<LessonSchema[] | null>, required: true},
    isLoading: {type: Boolean, required: true},
    page: {type: Number},
    pageSize: {type: Number},
    pageCount: {type: Number, required: true},
    emptyMessage: {type: String, required: false, default: "No lessons found."}
  }
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.lessons-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}
</style>
