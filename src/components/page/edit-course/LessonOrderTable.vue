<template>
  <div>
    <table id="lesson-table" class="">
      <thead class="lesson-thead">
      <tr>
        <th class="drag-th"></th>
        <th></th>
      </tr>
      </thead>

      <VueDraggable tag="tbody"
                    class="lesson-tbody"
                    handle=".handle"
                    animation="200"
                    ghostClass="ghost"
                    dragClass="invisible"
                    :modelValue="modelValue"
                    @update:model-value="newValue => $emit('update:modelValue',newValue)">
        <tr  v-for="lesson in modelValue" :key="lesson.id">
          <td class="handle centered-table-col">
            <inline-svg :src="icons.dragBars"/>
          </td>
          <td>
            <router-link
                :to="{name:'edit-lesson', params:{learningLanguage:$route.params.learningLanguage, lessonId:lesson.id}}"
                class="inv-link">
              {{ lesson.title }}
            </router-link>
          </td>
        </tr>
      </VueDraggable>
    </table>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {VueDraggableNext as VueDraggable} from "vue-draggable-next";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {LessonSchema} from "dzelda-types";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";

export default defineComponent({
  name: "LessonOrderTable",
  components: {EmptyScreen, InlineSvg, VueDraggable},
  props: {modelValue: {type: Object as PropType<LessonSchema[] | undefined>}},
  data() {
    return {};
  },
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
#lesson-table {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.lesson-thead th:not(.centered-table-col) {
  text-align: start;
  vertical-align: middle;
  font-weight: bold;
}

th {
  padding: 0.1rem 1rem;
}

.lesson-tbody tr:nth-child(odd) {
  background-color: whitesmoke;
}

td {
  vertical-align: middle;
  padding: 0.5rem 0.1rem;
}

.centered-table-col {
  text-align: center;
}


</style>
