<template>
  <LoadingScreen v-if="isLoadingText||!textTokens" :loadingStatus="loadingStatus"/>
  <BaseCard class="base-card unselectable" v-else-if="text">
    <template v-slot:all>
      <EmptyScreen v-if="text.isProcessing" class="empty-screen-wrapper">
        <template v-slot:no-filters>
          <div class="empty-screen">
            <inline-svg :src="icons.hourglass" class="empty-icon"/>
            <p>Text is still processing
              <br>
              come back in a minute</p>
          </div>
        </template>
      </EmptyScreen>
      <template v-else>
        <div class="top-div">
          <div class="main-reader">
            <PagePanelButton :disabled="currentPage==1" :iconSrc="icons.arrowLeft" @click="currentPage--" class="left-button"/>
            <TextMainPane ref="textContentRef"
                          :page="currentPage"
                          :textTokens="textTokens"
                          :currentPage="textTokenPages[currentPage-1]"
                          :selectedTokens="isSelectedNewPhrase?[]:selectedTokens"
                          :image="imageUrl"
                          :words="words"
                          :phrases="phrases"
                          :showTopBar="currentPage==1"
                          class="text-main-pane"
                          @onWordClicked="setSelectedTokens"
                          @onPhraseClicked="setSelectedTokens"
                          @onNewPhraseSelected="setSelectedTokens"
                          @onOverLappingPhrasesClicked="showOverlappingPhrases"
                          @onBackgroundClicked="clearSelectedTokens"/>
            <PagePanelButton v-if="currentPage<textTokenPages.length" :iconSrc="icons.arrowRight" @click="currentPage++" class="right-button"/>
            <PagePanelButton v-else :disabled="!showDoneButton" :iconSrc="icons.checkMark" @onClick="finishText" class="right-button"/>
          </div>
          <ReaderSidePanel class="side-panel"
                           :selectedOverLappingPhrasesTokens="selectedOverLappingPhrasesTokens"
                           :selectedVocab="selectedVocab"
                           :phrases="phrases"
                           @onVocabUpdated="updateVocabData"
                           @onVocabDeleted="deleteVocabData"
                           @onNewVocabCreated="onNewVocabCreated"
                           @onOverlappingPhraseClicked="setSelectedTokens"
                           :onVocabRefetched="updateVocab">
            <slot name="side-panel"></slot>
          </ReaderSidePanel>
        </div>
        <div class="bottom-div">
          <div v-if="text.audio">
            <audio controls :src="audioUrl">
              Your browser does not support the audio element.
            </audio>
          </div>
          <PageIndicator class="page-indicators" :currentPage="currentPage" :pageCount="textTokenPages.length" @onPageIndicatorClicked="(page:number)=>currentPage=page"/>
        </div>
      </template>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import {defineComponent, inject} from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import PageIndicator from "@/components/page/reader/PageIndicator.vue";
import ReaderSidePanel from "@/components/page/reader/ReaderSidePanel.vue";
import PagePanelButton from "@/components/page/reader/PagePanelButton.vue";
import {getParser, LearnerVocabSchema, TextSchema, TokenWithPhrases, TokeObjectPhrases, VocabLevel} from "dzelda-common";
import {icons} from "@/icons.js";
import {useTextStore} from "@/stores/backend/textStore.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import TextMainPane from "@/components/page/reader/TextMainPane.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import InlineSvg from "vue-inline-svg";

