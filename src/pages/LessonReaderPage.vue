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
                         :selectedIsPhrase="selectedVocab?.isPhrase"
                         @onMeaningAdded="onMeaningAdded"
                         @onVocabLevelSet="onVocabLevelSet"
                         @onMeaningDeleted="onMeaningDeleted"
                         @onOverlappingPhraseClicked="setSelectedVocab"
                         @onVocabNotesSet="onVocabNotesSet"
                         @onNewPhraseAdded="onNewPhraseAdded"
                         @onVocabRemovedFromUser="onVocabRemovedFromUser"
        />
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
import {LearnerVocabSchema, LessonSchema, MeaningSchema, VocabLevelSchema} from "dzelda-types";
import {useStore} from "@/stores/backend/rootStore.js";
import {defineComponent, PropType} from "vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import ReaderSidePanel from "@/components/page/reader/ReaderSidePanel.vue";
import {icons} from "@/icons.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import ExpandingIconButton from "@/components/ui/ExpandingIconButton.vue";
import {useTimeoutFn} from "@vueuse/core";

export type PhrasesTokenAppearsIn = { [text: string]: { phraseId: number, index: number, length: number } }
export type LessonTokenObject = { text: string, isWord: boolean, phrases: PhrasesTokenAppearsIn }
export type NewVocab = Omit<LearnerVocabSchema, "id">
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
    onNewPhraseAdded(vocab: LearnerVocabSchema) {
      if (vocab.isPhrase) {
        this.phrases[vocab.text] = vocab;
        this.parsePhraseInTokens(this.lesson!.title, this.lessonTokens!.title, vocab.text);
        this.parsePhraseInTokens(this.lesson!.text, this.lessonTokens!.text, vocab.text);
      }
    },
    async onMeaningAdded(vocabId: number, newMeaning: MeaningSchema) {
      const updatedVocab = await this.updateVocab(vocabId);
      this.setSelectedVocab(updatedVocab);
    },
    async onMeaningDeleted(vocabId: number, deletedMeaning: MeaningSchema) {
      const updatedVocab = await this.updateVocab(vocabId);
      this.setSelectedVocab(updatedVocab);
    },
    async onVocabNotesSet(vocabId: number, notes: string) {
      const updatedVocab = await this.updateVocab(vocabId);
      this.setSelectedVocab(updatedVocab);
    },
    onVocabRemovedFromUser(removedVocab: LearnerVocabSchema) {
      if (removedVocab.isPhrase) {
        this.phrases[removedVocab.text].level = VocabLevelSchema.NEW;
        this.phrases[removedVocab.text].learnerMeanings = [];
      } else {
        this.words[removedVocab.text].level = VocabLevelSchema.NEW;
        this.words[removedVocab.text].learnerMeanings = [];
      }
      this.clearSelectedVocab();
    },
    async onVocabLevelSet(vocabId: number, level: VocabLevelSchema) {
      const updatedVocab = await this.updateVocab(vocabId);
      if (level === VocabLevelSchema.IGNORED || level === VocabLevelSchema.KNOWN)
        this.clearSelectedVocab();
      else
        this.setSelectedVocab(updatedVocab);
    },
    async parseLesson() {
      this.isParsingLesson = true;
      this.lessonTokens = {
        title: await this.parseStringToTokens(this.lesson!.title),
        text: await this.parseStringToTokens(this.lesson!.text)
      };
      this.isParsingLesson = false;
    },
    async parseStringToTokens(text: string): Promise<LessonTokenObject[]> {
      return new Promise((resolve) => {
        const textTokens: LessonTokenObject[] = this.getTextTokens(text).map(tokenText => ({
          text: tokenText,
          isWord: !!this.words[tokenText.toLowerCase()],
          phrases: {} as PhrasesTokenAppearsIn
        }));

        for (const phraseText of Object.keys(this.phrases))
          this.parsePhraseInTokens(text, textTokens, phraseText);
        resolve(textTokens);
      });
    },
    parsePhraseInTokens(text: string, textTokens: LessonTokenObject[], phraseText: string) {
      //detect every phrase surrounded by non letters and non-numbers
      //TODO also get rid of this client side parsing as well as all toLowerCases in reader page
      const regex = new RegExp(`([^\\p{L}\\d]|^)${phraseText}([^\\p{L}\\d]|$)`, "igu");
      for (let match of text.matchAll(regex)) {
        const beforePhraseIndex = this.getTextTokens(text.substring(0, match.index)).length;
        const phraseSlice = this.getTextTokens(match[0]);
        const phraseTokens = textTokens.slice(beforePhraseIndex, beforePhraseIndex + phraseSlice.length);
        phraseTokens.forEach((pe, index) => pe.phrases[phraseText] = {
          phraseId: this.phrases[phraseText].id,
          index: index,
          length: phraseTokens.length,
        });
      }
    },
    getTextTokens(paragraph: string) {
      //TODO get rid of this client side parsing, replace with same code as server shared or called through API
      return paragraph.split(/([^\p{L}\d])/gu).filter((word) => word !== "");
    },
    async updateVocab(vocabId: number) {
      const updatedVocab = await this.vocabStore.fetchUserVocab({vocabId: vocabId!});
      if (updatedVocab.isPhrase)
        this.phrases[updatedVocab.text] = updatedVocab;
      else
        this.words[updatedVocab.text] = updatedVocab;
      return updatedVocab;
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
