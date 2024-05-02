<template>
  <BaseToken :token="token"
             :wordClass="wordClass"
             :wrapperClass="wrapperClass"
             @onWordClicked="onWordClicked"
             @onWrapperClicked="onWrapperClicked"
             @wrapperHoverStart="wrapperHoverStart"
             @wrapperHoverEnd="wrapperHoverEnd"/>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {LearnerVocabSchema, VocabLevel, VocabLevelSchema} from "dzelda-common";
import BaseToken from "@/components/page/reader/BaseToken.vue";
import {getLevelClass} from "@/utils.js";
import {TextTokenObject} from "@/components/shared/Reader.vue";
import {NEW_PHRASE_HINT_LEARNERS_THRESHOLD} from "@/constants.js";


export default defineComponent({
  name: "TextToken",
  components: {BaseToken},
  props: {
    allPhrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    token: {type: Object as PropType<TextTokenObject>, required: true},
    word: {type: Object as PropType<LearnerVocabSchema>, required: false},
    isPhraseFirstClick: {type: Boolean, required: true},
    isWordSelected: {type: Boolean, required: true},
    isPhraseSelected: {type: Boolean, required: true},
  },
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked", "setIsPhraseFirstClick"],
  computed: {
    wrapperClass() {
      const classes = ["word-wrapper"];
      if (this.phrasesCount != 0) {
        classes.push("phrase");
        classes.push(...this.token.phrases.map(p => `phrase-${p.phraseId}-${p.phraseOccurrenceIndex}`));
        classes.push(getLevelClass(Math.max(...this.phrases!.map(p => p.level)) as VocabLevelSchema));
        if (this.isPhraseSelected)
          classes.push("phrase-selected");
      }
      return classes.join(" ");
    },
    wordClass() {
      const classes = ["word", getLevelClass(this.word?.level)];
      if (this.savedPhrasesCount == 0)
        classes.push("word-lone");
      if (!this.isPhraseFirstClick)
        classes.push("word-hovered");
      if (this.isWordSelected)
        classes.push("word-selected");
      return classes.join(" ");
    },
    phrases(): Array<LearnerVocabSchema> {
      return this.token.phrases.map(p => this.allPhrases[p.text]);
    },
    savedPhrases() {
      return this.phrases?.filter(p => p.level !== VocabLevel.NEW);
    },
    savedPhrasesCount() {
      return !this.savedPhrases ? 0 : this.savedPhrases.length;
    },
    phrasesCount() {
      return !this.phrases ? 0 : this.phrases.length;
    },
  },
  methods: {
    onWordClicked(target: HTMLElement) {
      if (this.savedPhrasesCount == 0 || !this.isPhraseFirstClick)
        this.$emit("onWordClicked", this.word!, this.token);
      else {
        this.onWrapperClicked(target);
        this.$emit("setIsPhraseFirstClick", false);
      }
    },
    onWrapperClicked(target: HTMLElement) {
      let wrapperDomElem = target;
      if (wrapperDomElem.parentElement!.classList.contains("word-wrapper"))
        wrapperDomElem = wrapperDomElem.parentElement!;
      if (!wrapperDomElem.classList.contains("word-wrapper"))
        return;

      if (!this.savedPhrases || this.savedPhrases.length == 0)
        return;
      //if word part of multiple phrases
      else if (this.savedPhrases.length > 1)
        this.$emit("onOverLappingPhrasesClicked", this.savedPhrases, this.token);
      else {
        if (wrapperDomElem.classList.contains("phrase-new"))
          return;
        this.$emit("onPhraseClicked", this.savedPhrases[0], this.token);
      }
    },
    wrapperHoverStart(target: HTMLElement) {
      const wrapperNode = target;
      if (!wrapperNode.classList.contains("phrase") || wrapperNode.classList.contains("phrase-hovered"))
        return;
      const phrases = this.token.phrases;
      if (phrases.length === 0)
        return;
      const phraseMap: Record<string, LearnerVocabSchema> = {};
      this.phrases!.forEach(p => phraseMap[p.text] = p);
      for (const po of phrases) {
        if (phraseMap[po.text].level == VocabLevel.NEW && phraseMap[po.text].learnersCount < NEW_PHRASE_HINT_LEARNERS_THRESHOLD) {
          continue;
        }
        const phraseNodes = document.querySelectorAll(`.phrase-${po.phraseId}-${po.phraseOccurrenceIndex}`);
        phraseNodes.forEach((pn) => pn.classList.add("phrase-hovered"));
        phraseNodes[0].classList.add("phrase-start");
        phraseNodes[phraseNodes.length - 1].classList.add("phrase-end");
      }
    },
    wrapperHoverEnd(wrapperNode: HTMLElement) {
      // TODO only do this when the hovering goes out of phrase entirely not just its wrapper
      this.$emit("setIsPhraseFirstClick", true);
      if (!wrapperNode.classList.contains("phrase"))
        return;
      const phrases = this.token.phrases;
      if (phrases.length === 0)
        return;
      for (const po of phrases) {
        const phraseNodes = document.querySelectorAll(`.phrase-${po.phraseId}-${po.phraseOccurrenceIndex}`);
        phraseNodes.forEach((pn) => {
          pn.classList.remove("phrase-hovered");
          pn.classList.remove("phrase-start");
          pn.classList.remove("phrase-end");
        });
      }
    },
  }
});
</script>

<style scoped>

</style>
