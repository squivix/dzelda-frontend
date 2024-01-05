<template>
  <LoadingScreen v-if="isLoading||!lessonTokens"/>
  <BaseCard class="base-card unselectable" v-else-if="lesson">
    <template v-slot:all>
      <div class="content-and-side-div">
        <LessonContent ref="theLessonContentRef"
                       :title="lesson.title"
                       :text="lesson.text"
                       :lessonTokens="lessonTokens"
                       :image="imageUrl"
                       :words="words"
                       :phrases="phrases"
                       class="lesson-content"
                       @onWordClicked="setSelectedVocab"
                       @onPhraseClicked="setSelectedVocab"
                       @onOverLappingPhrasesClicked="showOverlappingPhrases"
                       @onNewPhraseSelected="selectNewPhrase"
                       @onBackgroundClicked="clearSelectedVocab"/>
        <ReaderSidePanel class="side-panel"
                         :selectedOverlappingPhrases="selectedOverLappingPhrases"
                         :selectedVocab="selectedVocab"
                         @onVocabUpdated="updateVocabData"
                         @onVocabDeleted="deleteVocabData"
                         @onNewVocabCreated="onNewVocabCreated"
                         @onOverlappingPhraseClicked="setSelectedVocab"
                         :onVocabRefetched="updateVocab"/>
      </div>
      <div class="bottom-div">
        <div>
          <audio v-if="lesson.audio" controls :src="audioUrl">
            Your browser does not support the audio element.
          </audio>
        </div>
        <ExpandingIconButton v-if="!lesson.isLastInCourse"
                             :isExpanded="isNextButtonExpanded"
                             :iconSrc="icons.arrowRight" @onClick="goToNextLesson"
                             iconPosition="right"
                             text="Next Lesson" class="next-lesson-button"/>
        <ExpandingIconButton v-else :isExpanded="isNextButtonExpanded" :iconSrc="icons.checkMark"
                             text="Finish Course" :linkTo="{name:'home'}"/>
      </div>
    </template>
  </BaseCard>
</template>
<script lang="ts">
import LessonContent from "@/components/page/reader/LessonContent.vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {
  getParser,
  LearnerVocabSchema,
  LessonSchema,
  TokenWithPhrases,
  TokeObjectPhrases,
  VocabLevelSchema
} from "dzelda-common";
import {useStore} from "@/stores/backend/rootStore.js";
import {defineComponent, PropType} from "vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import ReaderSidePanel from "@/components/page/reader/ReaderSidePanel.vue";
import {icons} from "@/icons.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import ExpandingIconButton from "@/components/ui/ExpandingIconButton.vue";
import {useTimeoutFn} from "@vueuse/core";

export type NewVocab = Omit<LearnerVocabSchema, "id">
export type LessonTokenObject = Omit<TokenWithPhrases, "phrases"> & {
  index: number,
  parsedText: string,
  phrases: Array<TokeObjectPhrases[number] & { phraseId: number }>
}

