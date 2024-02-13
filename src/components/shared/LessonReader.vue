<template>
  <LoadingScreen v-if="isLoading||!lessonTokens"/>
  <BaseCard class="base-card unselectable" v-else-if="lesson">
    <template v-slot:all>
      <div class="top-div">
        <div class="main-reader">
          <PagePanelButton :disabled="currentPage==1" :iconSrc="icons.arrowLeft" @click="currentPage--" class="left-button"/>
          <LessonContent ref="lessonContentRef"
                         :page="currentPage"
                         :lessonTokens="lessonTokens"
                         :currentPage="textTokenPages[currentPage-1]"
                         :selectedTokens="isSelectedNewPhrase?[]:selectedTokens"
                         :image="imageUrl"
                         :words="words"
                         :phrases="phrases"
                         :showTopBar="currentPage==1"
                         class="lesson-content"
                         @onWordClicked="setSelectedTokens"
                         @onPhraseClicked="setSelectedTokens"
                         @onNewPhraseSelected="setSelectedTokens"
                         @onOverLappingPhrasesClicked="showOverlappingPhrases"
                         @onBackgroundClicked="clearSelectedTokens"/>
          <PagePanelButton v-if="currentPage<textTokenPages.length" :iconSrc="icons.arrowRight" @click="currentPage++" class="right-button"/>
          <PagePanelButton v-else :disabled="!showDoneButton" :iconSrc="icons.checkMark" @onClick="finishLesson" class="right-button"/>
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
        <div v-if="lesson.audio">
          <audio controls :src="audioUrl">
            Your browser does not support the audio element.
          </audio>
        </div>
        <PageIndicator class="page-indicators" :currentPage="currentPage" :pageCount="textTokenPages.length" @onPageIndicatorClicked="page=>currentPage=page"/>
      </div>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import {defineComponent, inject} from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import PageIndicator from "@/components/page/reader/PageIndicator.vue";
import ReaderSidePanel from "@/components/page/reader/ReaderSidePanel.vue";
import PagePanelButton from "@/components/page/reader/PagePanelButton.vue";
import LessonContent from "@/components/page/reader/LessonContent.vue";
import {getParser, LearnerVocabSchema, LessonSchema, TokenWithPhrases, TokeObjectPhrases, VocabLevelSchema} from "dzelda-common";
import {icons} from "@/icons.js";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";

