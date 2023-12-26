<template>
  <component :is="component" class="paragraph" ref="paragraphRef">
    <TokenGroup v-for="(tokenGroup,index) in lessonTokenGroups"
                :isPhraseFirstClick="isPhraseFirstClick"
                :phrases="phrases"
                :words="words"
                :tokenGroup="tokenGroup"
                :shouldRender="getShouldRenderGroup(index)"
                @onWordClicked="onWordClicked"
                @onPhraseClicked="onPhraseClicked"
                @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"
                @setIsPhraseFirstClick="setIsPhraseFirstClick"
                @onGroupVisibilityChange="isVisible=>onGroupVisibilityChange(index, isVisible)"
    />
  </component>
</template>

<script lang="ts">
import {PropType} from "vue";
import {LearnerVocabSchema} from "dzelda-types";
import {LessonTokenObject} from "@/pages/LessonReaderPage.vue";
import LessonToken from "@/components/page/reader/LessonToken.vue";
import {chuckArray} from "@/utils.js";
import TokenGroup from "@/components/page/reader/TokenGroup.vue";

export default {
  name: "LessonParagraph",
  components: {TokenGroup, LessonToken},
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
      groupIndexToIsInView: {} as Record<number, boolean>,
      groupSize: 100,
      bufferSize: 1,
    };
  },
  computed: {
    lessonTokenGroups() {
      return chuckArray(this.lessonTokens, this.groupSize);
    }
  },
  methods: {
    getShouldRenderGroup(groupIndex: number) {
      return this.groupIndexToIsInView?.[groupIndex] || this.groupIndexToIsInView?.[groupIndex + this.bufferSize] || this.groupIndexToIsInView?.[groupIndex - this.bufferSize];
    },
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
    },
    onGroupVisibilityChange(index: number, isVisible: boolean) {
      this.groupIndexToIsInView[index] = isVisible;
    }
  },
};
</script>

<style scoped>
</style>
