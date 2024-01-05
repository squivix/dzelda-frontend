<template>
  <div class="vocab-table-wrapper styled-scrollbars">
    <table class="vocab-table">
      <thead>
      <tr>
        <th>Vocab</th>
        <th>Meanings</th>
      </tr>
      </thead>
      <tbody class="vocab-tbody">
      <VocabTableRow v-for="vocab in vocabs" :key="vocab.id"
                     :vocab="vocab"
                     :isSelected="selectedVocab?.id==vocab.id"
                     @onVocabClicked="()=>$emit('onVocabClicked', vocab)"/>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import VocabTableRow from "@/components/page/my-vocabs/VocabTableRow.vue";
import {PropType} from "vue";
import {LearnerVocabSchema} from "dzelda-common";

export default {
  name: "VocabTable",
  emits: ["onVocabClicked"],
  components: {VocabTableRow},
  props: {
    vocabs: {type: Array as PropType<LearnerVocabSchema[]>, required: true},
    selectedVocab: {type: Object as PropType<LearnerVocabSchema | null>},
  },

  methods: {}
};
</script>

<style scoped>

.vocab-table-wrapper {
  overflow-y: auto;
  max-height: 100vh;
  min-height: 50vh;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  background-color: white;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  text-align: start;
  position: sticky;
  top: 0;
}

th:not(.centered-table-col) {
  text-align: start;
  vertical-align: middle;
  font-weight: bold;
}


@media screen and (max-width: 750px) {
  .vocab-table-wrapper {
    max-height: 300px;
  }

  .level-picker-th {
    display: none;
  }
}

</style>
