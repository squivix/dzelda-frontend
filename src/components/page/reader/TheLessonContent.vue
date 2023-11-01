<template>
  <div @click="onBackgroundClicked" class="lesson-content">

    <div class="top-div">
      <BaseImage :image-url="image" :fall-back-url="icons.lessonBlank"
                 alt-text="lesson image" class="lesson-image"></BaseImage>
      <LessonParagraph class="title"
                       :paragraph-elements="lessonElements.title"
                       :words="words"
                       :phrases="phrases"
                       :paragraph-index="0"
                       component="h2"
                       @onWordClicked="onWordClicked"
                       @onPhraseClicked="onPhraseClicked"
                       @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked">
      </LessonParagraph>
    </div>
    <div class="lesson-text styled-scrollbars">
      <LessonParagraph v-for="(paragraph, paragraphIndex) in lessonElements.text"
                       :paragraph-elements="paragraph"
                       :words="words"
                       :phrases="phrases"
                       :paragraph-index="paragraphIndex+1"
                       :key="paragraphIndex"
                       @onWordClicked="onWordClicked"
                       @onPhraseClicked="onPhraseClicked"
                       @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked">
      </LessonParagraph>
    </div>

    <div>
      <audio v-if="audio" controls :src="audio">
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>
</template>

<script lang="ts">
import LessonParagraph from "@/components/page/reader/LessonParagraph.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import {icons} from "@/icons.js";
import {PropType} from "vue";
import {LessonElement} from "@/pages/LessonReaderPage.vue";

export default {
  name: "TheLessonContent",
  components: {BaseImage, LessonParagraph},
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked", "onNewPhraseSelected", "onBackgroundClicked"],
  props: {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    audio: {
      type: String,
      required: false,
    },
    words: {
      type: Object,
      required: true,
    },
    phrases: {
      type: Object,
      required: true
    },
    lessonElements: {
      type: Object as PropType<{ title: LessonElement[], text: LessonElement[][] }>,
      required: true
    }
  },
  data() {
    return {
      dragStartWord: null,
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
      this.clearSelectedPhrases();
      this.$emit("onBackgroundClicked");
    },
    onNewPhraseSelected(phraseText: string) {
      this.$emit("onNewPhraseSelected", phraseText);
    },
    clearSelectedPhrases() {
      document.querySelectorAll(".phrase-selected").forEach((el) => el.classList.remove("phrase-selected"));
    },
    wrapperDrop() {
      const selectedPhrase = document.querySelectorAll(".phrase-selected");
      let phraseText = "";
      selectedPhrase.forEach((wrapperNode) => {
        const wordNode = wrapperNode.childNodes[0] as HTMLElement;
        if (wordNode.classList.contains("word"))
          phraseText += wordNode.innerText.toLowerCase() + " ";
      });
      phraseText = phraseText.trim();
      if (phraseText === "")
        return;

      //phrase is one word
      if (this.words[phraseText])
        this.onWordClicked(phraseText);
      //new phrase
      else if (!this.phrases[phraseText])
        this.onNewPhraseSelected(phraseText);
      else
        this.onPhraseClicked(phraseText);
    }
  },
  mounted() {
    document.body.addEventListener("drop", this.wrapperDrop);
    document.body.addEventListener("dragover", e => e.preventDefault());
    document.body.addEventListener("dragenter", e => e.preventDefault());
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
  row-gap: 1rem;
  user-select: none;
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
}

p {
  font-size: 1.15rem;
  line-height: 2.25rem;
}

span::selection {
  color: red;
  background: yellow;
}

</style>
