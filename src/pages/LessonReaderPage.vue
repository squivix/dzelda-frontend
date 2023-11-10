<template>
  <LoadingScreen v-if="isLoading||!lessonElements"/>
  <base-card class="base-card" v-else-if="lesson">
    <template v-slot:all>
      <div class="content-and-side-div">
        <TheLessonContent
            ref="theLessonContentRef"
            :title="lesson.title"
            :text="lesson.text"
            :lessonElements="lessonElements"
            :image="imageUrl"
            :words="words"
            :phrases="phrases"
            class="lesson-content"
            @onWordClicked="setSelectedVocab"
            @onPhraseClicked="setSelectedVocab"
            @onOverLappingPhrasesClicked="showOverlappingPhrases"
            @onNewPhraseSelected="selectNewPhrase"
            @onBackgroundClicked="clearSelectedVocab"
            @onScroll="(position)=>lessonTextScrollPosition=position">
        </TheLessonContent>
        <ReaderSidePanel
            :selected-overlapping-phrases="selectedOverLappingPhrases"
            :selected-vocab="selectedVocab"
            :lessonTextScrollPosition="lessonTextScrollPosition"
            :selected-is-phrase="selectedIsPhrase"
            @onMeaningAdded="onMeaningAdded"
            @onVocabLevelSet="onVocabLevelSet"
            @onMeaningDeleted="onMeaningDeleted"
            @onOverlappingPhraseClicked="setSelectedVocab"
            @onVocabNotesSet="onVocabNotesSet">
        </ReaderSidePanel>
      </div>
      <div class="bottom-div">
        <div>
          <audio v-if="lesson.audio" controls :src="lesson.audio">
            Your browser does not support the audio element.
          </audio>
        </div>
        <!-- TODO move to expanding button component-->
        <button v-if="!lesson.isLastInCourse"
                class="next-lesson-button secondary-filled-button icon-button capsule-button" @click="fetchNextLesson">
          <span :class="{'no-text': lessonTextScrollPosition == 'middle'}">Next Lesson</span>
          <inline-svg :src="icons.arrowRight"/>
        </button>
        <router-link v-else
                     :to="{name:'home'}"
                     class="next-lesson-button secondary-filled-button icon-button capsule-button">
          <inline-svg :src="icons.checkMark"/>
          <span :class="{'no-text': lessonTextScrollPosition == 'middle'}">Finish Course</span>
        </router-link>
      </div>
    </template>
  </base-card>
</template>
<script lang="ts">
import TheLessonContent from "@/components/page/reader/TheLessonContent.vue";
import TheMeaningPanel from "@/components/shared/vocab-panel/TheMeaningPanel.vue";
import constants from "@/constants.js";
import OverlappingPhrasesPanel from "@/components/page/reader/OverlappingPhrasesPanel.vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {LearnerVocabSchema, LessonSchema, MeaningSchema, VocabLevelSchema} from "dzelda-types";
import {useStore} from "@/stores/backend/rootStore.js";
import {defineComponent, PropType} from "vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import ReaderSidePanel from "@/components/page/reader/ReaderSidePanel.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import AuthHeader from "@/App.vue";

