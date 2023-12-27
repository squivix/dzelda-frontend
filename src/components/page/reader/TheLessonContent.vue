<template>
  <div class="lesson-content" @mouseup="emptyTextSelection">
    <div class="top-div">
      <BaseImage :image-url="image" :fall-back-url="icons.bookOpen"
                 alt-text="lesson image" class="lesson-image"/>
      <h2 class="title">
        <TokenGroup
            :isPhraseFirstClick="isPhraseFirstClick"
            :phrases="phrases"
            :words="words"
            :tokenGroup="lessonTokens.title"
            :shouldRender="true"
            @onWordClicked="onWordClicked"
            @onPhraseClicked="onPhraseClicked"
            @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"
            @setIsPhraseFirstClick="setIsPhraseFirstClick"/>
      </h2>
    </div>
    <p class="lesson-text styled-scrollbars" ref="paragraphRef">
      <TokenGroup v-for="(tokenGroup,index) in textTokenGroups"
                  :isPhraseFirstClick="isPhraseFirstClick"
                  :phrases="phrases"
                  :words="words"
                  :tokenGroup="tokenGroup"
                  :shouldRender="!indexesToRender||indexesToRender.has(index)"
                  @onWordClicked="onWordClicked"
                  @onPhraseClicked="onPhraseClicked"
                  @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"
                  @setIsPhraseFirstClick="setIsPhraseFirstClick"/>
    </p>
  </div>
</template>

<script lang="ts">
import BaseImage from "@/components/ui/BaseImage.vue";
import {PropType} from "vue";
import {LessonTokenObject} from "@/pages/LessonReaderPage.vue";
import {LearnerVocabSchema} from "dzelda-types";
import {chuckArray, getChildrenInViewIndexes, getTextSelectedElements, padSequence} from "@/utils.js";
import {useEventListener} from "@vueuse/core";
import {icons} from "@/icons.js";
import TokenGroup from "@/components/page/reader/TokenGroup.vue";

const TOKEN_GROUP_SIZE = 50;
const TOKEN_GROUP_RENDER_BUFFER = 2;

export default {
  name: "TheLessonContent",
  components: {BaseImage, TokenGroup},
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked", "onNewPhraseSelected", "onBackgroundClicked", "onScroll"],
  props: {
    title: {type: String, required: true,},
    text: {type: String, required: true,},
    image: {type: String, required: true,},
    audio: {type: String, required: false,},
    words: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true,},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
    lessonTokens: {type: Object as PropType<{ title: LessonTokenObject[], text: LessonTokenObject[] }>, required: true},
  },
  data() {
    return {
      scrollObserver: null as IntersectionObserver | null,
      indexesInView: undefined as Set<number> | undefined,
      isSelectingPhraseText: false,
      isPhraseFirstClick: true,
    };
  },
  computed: {
    paragraphRef(): HTMLElement | null {
      return this.$refs["paragraphRef"] as HTMLElement;
    },
    indexesToRender() {
      if (this.indexesInView && this.indexesInView.size > 0)
        return new Set(padSequence([...this.indexesInView], TOKEN_GROUP_RENDER_BUFFER, TOKEN_GROUP_RENDER_BUFFER, 0, Infinity));
    },
    textTokenGroups() {
      return chuckArray(this.lessonTokens.text, TOKEN_GROUP_SIZE);
    }
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
    clearSelectedPhrases() {
      document.querySelectorAll(".phrase-selected").forEach((el) => el.classList.remove("phrase-selected"));
    },
    onSelectionChange() {
      const selectedWrappers = getTextSelectedElements(getSelection()!)?.filter(e => e.classList.contains("word-wrapper"));
      if (!selectedWrappers || selectedWrappers.length < 2)
        return;

      this.clearSelectedPhrases();
      let phraseText = "";
      for (const wrapperElement of selectedWrappers) {
        wrapperElement.classList.add("phrase-selected");
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
    },
    setIsPhraseFirstClick(isPhraseFirstClick: boolean) {
      this.isPhraseFirstClick = isPhraseFirstClick;
    },
  },
  mounted() {
    useEventListener(document, "selectionchange", this.onSelectionChange);
    useEventListener(document.body, "click", this.onBackgroundClicked);
    this.scrollObserver = new IntersectionObserver(() => {
      if (this.paragraphRef)
        this.indexesInView = getChildrenInViewIndexes(this.paragraphRef);
    });
    for (const child of this.paragraphRef!.children)
      this.scrollObserver.observe(child);
  },
  unmounted() {
    if (this.scrollObserver)
      this.scrollObserver.disconnect();
  },
  setup() {
    return {icons}
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
