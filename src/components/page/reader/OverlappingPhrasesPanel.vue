<template>
  <div class="overlapping-phrase-panel">
    <h4>Overlapping phrases</h4>
    <ul class="phrase-list">
      <li v-for="(phraseTokens, index) in overLappingPhrasesTokens" :key="index">
        <OverlappingPhrase :phrase="phrases[phraseTokens[0].phrases[0].text]"
                           :phraseTokens="phraseTokens"
                           @onPhraseClick="onPhraseClick"/>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {PropType} from "vue";
import {LearnerVocabSchema} from "dzelda-common";
import {LessonTokenObject} from "@/pages/LessonReaderPage.vue";
import LessonToken from "@/components/page/reader/LessonToken.vue";
import {token} from "@/router/queryParams.js";
import OverlappingPhrase from "@/components/page/reader/OverlappingPhrase.vue";

export default {
  name: "OverlappingPhrasesPanel",
  computed: {
    token() {
      return token;
    }
  },
  components: {OverlappingPhrase, LessonToken},
  emits: ["onPhraseClick"],
  props: {
    overLappingPhrasesTokens: {type: Array as PropType<LessonTokenObject[][]>, required: true},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
  },
  methods: {
    onPhraseClick(phraseTokens: LessonTokenObject[]) {
      this.$emit("onPhraseClick", phraseTokens);
    }
  }
};
</script>

<style scoped>
.overlapping-phrase-panel {
  background-color: var(--primary-faint-color);
  height: 100%;
  padding: 1vw;
  border-radius: 10px;
}

h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

ul {
  display: flex;
  flex-direction: column;
  max-height: 1000px;
  list-style: inside;
}

li {
  font-size: 1rem;
  line-height: 2.75rem;
}


</style>