export type PhrasesElementAppearsIn = { [text: string]: { index: number, length: number } }
export type LessonElement = { text: string, isWord: boolean, phrases: PhrasesElementAppearsIn }
export type NewVocab = Omit<LearnerVocabSchema, "id" | "addedOn">
export default defineComponent({
  name: "LessonReaderPage",
  components: {AuthHeader, InlineSvg, ReaderSidePanel, LoadingScreen, TheLessonContent, TheMeaningPanel, OverlappingPhrasesPanel},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string, lessonId: number }>, required: true}
  },
  data() {
    return {
      lesson: null as LessonSchema | null,
      words: {} as Record<string, LearnerVocabSchema>,
      phrases: {} as Record<string, LearnerVocabSchema | NewVocab>,
      selectedVocab: null as LearnerVocabSchema | NewVocab | null,
      selectedIsPhrase: false,
      selectedOverLappingPhrases: null as string[] | null,
      lessonElements: null as { title: LessonElement[], text: LessonElement[] } | null,
      isLoadingLesson: true,
      isLoadingWords: true,
      isParsingLesson: true,
      lessonTextScrollPosition: "top" as "top" | "bottom" | "middle",
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
    vocabs() {
      return {...this.words, ...this.phrases};
    },
  },
  watch: {
    // pathParams() {
    //   this.fetchLessonData()
    // }
  },
  async mounted() {
    await this.lessonStore.addLessonToUserHistory({lessonId: this.pathParams.lessonId});
    await this.fetchLesson();
    await this.fetchWordsLevels();
    await this.parseLesson();
  },
  methods: {
    // async fetchLessonData() {
    //
    // },
    async fetchLesson() {
      this.isLoadingLesson = true;
      this.lesson = await this.lessonStore.fetchLesson({lessonId: this.pathParams.lessonId});
      this.lesson.text = this.lesson.text.replace(/[\r\n]{3,}/g, "\n\n");
      this.isLoadingLesson = false;
    },
    async fetchNextLesson() {
      const lesson = await this.lessonStore.fetchNextLesson({courseId: this.lesson!.course.id, lessonId: this.lesson!.id});
      await this.$router.push({...this.$route, params: {lessonId: lesson!.id}});
    },
    async fetchWordsLevels() {
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
    setSelectedVocab(vocabText: string) {
      this.selectedVocab = {...this.vocabs[vocabText.toLowerCase()], text: vocabText};
      this.selectedIsPhrase = !!this.phrases[vocabText.toLowerCase()];
      this.selectedOverLappingPhrases = null;
    },
    selectNewPhrase(phraseText: string) {
      this.selectedVocab = {
        text: phraseText,
        level: VocabLevelSchema.NEW,
        isPhrase: true,
        notes: null,
        language: "en",
        meanings: [],
        learnerMeanings: []
      };
      this.selectedIsPhrase = true;
      this.selectedOverLappingPhrases = null;
    },
    clearSelectedVocab() {
      this.selectedVocab = null;
      this.selectedOverLappingPhrases = null;
    },
    showOverlappingPhrases(phrasesText: string[]) {
      this.selectedOverLappingPhrases = phrasesText;
    },
    onMeaningAdded(vocab: LearnerVocabSchema, newMeaning: MeaningSchema) {
      const key = vocab.text.toLowerCase();
      if (vocab.level === constants.ALL_VOCAB_LEVELS.KNOWN || vocab.level === constants.ALL_VOCAB_LEVELS.IGNORED)
        vocab.level = constants.ALL_VOCAB_LEVELS.LEVEL_1;
      if (!(key in this.vocabs)) {
        //only for new phrases
        this.phrases[key] = vocab;
        //TODO: find less expensive solution to update lessonElements where the new phrase was added
        this.parseLesson();
        this.onVocabLevelSet(vocab, vocab.level);
      } else
        this.onVocabLevelSet(vocab, vocab.level);
      this.vocabs[key].learnerMeanings.push(newMeaning);
      (this.vocabs[key] as LearnerVocabSchema).id = vocab.id;
      this.setSelectedVocab(vocab.text);
    },
    onVocabLevelSet(vocab: LearnerVocabSchema | NewVocab, level: VocabLevelSchema) {
      const key = vocab.text.toLowerCase();
      this.vocabs[key].level = level;
      if (level === VocabLevelSchema.IGNORED || level === VocabLevelSchema.KNOWN) {
        this.vocabs[key].learnerMeanings = [];
        this.clearSelectedVocab();
        if (level === VocabLevelSchema.IGNORED && this.phrases[key])
          this.phrases[key].level = VocabLevelSchema.NEW;
      } else
        this.setSelectedVocab(vocab.text);
    },
    onVocabNotesSet(vocab: LearnerVocabSchema, notes: string) {
      const key = vocab.text.toLowerCase();
      this.vocabs[key].notes = notes;
    },
    onMeaningDeleted(word: LearnerVocabSchema, deletedMeaning: MeaningSchema) {
      const index = word.learnerMeanings.findIndex((meaning) => meaning.id === deletedMeaning.id);
      word.learnerMeanings.splice(index, 1);
      if (word.learnerMeanings.length === 0)
        this.onVocabLevelSet(word, constants.ALL_VOCAB_LEVELS.NEW);
    },
    async parseLesson() {
      this.isParsingLesson = true;
      this.lessonElements = {
        title: await this.parseStringToElements(this.lesson!.title),
        text: await this.parseStringToElements(this.lesson!.text)
      };
      this.isParsingLesson = false;
    },
    async parseStringToElements(text: string): Promise<LessonElement[]> {
      return new Promise((resolve) => {
        // wrap in whitespace to allow regex to detect phrases at the beginning of text
        text = ` ${text} `;

        const textElements: LessonElement[] = this.getTextElements(text).map(element => ({
          text: element,
          isWord: !!this.words[element.toLowerCase()],
          phrases: {} as PhrasesElementAppearsIn
        }));

        const phrases = Object.keys(this.phrases);
        for (const phrase of phrases) {
          //detect every phrase surrounded by non letters and non-numbers
          const regex = new RegExp(`[^\\p{L}\\d]${phrase}[^\\p{L}\\d]`, "igu");
          const matches = text.matchAll(regex);
          for (let match of matches) {
            const beforePhraseIndex = this.getTextElements(text.substring(0, match.index)).length;
            const phraseSlice = this.getTextElements(match[0]);
            const phraseElements = textElements.slice(beforePhraseIndex, beforePhraseIndex + phraseSlice.length);
            phraseElements.forEach((pe, index) => pe.phrases[phrase] = {
              index: index,
              length: phraseElements.length
            });
          }
        }
        resolve(textElements);
      });
    },
    getTextElements(paragraph: string) {
      return paragraph.split(/([^\p{L}\d])/gu).filter((word) => word !== "");
    }
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

<style>
body {
  user-select: none;
}
</style>

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

.meaning-panel-wrapper:deep(.meaning-sub-panel) {
  height: 100%;
}

.next-lesson-button {
  height: 2rem;
}

.next-lesson-button:hover {
  text-decoration: none;
}

.next-lesson-button span {
  transition: font-size 1s;
}

.no-text {
  font-size: 0;
}

audio {
  max-height: 2rem;
}
</style>
