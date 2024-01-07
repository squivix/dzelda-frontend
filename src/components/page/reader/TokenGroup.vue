<template>

  <div :class="{'in-view':shouldRender}" ref="tokenGroupRef">
    <LessonToken v-if="shouldRender" v-for="(token, index) in tokenGroup"
                 :key="index"
                 :token="token"
                 :word="words[token.parsedText!]"
                 :phrases="token.phrases.map(pt=>phrases[pt.text])"
                 :isPhraseFirstClick="isPhraseFirstClick"
                 :isWordSelected="selectedTokenIndexes.size==1 && selectedTokenIndexes.has(token.index)"
                 :isPhraseSelected="selectedTokenIndexes.size>1 && selectedTokenIndexes.has(token.index)"
                 @onWordClicked="onWordClicked"
                 @onPhraseClicked="onPhraseClicked"
                 @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"
                 @setIsPhraseFirstClick="setIsPhraseFirstClick"/>
    <span v-else class="placeholder" :style="{ height:`${elementHeight}px`}"></span>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import LessonToken from "@/components/page/reader/LessonToken.vue";
import {LearnerVocabSchema} from "dzelda-common";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import {useResizeObserver} from "@vueuse/core";
import {LessonTokenObject} from "@/pages/LessonReaderPage.vue";

export default defineComponent({
  name: "TokenGroup",
  components: {LoadingScreen, LessonToken, InlineSvg},
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked", "setIsPhraseFirstClick", "onGroupVisibilityChange"],
  props: {
    tokenGroup: {type: Array as PropType<LessonTokenObject[]>, required: true},
    words: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    isPhraseFirstClick: {type: Boolean, required: true},
    shouldRender: {type: Boolean},
    selectedTokens: {type: Array as PropType<LessonTokenObject[]>, required: true},
  },
  data() {
    return {
      elementHeight: 0,
      windowResized: false
    };
  },
  computed: {
    selectedTokenIndexes() {
      return new Set(this.selectedTokens.map(t => t.index));
    }
  },
  watch: {
    shouldRender() {
      if (this.windowResized && this.shouldRender) {
        this.elementHeight = (this.$refs.tokenGroupRef as HTMLElement).offsetHeight;
        this.windowResized = false;
      }
    },
  },
  methods: {
    onWordClicked(word: LearnerVocabSchema, wordToken: LessonTokenObject) {
      this.$emit("onWordClicked", word, wordToken);
    },
    onPhraseClicked(phrase: LearnerVocabSchema, clickedToken: LessonTokenObject) {
      this.$emit("onPhraseClicked", phrase, clickedToken);
    },
    onOverLappingPhrasesClicked(phrases: LearnerVocabSchema[], clickedToken: LessonTokenObject) {
      this.$emit("onOverLappingPhrasesClicked", phrases, clickedToken);
    },
    setIsPhraseFirstClick(isPhraseFirstClick: boolean) {
      this.$emit("setIsPhraseFirstClick", isPhraseFirstClick);
    }
  },
  mounted() {
    this.elementHeight = (this.$refs.tokenGroupRef as HTMLElement).offsetHeight;
    useResizeObserver(document.body, () => this.windowResized = true);
  },
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
.group {
  border-right: 20px solid black;
}

.placeholder {
  display: grid;
  place-items: center;
  width: 100%;
}
</style>
