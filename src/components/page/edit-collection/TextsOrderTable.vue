<template>
  <div class="table-wrapper styled-scrollbars">
    <table id="text-table" class="">
      <thead>
      <tr>
        <th class="centered-col">Drag</th>
        <th>Title</th>
      </tr>
      </thead>

      <VueDraggable tag="tbody"
                    class="text-tbody"
                    handle=".handle"
                    animation="200"
                    ghostClass="ghost"
                    dragClass="invisible"
                    :modelValue="modelValue"
                    @update:model-value="newValue => $emit('update:modelValue',newValue)">
        <tr v-for="text in modelValue" :key="text.id">
          <td class="handle centered-col">
            <inline-svg :src="icons.dragBars"/>
          </td>
          <td>
            {{ text.title }}
          </td>
        </tr>
      </VueDraggable>
    </table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {PropType} from "vue";
import {VueDraggableNext as VueDraggable} from "vue-draggable-next";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import type {TextSchema} from "dzelda-common";

export default defineComponent({
  name: "TextsOrderTable",
  components: {InlineSvg, VueDraggable},
  props: {modelValue: {type: Object as PropType<TextSchema[] | undefined>}},
  data() {
    return {};
  },
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
.table-wrapper {
  overflow: auto;
  max-height: 200px;
}

#text-table {
  font-size: 1rem;
  width: 100%;
}

thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}

tbody:before {
  content: "-";
  display: block;
  line-height: 0.5rem;
  visibility: hidden;
}

th {
  text-align: start;
  vertical-align: middle;
  font-weight: bold;
}

th {
  padding: 0.1rem 1rem;
}

.text-tbody tr:nth-child(odd) {
  background-color: var(--zebra-stripe-color);
}

.text-tbody {
}

td {
  vertical-align: middle;
  padding: 0.5rem 1rem;
}

a, a:visited {
  color: black;
}

.centered-col {
  text-align: center;
}

.handle:hover {
  cursor: pointer;
}
</style>