export type NewVocab = Omit<LearnerVocabSchema, "id">
export type LessonTokenObject = Omit<TokenWithPhrases, "phrases"> & {
  index: number,
  parsedText: string,
  phrases: Array<TokeObjectPhrases[number] & { phraseId: number }>
}
export default defineComponent({
  name: "LessonReader",
  components: {LoadingScreen, LessonContent, PagePanelButton, ReaderSidePanel, PageIndicator, BaseCard},
  props: {
    languageCode: {type: String, required: true},
    lessonId: {type: Number, required: true},
    tokenMinGroupSize: {type: Number, default: 100},
    tokenMaxGroupSize: {type: Number, default: 250},
    showDoneButton: {type: Boolean, default: true},
  },
  data() {
    return {
      lesson: null as LessonSchema | null,
      words: {} as Record<string, LearnerVocabSchema>,
      phrases: {} as Record<string, LearnerVocabSchema>,
      selectedTokens: [] as LessonTokenObject[],
      selectedOverLappingPhrasesTokens: null as LessonTokenObject[][] | null,
      lessonTokens: null as { title: LessonTokenObject[], text: LessonTokenObject[] } | null,
      matchIndexToTokenIndex: {title: {}, text: {}} as { title: Record<number, number>, text: Record<number, number> },
      currentPage: 1,
      isLoadingLesson: true,
      isLoadingWords: true,
      isParsingLesson: true,
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
      const tokenPages: LessonTokenObject[][] = [];
      if (!this.lessonTokens)
        return tokenPages;
      // group tokens into pages preferring line endings as borders between them
      let lastNewLineIndex = -1;
      let pageStartIndex = 0;
      let nonNewLineTokensCounter = 0;
      for (let i = 0; i < this.lessonTokens.text.length; i++) {
        if (this.lessonTokens.text[i].text == "\n")
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
          tokenPages.push(this.lessonTokens.text.slice(pageStartIndex, groupEndIndex));
          pageStartIndex = groupEndIndex;
        }
      }
      //last page
      tokenPages.push(this.lessonTokens.text.slice(pageStartIndex));
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
          level: VocabLevelSchema.NEW,
          isPhrase: true,
          notes: null,
          language: this.lesson!.language,
          meanings: [],
          learnerMeanings: [],
          ttsPronunciations: [],
        };
    },
    isSelectedNewPhrase() {
      if (!this.selectedVocab)
        return false;
      return (this.selectedVocab.isPhrase && this.selectedVocab.level == VocabLevelSchema.NEW);
    },
    isLoading() {
      return this.isLoadingLesson || this.isLoadingWords || this.isParsingLesson;
    },
    imageUrl() {
      return (this.lesson!.image || this.lesson!.course?.image) ?? "";
    },
    audioUrl() {
      return this.lesson?.audio ?? "";
    },
  },
  watch: {
    async lessonId() {
      await this.fetchLesson();
      if (this.lesson!.language !== this.languageCode) {
        await this.$router.push({name: "not-found"});
        return;
      }
      await this.lessonStore.addLessonToUserHistory({lessonId: this.lessonId});
      await this.fetchLessonVocabs();
      this.parseLesson();
    }
  },
  async mounted() {
    await this.fetchLesson();
    if (this.lesson!.language !== this.languageCode) {
      await this.$router.push({name: "not-found"});
      return;
    }
    await this.lessonStore.addLessonToUserHistory({lessonId: this.lessonId});
    await this.fetchLessonVocabs();
    this.parseLesson();
  },
  methods: {
    async fetchLesson() {
      this.isLoadingLesson = true;
      this.lesson = await this.lessonStore.fetchLesson({lessonId: this.lessonId});
      this.lesson.text = this.lesson.text.replace(/[\r\n]{3,}/g, "\n\n");
      this.isLoadingLesson = false;
    },
    async finishLesson() {
      if (this.lesson!.course && !this.lesson!.isLastInCourse) {
        const lesson = await this.lessonStore.fetchNextLesson({
          courseId: this.lesson!.course?.id,
          lessonId: this.lesson!.id
        });
        await this.$router.push({params: {lessonId: lesson!.id}});
      } else
        this.$router.push({name: "home"});
    },
    async fetchLessonVocabs() {
      this.isLoadingWords = true;
      const lessonVocabs = await this.vocabStore.fetchLessonVocabs({lessonId: this.lessonId}, {});
      const words: Record<string, LearnerVocabSchema> = {};
      const phrases: Record<string, LearnerVocabSchema> = {};
      for (const vocab of lessonVocabs) {
        if (!vocab.isPhrase)
          words[vocab.text] = vocab;
        else
          phrases[vocab.text] = vocab;
      }
      this.words = words;
      this.phrases = phrases;
      this.isLoadingWords = false;
    },
    setSelectedTokens(selectedTokens: LessonTokenObject[]) {
      this.selectedTokens = selectedTokens;
      this.selectedOverLappingPhrasesTokens = null;
    },
    clearSelectedTokens() {
      this.selectedTokens = [];
      this.selectedOverLappingPhrasesTokens = null;
    },
    showOverlappingPhrases(overlappingPhrasesTokens: LessonTokenObject[][]) {
      this.clearSelectedTokens();
      this.selectedOverLappingPhrasesTokens = overlappingPhrasesTokens;
    },
    onNewVocabCreated(vocab: LearnerVocabSchema) {
      if (vocab.isPhrase) {
        this.phrases[vocab.text] = vocab;
        this.parsePhraseInTokens(this.lesson!.parsedTitle!, this.matchIndexToTokenIndex.title, this.lessonTokens!.title, vocab.text);
        this.parsePhraseInTokens(this.lesson!.parsedText!, this.matchIndexToTokenIndex.text, this.lessonTokens!.text, vocab.text);
        if (this.$refs.lessonContentRef)
          (this.$refs.lessonContentRef as InstanceType<typeof LessonContent>).clearTokenTextSelection();
      }
    },
    updateVocabData(vocab: LearnerVocabSchema, updatedVocabData: Partial<LearnerVocabSchema>) {
      const updatedVocab = {...vocab, ...updatedVocabData};
      if (vocab.isPhrase)
        this.phrases[vocab.text] = updatedVocab;
      else
        this.words[vocab.text] = updatedVocab;
      if (this.selectedVocab && this.selectedVocab.text === vocab.text) {
        if ([VocabLevelSchema.IGNORED, VocabLevelSchema.KNOWN].includes(updatedVocabData.level!))
          this.clearSelectedTokens();
      }
    },
    deleteVocabData(vocab: LearnerVocabSchema) {
      const newVocab = {
        id: vocab.id,
        text: vocab.text,
        level: VocabLevelSchema.NEW,
        isPhrase: vocab.isPhrase,
        notes: null,
        language: vocab.language,
        meanings: vocab.meanings,
        learnerMeanings: [],
        ttsPronunciations: []
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
    parseLesson() {
      this.isParsingLesson = true;
      const titleTokens = this.parseStringToTokens(this.lesson!.title, this.matchIndexToTokenIndex.title, 0);
      const textTokens = this.parseStringToTokens(this.lesson!.text, this.matchIndexToTokenIndex.text, titleTokens.length);
      this.lessonTokens = {title: titleTokens, text: textTokens};
      this.isParsingLesson = false;
    },
    parseStringToTokens(text: string, matchIndexToTokenIndex: Record<number, number>, firstIndex: number): LessonTokenObject[] {
      const parser = getParser(this.lesson!.language);
      const tokens = parser.detectPhrases(text, Object.keys(this.phrases)) as LessonTokenObject[];
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
    parsePhraseInTokens(parsedText: string, matchIndexToTokenIndex: Record<number, number>, tokens: LessonTokenObject[], phraseText: string) {
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
      lessonStore: inject<ReturnType<typeof useLessonStore>>("lessonStore", useLessonStore()),
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

.lesson-content {
  width: 100%;
}

.bottom-div {
  display: flex;
  flex-direction: column;
  width: 100%;
}

audio {
  max-height: 2rem;
}

.paging-div {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
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
    grid-template-rows: 50vh 1fr;
    grid-template-columns: auto;
    column-gap: 0;
    height: auto;
  }

  .side-panel {
    min-height: 25vh;
  }

  .main-reader {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: 90% auto;
    column-gap: 0;
  }

  .lesson-content {

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
