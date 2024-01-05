<template>
  <div class="lesson-content" @mouseup="onMouseUp">
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
            :selectedTokens="selectedTokens"
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
                  :shouldRender="!groupIndexesToRender||groupIndexesToRender.has(index)"
                  :selectedTokens="selectedTokens"
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
import {LearnerVocabSchema} from "dzelda-common";
import {chuckArray, getChildrenInViewIndexes, getTextSelectedElements, padSequence} from "@/utils.js";
import {useDebounceFn, useEventListener} from "@vueuse/core";
import {icons} from "@/icons.js";
import TokenGroup from "@/components/page/reader/TokenGroup.vue";
import {LessonTokenObject} from "@/pages/LessonReaderPage.vue";

const TOKEN_MAX_GROUP_SIZE = 200;
const TOKEN_MIN_GROUP_SIZE = 100;
const TOKEN_GROUP_RENDER_BUFFER = 1;

export default {
  name: "LessonContent",
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
      groupIndexesInView: undefined as Set<number> | undefined,
      isPhraseFirstClick: true,
      selectedTokens: new Set<number>(),
      selectedTextTokens: [] as LessonTokenObject[],
    };
  },
  computed: {
    paragraphRef(): HTMLElement | null {
      return this.$refs["paragraphRef"] as HTMLElement;
    },
    groupIndexesToRender() {
      if (this.groupIndexesInView && this.groupIndexesInView.size > 0)
        return new Set(padSequence([...this.groupIndexesInView], TOKEN_GROUP_RENDER_BUFFER, TOKEN_GROUP_RENDER_BUFFER, 0, Infinity));
    },
    textTokenGroups() {
      const tokenGroups = [];
      let lastNewLineIndex = -1;
      let groupStartIndex = 0;
      for (let i = 0; i < this.lessonTokens.text.length; i++) {
        if (this.lessonTokens.text[i].text == "\n")
          lastNewLineIndex = i;
        if ((i - groupStartIndex) == TOKEN_MAX_GROUP_SIZE) {
          let groupEndIndex;
          if (lastNewLineIndex != -1 && lastNewLineIndex > TOKEN_MIN_GROUP_SIZE) {
            groupEndIndex = lastNewLineIndex;
            lastNewLineIndex = -1;
          } else
            groupEndIndex = groupStartIndex + TOKEN_MIN_GROUP_SIZE;
          tokenGroups.push(this.lessonTokens.text.slice(groupStartIndex, groupEndIndex));
          groupStartIndex = groupEndIndex;
        }
      }
      //last group
      tokenGroups.push(this.lessonTokens.text.slice(groupStartIndex));
      return tokenGroups;
    }
  },
  methods: {
    onWordClicked(word: LearnerVocabSchema, wordToken: LessonTokenObject) {
      this.selectedTokens = new Set([wordToken.index]);
      this.clearTokenTextSelection();
      this.$emit("onWordClicked", word);
    },
    onPhraseClicked(phrase: LearnerVocabSchema, clickedToken: LessonTokenObject) {
      this.selectedTokens = this.getPhraseTokens(clickedToken, [phrase]);
      this.clearTokenTextSelection();
      this.$emit("onPhraseClicked", phrase);
    },
    onOverLappingPhrasesClicked(phrases: LearnerVocabSchema[], clickedToken: LessonTokenObject) {
      this.selectedTokens.clear();
      //this.selectedTokens = this.getPhraseTokens(clickedToken, phrases);
      this.$emit("onOverLappingPhrasesClicked", phrases);
    },
    onBackgroundClicked() {
      this.clearTokenTextSelection();
      this.isPhraseFirstClick = true;
      this.selectedTokens.clear();
      this.selectedTextTokens = [];
      this.$emit("onBackgroundClicked");
    },
    onNewPhraseSelected(phraseText: string) {
      this.$emit("onNewPhraseSelected", phraseText);
    },
    clearTokenTextSelection() {
      document.querySelectorAll(".text-selected").forEach((el) => el.classList.remove("text-selected"));
    },
    onSelectionChange() {
      const selectedWrappers = getTextSelectedElements(getSelection()!)?.filter(e => e.classList.contains("word-wrapper")).slice(0, 30);
      if (!selectedWrappers || selectedWrappers.length < 1)
        return;
      this.clearTokenTextSelection();
      const selectedWords: LessonTokenObject[] = [];
      for (const wrapperElement of selectedWrappers) {
        wrapperElement.classList.add("text-selected");
        const wordNode = wrapperElement.childNodes[0] as HTMLElement;
        if (wordNode.classList.contains("word")) {
          const token = this.getTokenFromIndex(Number(wrapperElement.dataset.tokenIndex));
          selectedWords.push(token);
        }
      }
      this.selectedTextTokens = selectedWords;
    },
    onMouseUp() {
      getSelection()?.empty();
      if (this.selectedTextTokens.length == 0)
        return;
      const selectedText = this.selectedTextTokens.map(t => t.parsedText).join(" ");
      if (this.words[selectedText])
        this.onWordClicked(this.words[selectedText], this.selectedTextTokens[0]);
      else if (this.phrases[selectedText])
        this.onPhraseClicked(this.phrases[selectedText], this.selectedTextTokens[0]);
      else
        this.onNewPhraseSelected(selectedText);
    },
    getTokenFromIndex(tokenIndex: number) {
      if (tokenIndex < this.lessonTokens.title.length)
        return this.lessonTokens.title[tokenIndex];
      else
        return this.lessonTokens.text[tokenIndex - this.lessonTokens.title.length];
    },
    getPhraseTokens(clickedToken: LessonTokenObject, phrases: LearnerVocabSchema[]) {
      const phraseTokens = new Set<number>();
      const phraseIds = new Set<number>(phrases.map(p => p.id));
      document.querySelectorAll(clickedToken.phrases
          .filter(p => phraseIds.has(p.phraseId))
          .map(p => `.phrase-${p.phraseId}-${p.phraseOccurrenceIndex}`).join(", "))
          .forEach((n) => phraseTokens.add(Number((n as HTMLElement).dataset.tokenIndex)));
      return phraseTokens;
    },
    setIsPhraseFirstClick(isPhraseFirstClick: boolean) {
      this.isPhraseFirstClick = isPhraseFirstClick;
    },
  },
  mounted() {
    useEventListener(document, "selectionchange", this.onSelectionChange);
    useEventListener(document.body, "mousedown", this.onBackgroundClicked);
    // useEventListener(document, "keydown", (event) => {
    //   if (event.ctrlKey && event.key === "a") event.preventDefault();
    // });
    this.scrollObserver = new IntersectionObserver(useDebounceFn(() => {
      if (this.paragraphRef)
        this.groupIndexesInView = getChildrenInViewIndexes(this.paragraphRef);
    }, 0));
    for (const child of this.paragraphRef!.children)
      this.scrollObserver.observe(child);
  },
  unmounted() {
    if (this.scrollObserver)
      this.scrollObserver.disconnect();
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

  .fallback-image :deep(svg) {
    width: 80px;
    height: 80px;
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
