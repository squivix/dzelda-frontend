<template>
  <div @click="onBackgroundClicked">

    <div class="top-div">
      <img :src="image" @error="setDefaultImage" alt="lesson image" class="lesson-image">
      <lesson-paragraph class="title"
                        :paragraph-elements="lessonElements.title"
                        :words="words"
                        :phrases="phrases"
                        :paragraph-index="0"
                        component="h2"
                        @onWordClicked="onWordClicked"
                        @onPhraseClicked="onPhraseClicked"
                        @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked">
      </lesson-paragraph>
    </div>
    <div class="lesson-text styled-scrollbars">
      <lesson-paragraph v-for="(paragraph, paragraphIndex) in lessonElements.text"
                        :paragraph-elements="paragraph"
                        :words="words"
                        :phrases="phrases"
                        :paragraph-index="paragraphIndex+1"
                        :key="paragraphIndex"
                        @onWordClicked="onWordClicked"
                        @onPhraseClicked="onPhraseClicked"
                        @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked">
      </lesson-paragraph>
    </div>

    <div>
      <audio v-if="audio" controls :src="audio">
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>
</template>

<script>
import LessonParagraph from "@/components/page/reader/LessonParagraph.vue";

import {BLANK_IMAGE_URL} from "@/constants.js";

export default {
  name: "TheLessonContent",
  components: {LessonParagraph},
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
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dragStartWord: null,
    };
  },
  methods: {
    setDefaultImage(event) {
      if (event.target.src !== BLANK_IMAGE_URL)
        event.target.src = BLANK_IMAGE_URL;
    },
    onWordClicked(word) {
      this.$emit("onWordClicked", word);
    },
    onPhraseClicked(phraseText) {
      this.$emit("onPhraseClicked", phraseText);
    },
    onOverLappingPhrasesClicked(phrasesText) {
      this.$emit("onOverLappingPhrasesClicked", phrasesText);
    },
    onBackgroundClicked() {
      this.clearSelectedPhrases();
      this.$emit("onBackgroundClicked");
    },
    onNewPhraseSelected(phraseText) {
      this.$emit("onNewPhraseSelected", phraseText);
    },
    clearSelectedPhrases() {
      document.querySelectorAll(".phrase-selected").forEach((el) => el.classList.remove("phrase-selected"));
    },
    wrapperDrop() {
      const selectedPhrase = document.querySelectorAll(".phrase-selected");
      let phraseText = "";
      selectedPhrase.forEach((wrapperNode) => {
        const wordNode = wrapperNode.childNodes[0];
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
  /*border: 3px solid var(--primary-color-dark);*/
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
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


span {
  /*user-select: none;*/
}

span::selection {
  /*background: transparent;*/
  color: red;
  background: yellow;
}

</style>