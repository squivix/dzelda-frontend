<template>
    <span :class="{ 'in-view':shouldRender}" ref="tokenGroupRef">
      <LessonToken v-show="shouldRender" v-for="(token, index) in tokenGroup"
                   :key="index"
                   :token="token"
                   :word="words[token.text]"
                   :phrases="Object.keys(token.phrases).map(pt=>phrases[pt])"
                   :isPhraseFirstClick="isPhraseFirstClick"
                   @onWordClicked="onWordClicked"
                   @onPhraseClicked="onPhraseClicked"
                   @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"
                   @setIsPhraseFirstClick="setIsPhraseFirstClick"/>
        <span v-if="!shouldRender" class="placeholder" :style="{ height:`${elementHeight}px`}"></span>
    </span>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import LessonToken from "@/components/page/reader/LessonToken.vue";
import {LearnerVocabSchema} from "dzelda-types";
import {LessonTokenObject} from "@/pages/LessonReaderPage.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import {useResizeObserver, useWindowSize} from "@vueuse/core";

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
  },
  watch: {
    shouldRender() {
      if (this.windowResized && this.shouldRender)
        this.elementHeight = (this.$refs.tokenGroupRef as HTMLElement).offsetHeight;
    }
  },
  data() {
    return {
      elementHeight: 0,
      windowResized: false
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
  display: inline-block;
  border: 1px solid black;
}

.placeholder {
  display: grid;
  place-items: center;
  width: 100%;
}
</style>
