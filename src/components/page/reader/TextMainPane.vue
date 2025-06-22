<template>
  <div class="text-main-pane" @mouseup="onMouseUp">
    <div class="title-section" v-if="showTopBar">
      <BaseImage :image-url="image" :fall-back-url="icons.bookOpen"
                 alt-text="text image" class="text-image"/>
      <h2 class="title" :dir="readingDirection">
        <TextToken v-for="(token, index) in textTokens.title"
                   :key="index"
                   :token="token"
                   :word="words[token.parsedText!]"
                   :allPhrases="phrases"
                   :isPhraseFirstClick="isPhraseFirstClick"
                   :isWordSelected="selectedTokenIndexes.size==1 && selectedTokenIndexes.has(token.index)"
                   :isPhraseSelected="selectedTokenIndexes.size>1 && selectedTokenIndexes.has(token.index)"
                   @onWordClicked="onWordClicked"
                   @onPhraseClicked="onPhraseClicked"
                   @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"
                   @setIsPhraseFirstClick="setIsPhraseFirstClick"/>
      </h2>
    </div>
    <p class="content styled-scrollbars" ref="paragraphRef" :dir="readingDirection">
      <TextToken v-for="(token, index) in currentPage"
                 :key="index"
                 :token="token"
                 :allPhrases="phrases"
                 :word="words[token.parsedText!]"
                 :isPhraseFirstClick="isPhraseFirstClick"
                 :isWordSelected="selectedTokenIndexes.size==1 && selectedTokenIndexes.has(token.index)"
                 :isPhraseSelected="selectedTokenIndexes.size>1 && selectedTokenIndexes.has(token.index)"
                 @onWordClicked="onWordClicked"
                 @onPhraseClicked="onPhraseClicked"
                 @onOverLappingPhrasesClicked="onOverLappingPhrasesClicked"
                 @setIsPhraseFirstClick="setIsPhraseFirstClick"/>
    </p>
  </div>
</template>