export type NewVocab = Omit<LearnerVocabSchema, "id">
export type TextTokenObject = Omit<TokenWithPhrases, "phrases"> & {
  index: number,
  parsedText: string,
  phrases: Array<TokeObjectPhrases[number] & { phraseId: number }>
}
export default defineComponent({
  name: "Reader",
  components: {EmptyScreen, LoadingScreen, TextMainPane, PagePanelButton, ReaderSidePanel, PageIndicator, BaseCard, InlineSvg},
  props: {
    languageCode: {type: String, required: true},
    textId: {type: Number, required: true},
    tokenMinGroupSize: {type: Number, default: 100},
    tokenMaxGroupSize: {type: Number, default: 250},
    showDoneButton: {type: Boolean, default: true},
  },
  data() {
    return {
      text: null as TextSchema | null,
      words: {} as Record<string, LearnerVocabSchema>,
      phrases: {} as Record<string, LearnerVocabSchema>,
      selectedTokens: [] as TextTokenObject[],
      selectedOverLappingPhrasesTokens: null as TextTokenObject[][] | null,
      textTokens: null as { title: TextTokenObject[], text: TextTokenObject[] } | null,
      matchIndexToTokenIndex: {title: {}, text: {}} as { title: Record<number, number>, text: Record<number, number> },
      currentPage: 1,
      isLoadingText: false,
      loadingStatus: ""
    };
  },
  computed: {
    //Note the tradeoffs with tokenMinGroupSize and tokenMaxGroupSize.
    //Higher min group size means fewer pages, but more splitting mid-paragraph
    //Lower min group size means less splitting mid-paragraph but more pages
    //Higher max group size means fewer pages, but more performance slowdown depending on user's device
    //Lower max group size means less performance problems but more pages
    //Solution is probably to rewrite the grouping algorithm
    textTokenPages() {
      const tokenPages: TextTokenObject[][] = [];
      if (!this.textTokens)
        return tokenPages;
      // group tokens into pages preferring line endings as borders between them
      let lastNewLineIndex = -1;
      let pageStartIndex = 0;
      let nonNewLineTokensCounter = 0;
      for (let i = 0; i < this.textTokens.text.length; i++) {
        if (this.textTokens.text[i].text == "\n")
          lastNewLineIndex = i;
        else
          nonNewLineTokensCounter++;
        if ((nonNewLineTokensCounter - pageStartIndex) == this.tokenMaxGroupSize) {
          let groupEndIndex;
          if (lastNewLineIndex != -1 && lastNewLineIndex > this.tokenMinGroupSize) {
            groupEndIndex = lastNewLineIndex;
            lastNewLineIndex = -1;
          } else
            groupEndIndex = pageStartIndex + this.tokenMinGroupSize;
          tokenPages.push(this.textTokens.text.slice(pageStartIndex, groupEndIndex));
          pageStartIndex = groupEndIndex;
        }
      }
      //last page
      tokenPages.push(this.textTokens.text.slice(pageStartIndex));
      return tokenPages;
    },
    selectedVocab() {
      if (this.selectedTokens.length == 0)
        return null;
      const selectedWords = this.selectedTokens.filter(t => t.isWord).map(t => t.parsedText);
      if (selectedWords.length == 0)
        return null;
      const selectedWordsText = selectedWords.join(" ");
      if (this.words[selectedWordsText])
        return this.words[selectedWordsText];
      else if (this.phrases[selectedWordsText])
        return this.phrases[selectedWordsText];
      else
        return {
          text: selectedWordsText,
          level: VocabLevel.NEW,
          isPhrase: true,
          notes: null,
          language: this.text!.language,
          meanings: [],
          learnerMeanings: [],
          ttsPronunciationUrl: null,
          learnersCount: 0,
          tags: [],
          rootForms: [],
        } as NewVocab;
    },
    isSelectedNewPhrase() {
      if (!this.selectedVocab)
        return false;
      return (this.selectedVocab.isPhrase && this.selectedVocab.level == VocabLevel.NEW);
    },
    imageUrl() {
      return (this.text!.image || this.text!.collection?.image) ?? "";
    },
    audioUrl() {
      return this.text?.audio ?? "";
    },
  },
  watch: {
    async textId() {
      this.isLoadingText = true;
      await this.fetchText();
      if (this.text!.language !== this.languageCode) {
        await this.$router.push({name: "not-found"});
        return;
      }
      this.isLoadingText = false;
      await this.textStore.addTextToUserHistory({textId: this.textId});
      await this.fetchTextVocabs();
      this.parseText();
      this.currentPage = 1;
      this.isLoadingText = false;
    }
  },
  async mounted() {
    this.isLoadingText = true;
    await this.fetchText();
    if (this.text!.language !== this.languageCode) {
      await this.$router.push({name: "not-found"});
      return;
    }
    this.isLoadingText = false;
    await this.textStore.addTextToUserHistory({textId: this.textId});
    await this.fetchTextVocabs();
    this.parseText();
    this.isLoadingText = false;
  },
  methods: {
    async fetchText() {
      this.loadingStatus = "fetching text...";
      this.text = await this.textStore.fetchText({textId: this.textId});
      this.text.content = this.text.content.replace(/[\r\n]{3,}/g, "\n\n");
    },
    async finishText() {
      if (this.text!.collection && !this.text!.isLastInCollection) {
        const text = await this.textStore.fetchNextText({
          collectionId: this.text!.collection?.id,
          textId: this.text!.id
        });
        await this.$router.push({params: {textId: text!.id}});
      } else
        this.$router.push({name: "home"});
    },
    async fetchTextVocabs() {
      this.loadingStatus = "fetching vocabs...";
      const textVocabs = await this.vocabStore.fetchTextVocabs({textId: this.textId}, {});
      const words: Record<string, LearnerVocabSchema> = {};
      const phrases: Record<string, LearnerVocabSchema> = {};
      for (const vocab of textVocabs) {
        if (!vocab.isPhrase)
          words[vocab.text] = vocab;
        else
          phrases[vocab.text] = vocab;
      }
      this.words = words;
      this.phrases = phrases;
    },
    setSelectedTokens(selectedTokens: TextTokenObject[]) {
      this.selectedTokens = selectedTokens;
      this.selectedOverLappingPhrasesTokens = null;
    },
    clearSelectedTokens() {
      this.selectedTokens = [];
      this.selectedOverLappingPhrasesTokens = null;
    },
    showOverlappingPhrases(overlappingPhrasesTokens: TextTokenObject[][]) {
      this.clearSelectedTokens();
      this.selectedOverLappingPhrasesTokens = overlappingPhrasesTokens;
    },
    onNewVocabCreated(vocab: LearnerVocabSchema) {
      if (vocab.isPhrase) {
        this.phrases[vocab.text] = vocab;
        this.parsePhraseInTokens(this.text!.parsedTitle!, this.matchIndexToTokenIndex.title, this.textTokens!.title, vocab.text);
        this.parsePhraseInTokens(this.text!.parsedContent!, this.matchIndexToTokenIndex.text, this.textTokens!.text, vocab.text);
        if (this.$refs.textContentRef)
          (this.$refs.textContentRef as InstanceType<typeof TextMainPane>).clearTokenTextSelection();
      }
    },
    updateVocabData(vocab: LearnerVocabSchema, updatedVocabData: Partial<LearnerVocabSchema>) {
      const updatedVocab = {...vocab, ...updatedVocabData};
      if (vocab.isPhrase)
        this.phrases[vocab.text] = updatedVocab;
      else
        this.words[vocab.text] = updatedVocab;
      if (this.selectedVocab && this.selectedVocab.text === vocab.text) {
        if ([VocabLevel.IGNORED, VocabLevel.KNOWN].includes(updatedVocabData.level!))
          this.clearSelectedTokens();
      }
    },
    deleteVocabData(vocab: LearnerVocabSchema) {
      const newVocab: LearnerVocabSchema = {
        id: vocab.id,
        text: vocab.text,
        level: VocabLevel.NEW,
        isPhrase: vocab.isPhrase,
        notes: null,
        language: vocab.language,
        meanings: vocab.meanings,
        learnerMeanings: [],
        ttsPronunciationUrl: null,
        tags: vocab.tags,
        rootForms: vocab.rootForms,
        learnersCount: vocab.learnersCount
      };
      if (vocab.isPhrase)
        this.phrases[vocab.text] = newVocab;
      else
        this.words[vocab.text] = newVocab;
      if (this.selectedVocab && this.selectedVocab.text === vocab.text)
        this.clearSelectedTokens();
    },
    updateVocab(updatedVocab: LearnerVocabSchema) {
      if (updatedVocab.isPhrase)
        this.phrases[updatedVocab.text] = updatedVocab;
      else
        this.words[updatedVocab.text] = updatedVocab;
    },
    parseText() {
      this.loadingStatus = "parsing text...";
      const titleTokens = this.parseStringToTokens(this.text!.title, this.matchIndexToTokenIndex.title, 0);
      const textTokens = this.parseStringToTokens(this.text!.content, this.matchIndexToTokenIndex.text, titleTokens.length);
      this.textTokens = {title: titleTokens, text: textTokens};
    },
    parseStringToTokens(text: string, matchIndexToTokenIndex: Record<number, number>, firstIndex: number): TextTokenObject[] {
      const parser = getParser(this.text!.language);
      const tokens = parser.detectPhrases(text, Object.keys(this.phrases)) as TextTokenObject[];
      let matchIndex = 0;
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].isWord) {
          matchIndexToTokenIndex[matchIndex] = i;
          matchIndex += tokens[i].parsedText!.length + 1;
        }
        tokens[i].phrases.forEach((phrase) => {
          phrase.phraseId = this.phrases[phrase.text].id;
        });
        tokens[i].index = firstIndex + i;
      }
      return tokens;
    },
    parsePhraseInTokens(parsedText: string, matchIndexToTokenIndex: Record<number, number>, tokens: TextTokenObject[], phraseText: string) {
      //detect every phrase surrounded by non letters and non-numbers
      const regex = new RegExp(`(?=((?<=\\s|^)${phraseText}(?=\\s|$)))`, "gu");
      const phraseWords = phraseText.split(" ");
      let occurrenceIndex = 0;
      for (let match of parsedText.matchAll(regex)) {
        const startIndex = matchIndexToTokenIndex[match!.index!];
        let i = startIndex;
        let wordIndex = 0;
        while (wordIndex < phraseWords.length) {
          if (tokens[i].isWord)
            wordIndex++;
          i++;
        }
        const phraseTokens = tokens.slice(startIndex, i);
        phraseTokens.forEach((pt) => pt.phrases.push({
          text: phraseText,
          phraseId: this.phrases[phraseText].id,
          phraseOccurrenceIndex: occurrenceIndex
        }));
        occurrenceIndex++;
      }
    },
  },
  setup() {
    return {
      icons,
      textStore: inject<ReturnType<typeof useTextStore>>("textStore", useTextStore()),
      vocabStore: inject<ReturnType<typeof useVocabStore>>("vocabStore", useVocabStore()),
    };
  }
});
</script>

