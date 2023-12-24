<template>
  <div @click="onBackgroundClicked" class="lesson-content" @mouseup="emptyTextSelection">
    <div class="top-div">
      <BaseImage :image-url="image" :fall-back-url="icons.bookOpen"
                 alt-text="lesson image" class="lesson-image"/>
      <LessonParagraph class="title"
                       :lesson-elements="lessonElements.title"
                       :words="words"
                       :phrases="phrases"
                       :paragraph-index="0"
                       component="h2"
                       @onWordClicked="onWordClicked"
                       @onPhraseClicked="onPhraseClicked"
                       @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"/>
    </div>
    <div class="lesson-text styled-scrollbars" @scroll="onTextScroll">
      <LessonParagraph :lesson-elements="lessonElements.text"
                       :words="words"
                       :phrases="phrases"
                       :paragraph-index="1"
                       @onWordClicked="onWordClicked"
                       @onPhraseClicked="onPhraseClicked"
                       @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"/>
    </div>
  </div>
</template>

<script lang="ts">
import LessonParagraph from "@/components/page/reader/LessonParagraph.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import {icons} from "@/icons.js";
import {PropType} from "vue";
import {LessonElement} from "@/pages/LessonReaderPage.vue";
import {LearnerVocabSchema} from "dzelda-types";
import InlineSvg from "vue-inline-svg";
import {getTextSelectedElements} from "@/utils.js";
import {useEventListener} from "@vueuse/core";

export default {
  name: "TheLessonContent",
  components: {InlineSvg, BaseImage, LessonParagraph},
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked", "onNewPhraseSelected", "onBackgroundClicked", "onScroll"],
  props: {
    title: {type: String, required: true,},
    text: {type: String, required: true,},
    image: {type: String, required: true,},
    audio: {type: String, required: false,},
    words: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true,},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    lessonElements: {type: Object as PropType<{ title: LessonElement[], text: LessonElement[] }>, required: true},
  },
  data() {
    return {
      isSelectingPhraseText: false,
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
    onBackgroundClicked() {
      if (!this.isSelectingPhraseText) {
        this.clearSelectedPhrases();
        this.$emit("onBackgroundClicked");
      }
      this.isSelectingPhraseText = false;
    },
    onNewPhraseSelected(phraseText: string) {
      this.$emit("onNewPhraseSelected", phraseText);
    },
    onTextScroll(event: Event) {
      const lessonTextDiv = event.target as HTMLElement;
      let position: "top" | "bottom" | "middle";
      if (lessonTextDiv.scrollTop == 0)
        position = "top";
      else if (Math.abs(lessonTextDiv.scrollHeight - lessonTextDiv.scrollTop - lessonTextDiv.clientHeight) < 1)
        position = "bottom";
      else
        position = "middle";
      this.$emit("onScroll", position);
    },
    clearSelectedPhrases() {
      document.querySelectorAll(".phrase-selected").forEach((el) => el.classList.remove("phrase-selected"));
    },
    onSelectionChange() {
      const selectedWrappers = getTextSelectedElements(getSelection()!)?.filter(e => e.classList.contains("word-wrapper"));
      if (!selectedWrappers || selectedWrappers.length < 2)
        return

      this.clearSelectedPhrases()
      let phraseText = "";
      for (const wrapperElement of selectedWrappers) {
        wrapperElement.classList.add("phrase-selected")
        const wordNode = wrapperElement.childNodes[0] as HTMLElement;
        if (wordNode.classList.contains("word"))
          phraseText += wordNode.innerText.toLowerCase() + " ";
      }
      this.isSelectingPhraseText = true;
      if (this.words[phraseText])
        this.onWordClicked(phraseText);
      //new phrase
      else if (!this.phrases[phraseText])
        this.onNewPhraseSelected(phraseText);
      else
        this.onPhraseClicked(phraseText);
    },
    emptyTextSelection() {
      getSelection()?.empty();
    }
  },
  mounted() {
    useEventListener(document, "selectionchange", this.onSelectionChange)
  },
  setup() {
    return {icons};
  }
}
;
</script>
<style scoped>
.lesson-content {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.top-div {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
}

.lesson-image {
  width: 150px;
  height: 150px;
}

.title {
  font-size: 1.5rem;
  line-height: 2.5rem;
}

.lesson-text {
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 0.5rem;
  min-height: 100px;
}

p {
  font-size: 1.15rem;
  line-height: 2.5rem;
}

@media screen and (max-width: 800px) {
  .lesson-image {
    width: 100px;
    height: 100px;
  }

  .title {
    font-size: 1.5rem;
    line-height: 2.5rem;
  }

}

@media screen and (max-width: 400px) {
  .top-div {
    flex-direction: column;
    align-items: center;
    row-gap: 0.5rem;
  }
}
</style>
