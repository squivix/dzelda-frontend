<template>
  <component :is="component" class="paragraph">
        <span v-for="(element, index) in paragraphElements"
              :key="index"
              :class="getWrapperClass(element)"
              :data-parahraph-element-index="index"
              @click.stop="onWrapperClicked"
              :id="`wrapper-p-${paragraphIndex}-w-${index}`"
              :draggable="true"
              @dragstart="wrapperDragStart"
              @dragenter="wrapperDragEnter"
              @mouseenter="wrapperHoverStart"
              @mouseleave="wrapperHoverEnd"
        >
        <span :class="getWordClass(element)"
              :id="`w${index}`"
              v-if="element.isWord"
              @click.stop="onWordClicked(element.text)">
      {{ element.text }}</span>
    <span v-else>
        {{ element.text }}
    </span>
    </span>
  </component>
</template>

<script>
import {isEmptyObject} from "@/utils";
import {getTextElements} from "@/components/page/reader/shared";

export default {
  name: "LessonParagraph",
  computed: {},
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked"],
  props: {
    paragraphElements: {
      type: Array,
      required: true
    },
    words: {
      type: Object,
      required: true
    },
    phrases: {
      type: Object,
      required: true
    },
    component: {
      type: String,
      required: false,
      default: "p"
    },
    paragraphIndex: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {dragStartWord: null};
  },
  methods: {
    onWordClicked(word) {
      this.$emit("onWordClicked", word);
    },
    onWrapperClicked(event) {
      let wrapperDomElem = event.target;
      if (wrapperDomElem.parentElement.classList.contains("word-wrapper"))
        wrapperDomElem = wrapperDomElem.parentElement;
      if (!wrapperDomElem.classList.contains("word-wrapper"))
        return;

      const paragraphElement = this.paragraphElements[Number(wrapperDomElem.dataset.parahraphElementIndex)]
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
    getWordClass(element) {
      let word = this.words[element.text.toLowerCase()];
      if (!element.isWord)
        return "";
      switch (word.level) {
        case -1:
          return "word word-ignored";
        case 0:
          return "word word-new";
        case 1:
          return "word word-level-1";
        case 2:
          return "word word-level-2";
        case 3:
          return "word word-level-3";
        case 4:
          return "word word-level-4";
        case 5:
          return "word word-learned";
        case 6:
          return "word word-known";
        default:
          return "word";
      }
    },
    getWrapperClass(element) {
      return `word-wrapper ${this.getPhrasePositionClass(element)} ${this.getPhraseLevelClass(element)}`;
    },
    getPhraseLevelClass(element) {
      if (isEmptyObject(element.phrases))
        return "";
      switch (this.phrases[Object.keys(element.phrases)[0].toLowerCase()].level) {
        case 0:
          return "phrase-new";
        case 1:
          return "phrase phrase-level-1 ";
        case 2:
          return "phrase phrase-level-2 ";
        case 3:
          return "phrase phrase-level-3";
        case 4:
          return "phrase phrase-level-4";
        case 5:
          return "phrase phrase-learned";
        case 6:
          return "phrase phrase-known";
        default:
          return "";
      }
    },
    getPhrasePositionClass(element) {
      if (isEmptyObject(element.phrases))
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
    wrapperDragStart(event) {
      this.dragStartWord = event.target;
      event.dataTransfer.setDragImage(document.createElement("img"), 0, 0);
    },
    wrapperDragEnter(event) {
      let endWord = event.target;
      let startWord = this.dragStartWord;
      if (!startWord || !endWord)
        return;
      if (!endWord.classList.contains("word-wrapper")) {
        endWord = endWord.parentElement;
        if (!endWord.classList.contains("word-wrapper"))
          return;
      }

      let selectedWords;
      if (endWord === startWord) {
        selectedWords = [startWord];
      } else {
        let tokens = startWord.id.split("-");
        const startWordNum = Number(tokens[tokens.length - 1]);
        const startWordParagraph = Number(tokens[tokens.length - 3]);
        tokens = endWord.id.split("-");
        const endWordNum = Number(tokens[tokens.length - 1]);
        const endWordParagraph = Number(tokens[tokens.length - 3]);

        if (startWordParagraph !== endWordParagraph)
          return;
        if (startWordNum > endWordNum)
          [startWord, endWord] = [endWord, startWord];

        selectedWords = [startWord];
        const wordsAfterStart = document.querySelectorAll(`#${startWord.id} ~ .word-wrapper`)
        for (const w of wordsAfterStart) {
          if (w === endWord)
            break;
          selectedWords.push(w);
        }
        selectedWords.push(endWord);

        document.querySelectorAll(".word-wrapper").forEach((w) => w.classList.remove("phrase-selected"))
        selectedWords.forEach((w) => w.classList.add("phrase-selected"));
      }

    },
    wrapperHoverStart(event) {
      //TODO find better way of styling multiple elements based on the hover of one
      const wrapperNode = event.target;
      if (!wrapperNode.classList.contains("phrase"))
        return;
      const element = this.paragraphElements[Number(wrapperNode.dataset.parahraphElementIndex)]
      const phrases = Object.keys(element.phrases);
      if (phrases.length === 0)
        return;
      if (phrases.length === 1) {
        const phraseNodes = this.getPhraseNodes(wrapperNode, element.phrases[phrases[0]]);
        phraseNodes[0].style.borderInlineStart = "1px solid";
        phraseNodes[phraseNodes.length - 1].style.borderInlineEnd = "1px solid";
        phraseNodes.forEach((pn) => pn.classList.add("phrase-hovered"))
      } else {
        wrapperNode.style.borderInlineStart = "1px solid";
        wrapperNode.style.borderInlineEnd = "1px solid";
        wrapperNode.classList.add("phrase-hovered");
      }
    },
    wrapperHoverEnd(event) {
      const wrapperNode = event.target;
      if (!wrapperNode.classList.contains("phrase"))
        return;
      const element = this.paragraphElements[Number(wrapperNode.dataset.parahraphElementIndex)]
      const phrases = Object.keys(element.phrases);
      if (phrases.length === 0)
        return;
      else if (phrases.length === 1) {
        const phraseNodes = this.getPhraseNodes(wrapperNode, element.phrases[phrases[0]]);
        phraseNodes[0].style.borderInlineStart = "1px solid transparent";
        phraseNodes[phraseNodes.length - 1].style.borderInlineEnd = "1px solid transparent";
        phraseNodes.forEach((pn) => pn.classList.remove("phrase-hovered"))
      } else {
        //TODO treat case where phrases are not in different directions
        wrapperNode.style.borderInlineStart = "1px solid transparent";
        wrapperNode.style.borderInlineEnd = "1px solid transparent";
        wrapperNode.classList.remove("phrase-hovered");
      }
    },
    getPhraseNodes(node, elementPhrase) {
      const phraseLength = elementPhrase.length;
      const hoverNodeIndex = elementPhrase.index;

      let phraseStart = node;
      for (let i = hoverNodeIndex; i > 0; i--)
        phraseStart = phraseStart.previousSibling;

      const phraseNodes = [phraseStart];
      let phraseEnd = phraseNodes[phraseNodes.length - 1];
      for (let i = 1; i < phraseLength; i++) {
        phraseNodes.push(phraseEnd.nextSibling);
        phraseEnd = phraseNodes[phraseNodes.length - 1];
      }
      return phraseNodes;
    },
  },


  mounted() {
  }
}
</script>

<style scoped>
.paragraph {
}

.word {
  border: 1px solid transparent;
  padding: 0.1rem 0.2rem;
  border-radius: 5px;
}

.word:hover {
  border: 1px solid darkblue;
  cursor: pointer;
}

.word-new {
  background-color: #aee0f4;
}

.phrase-new {

}

.phrase-new:hover {
  /*background-color: ghostwhite;*/
  cursor: default !important;
}

.word-level-1,
.phrase-level-1 {
  background-color: #ffeda1;
}

.word-level-2,
.phrase-level-2 {
  background-color: #fff2ab;
}

.word-level-3,
.phrase-level-3 {
  background-color: #fff6c7;
}

.word-level-4,
.phrase-level-4 {
  background-color: transparent;
  border-bottom: 1px dotted black;
}

.word-known,
.word-learned,
.word-ignored,
.phrase-known,
.phrase-learned {
  background-color: transparent;
}

.word-wrapper {
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  border: 1px solid transparent;
}

.word-wrapper:hover {
  cursor: pointer;
}

.phrase-start {
  padding-left: 0.25rem;
  border-start-start-radius: 5px;
  border-end-start-radius: 5px;
}

.phrase-middle {
  border: 1px solid transparent;
}

.phrase-end {
  padding-right: 0.25rem;
  border-end-end-radius: 5px;
  border-start-end-radius: 5px;
}

.phrase {
  transition: padding 0.25s ease-out;

}

.phrase-selected {
  background-color: #268AFA;
}

.phrase-hovered {
  padding-top: 0.65rem;
  padding-bottom: 0.65rem;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
</style>