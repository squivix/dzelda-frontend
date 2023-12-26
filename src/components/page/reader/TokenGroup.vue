<template>
    <span v-intersection-observer="onIntersectionObserver" :class="{'in-view':shouldRender}" ref="tokenGroupRef">
      <template v-if="shouldRender">
        <LessonToken v-for="(token, index) in tokenGroup"
                     :key="index"
                     :token="token"
                     :word="words[token.text]"
                     :phrases="Object.keys(token.phrases).map(pt=>phrases[pt])"
                     :isPhraseFirstClick="isPhraseFirstClick"
                     @onWordClicked="onWordClicked"
                     @onPhraseClicked="onPhraseClicked"
                     @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"
                     @setIsPhraseFirstClick="setIsPhraseFirstClick"/>
      </template>
      <span v-else class="placeholder" :style="{ height:`${elementHeight}px`}">
        <inline-svg :src="icons.loadingSpinnerTailSpin"></inline-svg>
      </span>
    </span>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import LessonToken from "@/components/page/reader/LessonToken.vue";
import {LearnerVocabSchema} from "dzelda-types";
import {LessonTokenObject} from "@/pages/LessonReaderPage.vue";
import {vIntersectionObserver} from "@vueuse/components";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import {useDebounceFn} from "@vueuse/core";

export default defineComponent({
  name: "TokenGroup",
  components: {LoadingScreen, LessonToken, InlineSvg},
  directives: {intersectionObserver: vIntersectionObserver},
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked", "setIsPhraseFirstClick", "onGroupVisibilityChange"],
  props: {
    tokenGroup: {type: Array as PropType<LessonTokenObject[]>, required: true},
    words: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    isPhraseFirstClick: {type: Boolean, required: true},
    shouldRender: {type: Boolean},
  }, data() {
    return {
      elementHeight: 0,
    };
  },
  methods: {
    onIntersectionObserver([{isIntersecting}]: IntersectionObserverEntry[]) {
      if (isIntersecting)
        this.elementHeight = (this.$refs.tokenGroupRef as HTMLElement).offsetHeight;
      this.$emit("onGroupVisibilityChange", isIntersecting);
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
      this.$emit("setIsPhraseFirstClick", isPhraseFirstClick);
    }
  },
  setup() {

    return {icons};
  }
});
</script>

<style scoped>
.placeholder {
  display: grid;
  place-items: center;
  width: 100%;
}
</style>
