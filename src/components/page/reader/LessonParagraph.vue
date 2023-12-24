<template>
  <component :is="component" class="paragraph" ref="paragraphRef">
    <span v-for="(element, index) in lessonElements"
          :key="index"
          :class="getWrapperClass(element)"
          :data-parahraph-element-index="index"
          @click.stop="onWrapperClicked"
          @mouseenter="wrapperHoverStart"
          @mouseleave="wrapperHoverEnd">
      <span class="word" :class="getLevelClass(words[element.text.toLowerCase()].level)"
            :id="`w${index}`"
            v-if="element.isWord"
            @click.stop="onWordClicked(element.text)">
          {{ element.text }}
      </span>
      <span @click.stop="onWrapperClicked" v-else-if="element.text.length!=0">
        <br v-if="element.text=='\n'">
        <template v-else>
            {{ element.text }}
        </template>
      </span>

    </span>
    <br>
  </component>
</template>

<script lang="ts">
import {PropType} from "vue";
import {LearnerVocabSchema, VocabLevelSchema} from "dzelda-types";
import {LessonElement, PhrasesElementAppearsIn} from "@/pages/LessonReaderPage.vue";
import {ALL_VOCAB_LEVELS} from "@/constants.js";

export default {
  name: "LessonParagraph",
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked"],
  props: {
    lessonElements: {type: Array as PropType<LessonElement[]>, required: true},
    words: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    component: {type: String, required: false, default: "p"},
    paragraphIndex: {type: Number, required: true,}
  },
  data() {
    return {};
  },
  computed: {
    paragraphRef() {
      return this.$refs.paragraphRef as HTMLElement;
    }
  },
  methods: {
    onWordClicked(wordText: string) {
      this.$emit("onWordClicked", wordText);
    },
    onWrapperClicked(event: Event) {
      let wrapperDomElem = event.target as HTMLElement;
      if (wrapperDomElem.parentElement!.classList.contains("word-wrapper"))
        wrapperDomElem = wrapperDomElem.parentElement!;
      if (!wrapperDomElem.classList.contains("word-wrapper"))
        return;

      const paragraphElement = this.lessonElements[Number(wrapperDomElem.dataset.parahraphElementIndex)];
      let wordPhrases = Object.keys(paragraphElement.phrases);
      //if word part of multiple phrases
      if (wordPhrases.length > 1)
        this.$emit("onOverLappingPhrasesClicked", wordPhrases);
      else {
        if (wrapperDomElem.classList.contains("phrase-new"))
          return;
        let phraseText = wordPhrases[0];
        if (this.phrases[phraseText])
          this.$emit("onPhraseClicked", phraseText);
      }
    },
    getWrapperClass(element: LessonElement) {
      return `word-wrapper ${this.getPhraseIdClass(element)} ${this.getPhrasePositionClass(element)} ${this.getPhraseLevelClass(element)} ${Object.keys(element.phrases).length > 1 ? "phrase-multi" : ""}`;
    },
    getPhraseIdClass(element: LessonElement) {
      return Object.values(element.phrases).map(p => `phrase-${p.phraseId}`).join(" ");
    },
    getPhraseLevelClass(element: LessonElement) {
      if (Object.keys(element.phrases).length === 0)
        return "";
      return `phrase ${this.getLevelClass(this.phrases[Object.keys(element.phrases)[0].toLowerCase()].level)}`;
    },
    getLevelClass(level: VocabLevelSchema) {
      const levelMap = {
        [ALL_VOCAB_LEVELS.NEW]: "level-new",
        [ALL_VOCAB_LEVELS.LEVEL_1]: "level-1 ",
        [ALL_VOCAB_LEVELS.LEVEL_2]: "level-2 ",
        [ALL_VOCAB_LEVELS.LEVEL_3]: "level-3",
        [ALL_VOCAB_LEVELS.LEVEL_4]: "level-4",
        [ALL_VOCAB_LEVELS.LEARNED]: "level-learned",
        [ALL_VOCAB_LEVELS.KNOWN]: "level-known",
      };
      return levelMap[level];
    },
    getPhrasePositionClass(element: LessonElement) {
      if (Object.keys(element.phrases).length === 0)
        return "";
      let allStartWord = true, allEndWord = true;
      for (let phrase of Object.keys(element.phrases)) {
        const phraseData = element.phrases[phrase];
        if (phraseData.index !== 0)
          allStartWord = false;
        if (phraseData.index !== phraseData.length - 1)
          allEndWord = false;
      }
      if (allStartWord)
        return "phrase-start";
      else if (allEndWord)
        return "phrase-end";
      else
        return "phrase-middle";
    },
    wrapperHoverStart(event: Event) {
      const wrapperNode = event.target as HTMLElement;
      if (!wrapperNode.classList.contains("phrase") || wrapperNode.classList.contains("phrase-hovered"))
        return;
      const element = this.lessonElements[Number(wrapperNode.dataset.parahraphElementIndex)];
      const phrases = Object.values(element.phrases);
      if (phrases.length === 0)
        return;
      if (phrases.length === 1) {
        const phraseNodes = this.paragraphRef.querySelectorAll(`.phrase-${phrases[0].phraseId}`);
        phraseNodes.forEach((pn) => pn.classList.add("phrase-hovered"));
      } else {
        const phraseNodes = this.paragraphRef.querySelectorAll(phrases.map(p => `.phrase-${p.phraseId}`).join(""));
        phraseNodes.forEach((pn) => pn.classList.add("phrase-hovered"));
        // wrapperNode.classList.add("phrase-hovered");
      }
    },
    wrapperHoverEnd(event: Event) {
      const wrapperNode = event.target as HTMLElement;
      if (!wrapperNode.classList.contains("phrase"))
        return;
      const element = this.lessonElements[Number(wrapperNode.dataset.parahraphElementIndex)];
      const phrases = Object.values(element.phrases);
      if (phrases.length === 0)
        return;
      else if (phrases.length === 1) {
        const phraseNodes = this.paragraphRef.querySelectorAll(`.phrase-${phrases[0].phraseId}`);
        phraseNodes.forEach((pn) => pn.classList.remove("phrase-hovered"));
      } else {
        //TODO treat case where phrases are not in different directions
        const phraseNodes = this.paragraphRef.querySelectorAll(phrases.map(p => `.phrase-${p.phraseId}`).join(""));
        phraseNodes.forEach((pn) => pn.classList.remove("phrase-hovered"));
        // wrapperNode.classList.remove("phrase-hovered");
      }
    },
  },
};
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

.word:hover {
  border: 1px solid darkblue;
  cursor: pointer;
}

.level-new:not(.phrase) {
  background-color: #aee0f4;
}

.level-new.phrase:hover {
  /*background-color: ghostwhite;*/
  cursor: default !important;
}

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
  padding-left: 0.1rem;
  border-start-start-radius: 5px;
  border-end-start-radius: 5px;
}

.phrase-middle {
  border: 1px solid transparent;
}

.phrase-end {
  padding-right: 0.1rem;
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

.phrase-multi.phrase-hovered{
  border-top: 1px dotted;
  border-bottom: 1px dotted;
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