export default defineComponent({
  name: "LessonReaderPage",
  components: {ExpandingIconButton, BaseCard, ReaderSidePanel, LoadingScreen, LessonContent},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string, lessonId: number }>, required: true},
  },
  data() {
    return {
      lesson: null as LessonSchema | null,
      words: {} as Record<string, LearnerVocabSchema>,
      phrases: {} as Record<string, LearnerVocabSchema>,
      selectedVocab: null as LearnerVocabSchema | NewVocab | null,
      selectedOverLappingPhrases: null as LearnerVocabSchema[] | null,
      lessonTokens: null as { title: LessonTokenObject[], text: LessonTokenObject[] } | null,
      matchIndexToTokenIndex: {title: {}, text: {}} as { title: Record<number, number>, text: Record<number, number> },
      isLoadingLesson: true,
      isLoadingWords: true,
      isParsingLesson: true,
      isNextButtonExpanded: true,
    };
  },
  computed: {
    isLoading() {
      return this.isLoadingLesson || this.isLoadingWords || this.isParsingLesson;
    },
    imageUrl() {
      const imagePath = this.lesson!.image || this.lesson!.course.image;
      if (imagePath)
        return `${this.store.resourceUrl}/${imagePath}`;
      return "";
    },
    audioUrl() {
      const audioPath = this.lesson!.audio;
      if (audioPath)
        return `${this.store.resourceUrl}/${audioPath}`;
      return "";
    },
  },
  async mounted() {
    await this.fetchLesson();
    if (this.lesson!.course.language != this.pathParams.learningLanguage) {
      await this.$router.push({name: "not-found"});
      return;
    }
    await this.lessonStore.addLessonToUserHistory({lessonId: this.pathParams.lessonId});
    await this.fetchLessonVocabs();
    await this.parseLesson();
    useTimeoutFn(() => this.isNextButtonExpanded = false, 3000);
  },
  methods: {
    async fetchLesson() {
      this.isLoadingLesson = true;
      this.lesson = await this.lessonStore.fetchLesson({lessonId: this.pathParams.lessonId});
      this.lesson.text = this.lesson.text.replace(/[\r\n]{3,}/g, "\n\n");
      this.isLoadingLesson = false;
    },
    async goToNextLesson() {
      const lesson = await this.lessonStore.fetchNextLesson({
        courseId: this.lesson!.course.id,
        lessonId: this.lesson!.id
      });
      await this.$router.push({params: {lessonId: lesson!.id}});
    },
    async fetchLessonVocabs() {
      this.isLoadingWords = true;
      const lessonVocabs = await this.vocabStore.fetchLessonVocabs({lessonId: this.pathParams.lessonId}, {});
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
    setSelectedVocab(vocab: LearnerVocabSchema) {
      this.selectedVocab = vocab;
      this.selectedOverLappingPhrases = null;
    },
    clearSelectedVocab() {
      this.selectedVocab = null;
      this.selectedOverLappingPhrases = null;
    },
    showOverlappingPhrases(phrases: LearnerVocabSchema[]) {
      this.selectedOverLappingPhrases = phrases;
    },
    selectNewPhrase(phraseText: string) {
      this.selectedVocab = {
        text: phraseText,
        level: VocabLevelSchema.NEW,
        isPhrase: true,
        notes: null,
        language: this.lesson!.course.language,
        meanings: [],
        learnerMeanings: []
      };
      this.selectedOverLappingPhrases = null;
    },
    onNewVocabCreated(vocab: LearnerVocabSchema) {
      if (vocab.isPhrase) {
        this.phrases[vocab.text] = vocab;
        this.parsePhraseInTokens(this.lesson!.title, this.lesson!.parsedTitle!, this.matchIndexToTokenIndex.title, this.lessonTokens!.title, vocab.text);
        this.parsePhraseInTokens(this.lesson!.text, this.lesson!.parsedText!, this.matchIndexToTokenIndex.text, this.lessonTokens!.text, vocab.text);
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
          this.clearSelectedVocab();
        else
          this.setSelectedVocab(updatedVocab);
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
        learnerMeanings: []
      };
      if (vocab.isPhrase)
        this.phrases[vocab.text] = newVocab;
      else
        this.words[vocab.text] = newVocab;
      if (this.selectedVocab && this.selectedVocab.text === vocab.text)
        this.clearSelectedVocab();
    },
    async updateVocab(updatedVocab: LearnerVocabSchema) {
      if (updatedVocab.isPhrase)
        this.phrases[updatedVocab.text] = updatedVocab;
      else
        this.words[updatedVocab.text] = updatedVocab;
      if (this.selectedVocab && this.selectedVocab.text == updatedVocab.text)
        this.setSelectedVocab(updatedVocab);
    },
    async parseLesson() {
      this.isParsingLesson = true;
      const titleTokens = this.parseStringToTokens(this.lesson!.title, this.matchIndexToTokenIndex.title, 0);
      const textTokens = this.parseStringToTokens(this.lesson!.text, this.matchIndexToTokenIndex.text, titleTokens.length);
      this.lessonTokens = {title: titleTokens, text: textTokens};
      this.isParsingLesson = false;
    },
    parseStringToTokens(text: string, matchIndexToTokenIndex: Record<number, number>, firstIndex: number): LessonTokenObject[] {
      const parser = getParser(this.lesson!.course.language);
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
    parsePhraseInTokens(text: string, parsedText: string, matchIndexToTokenIndex: Record<number, number>, tokens: LessonTokenObject[], phraseText: string) {
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
      store: useStore(),
      lessonStore: useLessonStore(),
      vocabStore: useVocabStore()
    };
  }
});
</script>

<style scoped>
.base-card {
  width: 80vw;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  border-radius: 20px;
  max-width: 1150px;
  padding: 40px min(5vw, 20px) 10px min(5vw, 20px);
  margin-bottom: 0;
}

.content-and-side-div {
  display: grid;
  grid-template-columns: 2fr 1.3fr;
  grid-template-rows: 70vh;
  column-gap: 2rem;
}

.bottom-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.next-lesson-button {
  height: 2rem;
}

audio {
  max-height: 2rem;
}

@media screen and (max-width: 750px) {
  .content-and-side-div {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }

  .lesson-content {
    max-height: 500px;
  }
}

</style>
