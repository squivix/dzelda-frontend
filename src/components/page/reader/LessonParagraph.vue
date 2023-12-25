<template>
  <component :is="component" class="paragraph" ref="paragraphRef">
    <LessonToken v-for="(token, index) in lessonTokens"
                 :key="index"
                 :token="token"
                 :word="words[token.text]"
                 :phrases="Object.keys(token.phrases).map(pt=>phrases[pt])"
                 :isPhraseFirstClick="isPhraseFirstClick"
                 @onWordClicked="onWordClicked"
                 @onPhraseClicked="onPhraseClicked"
                 @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"
                 @setIsPhraseFirstClick="setIsPhraseFirstClick"/>
    <br>
  </component>
</template>

<script lang="ts">
import {PropType} from "vue";
import {LearnerVocabSchema} from "dzelda-types";
import {LessonTokenObject} from "@/pages/LessonReaderPage.vue";
import LessonToken from "@/components/page/reader/LessonToken.vue";

export default {
  name: "LessonParagraph",
  components: {LessonToken},
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked"],
  props: {
    lessonTokens: {type: Array as PropType<LessonTokenObject[]>, required: true},
    words: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    component: {type: String, required: false, default: "p"},
  },
  data() {
    return {
      isPhraseFirstClick: true,
    };
  },
  methods: {
    onWordClicked(wordText: string) {
      this.$emit("onWordClicked", wordText);
    },
    onPhraseClicked(phraseText: string) {
      this.$emit("onPhraseClicked", phraseText);
    },
    onOverLappingPhrasesClicked(phrasesText: string[]) {
      this.$emit("onOverLappingPhrasesClicked", phrasesText);
    },
    setIsPhraseFirstClick(isPhraseFirstClick: boolean) {
      this.isPhraseFirstClick = isPhraseFirstClick;
    }
  },
};
</script>

<style scoped>
</style>
