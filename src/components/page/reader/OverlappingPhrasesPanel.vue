<template>
  <div class="overlapping-phrase-panel">
    <h4>Overlapping phrases</h4>
    <ul>
      <li v-for="(phrase, index) in phrases"
          :key="index"
          @click="onPhraseClick(phrase)">
        {{ phrase.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {PropType} from "vue";
import {LearnerVocabSchema} from "dzelda-types";

export default {
  name: "OverlappingPhrasesPanel",
  emits: ["onPhraseClick"],
  props: {
    phrases: {type: Array as PropType<LearnerVocabSchema[]>, required: true}
  },
  methods: {
    onPhraseClick(phrase: LearnerVocabSchema) {
      this.$emit("onPhraseClick", phrase);
    }
  }
};
</script>

<style scoped>
.overlapping-phrase-panel {
  background-color: #f0f9fe;
  height: 100%;
  padding: 1vw;
  border-radius: 10px;
}

h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

li {
  margin-bottom: 0.75rem;
  font-size: 1rem;

}

li:hover {
  cursor: pointer;
}

</style>
