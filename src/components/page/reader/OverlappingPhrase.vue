<template>
  <BaseToken v-for="(token,index) in phraseTokens"
             :token="token"
             wordClass="word"
             :wrapperClass="[wrapperClass, {'phrase-start':index==0, 'phrase-end':index==phraseTokens.length-1}]"
             @onWrapperClicked="onWrapperClicked"
             @onWordClicked="onWrapperClicked"
             @wrapperHoverStart="onWrapperHoverStart"
             @wrapperHoverEnd="onWrapperHoverEnd"/>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {LearnerVocabSchema} from "dzelda-common";
import BaseToken from "@/components/page/reader/BaseToken.vue";
import {getLevelClass} from "@/utils.js";
import {TextTokenObject} from "@/components/shared/Reader.vue";

export default defineComponent({
  name: "OverlappingPhrase",
  components: {BaseToken},
  emits: ["onPhraseClick"],
  props: {
    phrase: {type: Object as PropType<LearnerVocabSchema>, required: true},
    phraseTokens: {type: Object as PropType<TextTokenObject[]>, required: true},
  },
  computed: {
    phraseOccurrenceIndex() {
      return this.phraseTokens[0].phrases[0].phraseOccurrenceIndex;
    },
    wrapperClass() {
      return ["word-wrapper", "phrase", this.overlappingPhraseClass, getLevelClass(this.phrase.level)].join(" ");
    },
    overlappingPhraseClass() {
      return `overlapping-phrase-${this.phrase.id}-${this.phraseOccurrenceIndex}`;
    },
    phraseInTextClass() {
      return `phrase-${this.phrase.id}-${this.phraseOccurrenceIndex}`;
    }
  },
  methods: {
    onWrapperClicked() {
      this.onWrapperHoverEnd();
      this.$emit("onPhraseClick", this.phraseTokens);
    },
    onWrapperHoverStart(target: HTMLElement) {
      const wrapperNode = target;
      if (!wrapperNode.classList.contains("phrase") || wrapperNode.classList.contains("phrase-hovered"))
        return;

      const overlappingPhraseNodes = document.querySelectorAll(`.${this.overlappingPhraseClass}`);
      overlappingPhraseNodes.forEach((pn) => pn.classList.add("phrase-hovered"));

      const inTextPhraseNodes = document.querySelectorAll(`.${this.phraseInTextClass}`);
      inTextPhraseNodes[0].classList.add("phrase-start");
      inTextPhraseNodes[inTextPhraseNodes.length - 1].classList.add("phrase-end");
      inTextPhraseNodes.forEach((pn) => pn.classList.add("phrase-hovered"));
    },
    onWrapperHoverEnd() {
      const overlappingPhraseNodes = document.querySelectorAll(`.${this.overlappingPhraseClass}`);
      overlappingPhraseNodes.forEach((pn) => pn.classList.remove("phrase-hovered"));
      const phraseNodes = document.querySelectorAll(`.${this.phraseInTextClass}`);
      phraseNodes.forEach((pn) => {
        pn.classList.remove("phrase-hovered");
        pn.classList.remove("phrase-start");
        pn.classList.remove("phrase-end");
      });
    },

  }
});
</script>

<style scoped>
</style>
