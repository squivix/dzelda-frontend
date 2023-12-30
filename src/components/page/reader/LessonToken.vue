<template>
    <span :class="wrapperClass"
          @click.stop="onWrapperClicked($event.target as HTMLElement)"
          @mouseenter="wrapperHoverStart"
          @mouseleave="wrapperHoverEnd">
      <span :class="wordClass"
            v-if="token.isWord"
            :data-parsed-text="token.parsedText"
            @click.stop="onWordClicked($event)">
          {{ token.text }}
      </span>
      <span @click.stop="onWrapperClicked($event.target as HTMLElement)" v-else>
        <br v-if="token.text=='\n'">
        <template v-else>
            {{ token.text }}
        </template>
      </span>
    </span>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {LearnerVocabSchema, VocabLevelSchema} from "dzelda-common";
import {ALL_VOCAB_LEVELS} from "@/constants.js";
import {LessonTokenObject} from "@/pages/LessonReaderPage.vue";


export default defineComponent({
  name: "LessonToken",
  props: {
    token: {type: Object as PropType<LessonTokenObject>, required: true},
    word: {type: Object as PropType<LearnerVocabSchema>, required: false},
    phrases: {type: Object as PropType<LearnerVocabSchema[]>, required: false},
    isPhraseFirstClick: {type: Boolean, required: true},
  },
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked", "setIsPhraseFirstClick"],
  computed: {
    wrapperClass() {
      const classes = ["word-wrapper"];
      if (this.phrasesCount != 0) {
        classes.push("phrase");
        classes.push(...this.token.phrases.map(p => `phrase-${p.phraseId}-${p.phraseOccurrenceIndex}`));
        classes.push(this.getLevelClass(this.phrases![0].level));
        if (!this.isPhraseFirstClick)
          classes.push("phrase-gone");
      }
      return classes.join(" ");
    },
    wordClass() {
      const classes = ["word", this.getLevelClass(this.word?.level)];
      if (this.phrasesCount == 0)
        classes.push("word-lone");
      if (!this.isPhraseFirstClick)
        classes.push("word-hovered");
      return classes.join(" ");
    },
    phrasesCount() {
      return !this.phrases ? 0 : this.phrases.length;
    }
  },
  methods: {
    onWordClicked(event: Event) {
      if (this.phrasesCount == 0 || !this.isPhraseFirstClick)
        this.$emit("onWordClicked", this.word!);
      else {
        this.onWrapperClicked(event.target as HTMLElement);
        this.$emit("setIsPhraseFirstClick", false);
      }
    },
    onWrapperClicked(target: HTMLElement) {
      let wrapperDomElem = target;
      if (wrapperDomElem.parentElement!.classList.contains("word-wrapper"))
        wrapperDomElem = wrapperDomElem.parentElement!;
      if (!wrapperDomElem.classList.contains("word-wrapper"))
        return;

      if (!this.phrases || this.phrases.length == 0)
        return;
      //if word part of multiple phrases
      else if (this.phrases.length > 1)
        this.$emit("onOverLappingPhrasesClicked", this.phrases);
      else {
        if (wrapperDomElem.classList.contains("phrase-new"))
          return;
        this.$emit("onPhraseClicked", this.phrases[0]);
      }
    },
    wrapperHoverStart(event: Event) {
      const wrapperNode = event.target as HTMLElement;
      if (!wrapperNode.classList.contains("phrase") || wrapperNode.classList.contains("phrase-hovered"))
        return;
      const phrases = this.token.phrases;
      if (phrases.length === 0)
        return;
      for (const po of phrases) {
        const phraseNodes = document.querySelectorAll(`.phrase-${po.phraseId}-${po.phraseOccurrenceIndex}`);
        phraseNodes.forEach((pn) => pn.classList.add("phrase-hovered"));
        phraseNodes[0].classList.add("phrase-start");
        phraseNodes[phraseNodes.length - 1].classList.add("phrase-end");
      }
    },
    wrapperHoverEnd(event: Event) {
      this.$emit("setIsPhraseFirstClick", true);
      const wrapperNode = event.target as HTMLElement;
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
    getLevelClass(level?: VocabLevelSchema) {
      const levelMap = {
        [ALL_VOCAB_LEVELS.NEW]: "level-new",
        [ALL_VOCAB_LEVELS.LEVEL_1]: "level-1 ",
        [ALL_VOCAB_LEVELS.LEVEL_2]: "level-2 ",
        [ALL_VOCAB_LEVELS.LEVEL_3]: "level-3",
        [ALL_VOCAB_LEVELS.LEVEL_4]: "level-4",
        [ALL_VOCAB_LEVELS.LEARNED]: "level-learned",
        [ALL_VOCAB_LEVELS.KNOWN]: "level-known",
      };
      return level !== undefined ? levelMap[level] : "";
    },
  }
});
</script>

<style scoped>

span {
  user-select: text;
}

span::selection {
  background: transparent;
}

.word {
  border: 1px solid transparent;
  padding: 0.05rem 0.1rem;
  border-radius: 5px;
  user-select: auto;
}

.word-hovered:hover {
  border: 1px solid darkblue;
  cursor: pointer;
}

.word-lone:hover {
  border: 1px solid darkblue;
  cursor: pointer;
}

.level-new:not(.phrase) {
  background-color: #aee0f4;
}

/*.level-new.phrase:hover {
  background-color: ghostwhite;
  cursor: default !important;
}*/

.level-1 {
  background-color: #ffeda1;
}

.level-2 {
  background-color: #fff2ab;
}

.level-3 {
  background-color: #fff6c7;
}

.level-4 {
  background-color: transparent;
  border-bottom: 1px dotted black;
}

/*.level-known,
.level-learned,
.level-ignored {
  background-color: transparent;
}*/

.word-wrapper {
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  border: 1px solid transparent;
}

.phrase:hover {
  cursor: pointer;
}

.phrase {
  transition: padding 0.35s ease-out;
}

.phrase-start {
  border-start-start-radius: 5px;
  border-end-start-radius: 5px;
}


.phrase-end {
  border-end-end-radius: 5px;
  border-start-end-radius: 5px;
}

.phrase-start.phrase-hovered {
  border-inline-start: 1px solid;
}


.phrase-end.phrase-hovered {
  border-inline-end: 1px solid;
}

.phrase-start:not(.phrase-hovered) {
  border-inline-start: 1px solid transparent;
}

.phrase-end:not(.phrase-hovered) {
  border-inline-end: 1px solid transparent;
}

.phrase-selected {
  background-color: #268AFA;
}

.phrase-hovered {
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
</style>