<script lang="ts">
import BaseImage from "@/components/ui/BaseImage.vue";
import type {PropType} from "vue";
import {defineComponent, inject} from "vue";
import type {LearnerVocabSchema} from "dzelda-common";
import {VocabLevel} from "dzelda-common";
import {getTextSelectedElements} from "@/utils.js";
import {useEventListener} from "@vueuse/core";
import {icons} from "@/icons.js";
import type {TextTokenObject} from "@/components/shared/Reader.vue";
import TextToken from "@/components/page/reader/TextToken.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default defineComponent({
  name: "TextMainPane",
  components: {TextToken, BaseImage},
  emits: ["onWordClicked", "onPhraseClicked", "onOverLappingPhrasesClicked", "onNewPhraseSelected", "onBackgroundClicked", "onScroll"],
  props: {
    textTokens: {type: Object as PropType<{ title: TextTokenObject[], text: TextTokenObject[] }>, required: true},
    showTopBar: {type: Boolean, default: true},
    currentPage: {type: Array as PropType<TextTokenObject[]>, required: true},
    selectedTokens: {type: Array as PropType<TextTokenObject[]>, required: true},
    image: {type: String, required: true,},
    words: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true,},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
  },
  data() {
    return {
      isPhraseFirstClick: true,
      selectedTextTokens: [] as TextTokenObject[],
    };
  },
  expose: ["clearTokenTextSelection"] as string[],
  computed: {
    selectedTokenIndexes() {
      return new Set(this.selectedTokens.map(t => t.index));
    },
    readingDirection() {
      return this.languageStore.currentLanguageDir;
    }
  },
  watch: {
    currentPage() {
      (this.$refs["paragraphRef"] as HTMLElement)?.scrollTo(0, 0);
    }
  },
  methods: {
    onWordClicked(word: LearnerVocabSchema, wordToken: TextTokenObject) {
      this.clearTokenTextSelection();
      this.$emit("onWordClicked", [wordToken]);
    },
    onPhraseClicked(phrase: LearnerVocabSchema, clickedToken: TextTokenObject) {
      this.clearTokenTextSelection();
      this.$emit("onPhraseClicked", this.getPhraseTokens(clickedToken, [phrase]));
    },
    onOverLappingPhrasesClicked(phrases: LearnerVocabSchema[], clickedToken: TextTokenObject) {
      const phraseMap: Record<string, TextTokenObject[]> = {};
      const phraseTokens = this.getPhraseTokens(clickedToken, phrases);
      const phraseIds = new Set(phrases.map(p => p.id));
      for (const token of phraseTokens) {
        for (const tp of token.phrases) {
          if (!phraseIds.has(tp.phraseId))
            continue;
          const key = `${tp.phraseId}-${tp.phraseOccurrenceIndex}`;
          if (key in phraseMap)
            phraseMap[key].push({...token, phrases: [tp]});
          else
            phraseMap[key] = [{...token, phrases: [tp]}];
        }
      }
      const completePhraseTokens = Object.values(phraseMap).filter(pts => pts.filter(t => t.isWord).map(t => t.parsedText).join(" ") in this.phrases);
      this.$emit("onOverLappingPhrasesClicked", completePhraseTokens);
    },
    onNewPhraseSelected(newPhraseTokens: TextTokenObject[]) {
      this.$emit("onNewPhraseSelected", newPhraseTokens);
    },
    onBackgroundClicked() {
      this.clearTokenTextSelection();
      this.isPhraseFirstClick = true;
      this.$emit("onBackgroundClicked");
    },
    clearTokenTextSelection() {
      this.selectedTextTokens = [];
      document.querySelectorAll(".text-selected").forEach((el) => el.classList.remove("text-selected"));
    },
    onSelectionChange() {
      const selectedWrappers = getTextSelectedElements(getSelection()!)?.filter(e => e.classList.contains("word-wrapper")).slice(0, 30);
      if (!selectedWrappers || selectedWrappers.length < 1)
        return;
      this.clearTokenTextSelection();
      const selected: TextTokenObject[] = [];
      for (const wrapperElement of selectedWrappers) {
        wrapperElement.classList.add("text-selected");
        const token = this.getTokenFromIndex(Number(wrapperElement.dataset.tokenIndex));
        selected.push(token);
      }
      this.selectedTextTokens = selected;
    },
    onMouseUp() {
      getSelection()?.empty();
      if (this.selectedTextTokens.length == 0)
        return;
      const selectedWordTokens = this.selectedTextTokens.filter(t => t.isWord);
      const selectedText = selectedWordTokens.map(t => t.parsedText).join(" ");
      if (this.words[selectedText])
        this.onWordClicked(this.words[selectedText], selectedWordTokens[0]);
      else if (this.phrases[selectedText] && this.phrases[selectedText].level !== VocabLevel.NEW)
        this.onPhraseClicked(this.phrases[selectedText], selectedWordTokens[0]);
      else
        this.onNewPhraseSelected(this.selectedTextTokens);
    },
    getTokenFromIndex(tokenIndex: number) {
      if (tokenIndex < this.textTokens.title.length)
        return this.textTokens.title[tokenIndex];
      else
        return this.textTokens.text[tokenIndex - this.textTokens.title.length];
    },
    getPhraseTokens(clickedToken: TextTokenObject, phrases: LearnerVocabSchema[]) {
      const phraseTokens: TextTokenObject[] = [];
      const phraseIds = new Set<number>(phrases.map(p => p.id));
      document.querySelectorAll(clickedToken.phrases
          .filter(p => phraseIds.has(p.phraseId))
          .map(p => `.phrase-${p.phraseId}-${p.phraseOccurrenceIndex}`).join(", "))
          .forEach((n) => phraseTokens.push(this.getTokenFromIndex(Number((n as HTMLElement).dataset.tokenIndex))));
      return phraseTokens;
    },
    setIsPhraseFirstClick(isPhraseFirstClick: boolean) {
      this.isPhraseFirstClick = isPhraseFirstClick;
    },
  },
  mounted() {
    useEventListener(document, "selectionchange", this.onSelectionChange);
    useEventListener(document.body, "mousedown", this.onBackgroundClicked);
  },
  setup() {
    return {
      icons,
      languageStore: inject<ReturnType<typeof useLanguageStore>>("languageStore", useLanguageStore()),
    };
  }
});
</script>
<style scoped>
.text-main-pane {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  padding-top: 30px;
}

.title-section {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
}

.text-image {
  width: 150px;
  height: 150px;
}

.title {
  font-size: 1.5rem;
  line-height: 2.75rem;
}

.content {
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 0.5rem;
  min-height: 100px;
  max-width: 600px;
  word-break: break-word;
}

p {
  font-size: 1.15rem;
  line-height: 2.5rem;
}

@media screen and (max-width: 800px) {
  .text-main-pane {
    padding-right: 20px;
  }

  .text-image {
    width: 100px;
    height: 100px;
  }

  .fallback-image :deep(svg) {
    width: 80px;
    height: 80px;
  }

  .title {
    font-size: 1.2rem;
    line-height: 2.5rem;
  }

}

@media screen and (max-width: 900px) {
  .title-section {
    flex-direction: column;
    align-items: center;
    row-gap: 0.5rem;
  }
}
</style>