<style scoped>
.base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  border-radius: 20px;
  max-width: 1150px;
  padding: 0 0 15px 0;
  margin-bottom: 0;
}

.empty-screen-wrapper {
  height: 80vh;
}

.top-div {
  display: grid;
  grid-template-columns: 2fr 1.2fr;
  grid-template-rows: 75vh;
  column-gap: 0.5rem;
}

.main-reader {
  display: flex;
  column-gap: 0.75rem;
}

.text-main-pane {
  width: 100%;
}

.bottom-div {
  display: flex;
  flex-direction: column;
  width: 100%;
  row-gap: 0.5rem;
}

audio {
  max-height: 2rem;
}

.page-indicators {
  align-self: center;
}

@media screen and (max-width: 750px) {
  .base-card {
    padding-bottom: 10px;
    padding-left: 10px;
  }

  .top-div {
    grid-template-rows: 60vh 1fr;
    grid-template-columns: auto;
    column-gap: 0;
    height: auto;
  }

  .side-panel {
    min-height: 25vh;
    padding-top: 0;
    padding-right: 10px;
  }

  .main-reader {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: 90% auto;
    column-gap: 0;
  }

  .text-main-pane {
    grid-column: 1 / span 3;
  }

  .left-button {
    grid-row: 2;
    grid-column: 1;
  }

  .right-button {
    grid-row: 2;
    grid-column: 3;
  }
}
</style>
