<template>
  <base-card v-if="!loading && lesson">
    <template v-slot:all>
      <the-lesson-content
          :title="lesson.title"
          :text="lesson.text"
          :lessonElements="lessonElements"
          :image="imageUrl"
          :audio="lesson.audio"
          :words="words"
          :phrases="phrases"
          class="lesson-content"
          @onWordClicked="setSelectedVocab"
          @onPhraseClicked="setSelectedVocab"
          @onOverLappingPhrasesClicked="showOverlappingPhrases"
          @onNewPhraseSelected="selectNewPhrase"
          @onBackgroundClicked="clearSelectedVocab">
      </the-lesson-content>
      <the-meaning-panel v-if="!selectedOverLappingPhrases"
                         class="meaning-panel-wrapper"
                         :vocab="selectedVocab"
                         :is-phrase="selectedIsPhrase"
                         @onMeaningAdded="onMeaningAdded"
                         @onVocabLevelSet="onVocabLevelSet"
                         @onMeaningDeleted="onMeaningDeleted">
      </the-meaning-panel>
      <overlapping-phrases-panel v-else
                                 :phrases="selectedOverLappingPhrases"
                                 @onPhraseClick="setSelectedVocab">
      </overlapping-phrases-panel>
    </template>
  </base-card>
</template>
<script lang="ts">
import TheLessonContent from "@/components/page/reader/TheLessonContent.vue";
import TheMeaningPanel from "@/components/shared/vocab-panel/TheMeaningPanel.vue";
import constants from "@/constants.js";
import {getTextElements} from "@/components/page/reader/shared.js";
import OverlappingPhrasesPanel from "@/components/page/reader/OverlappingPhrasesPanel.vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {LessonSchema} from "dzelda-types";
import {useStore} from "@/stores/backend/rootStore.js";

export default {
  name: "LessonReaderPage",
  components: {OverlappingPhrasesPanel, TheLessonContent, TheMeaningPanel},
  data() {
    return {
      loadingLesson: true,
      loadingWords: true,
      parsingLesson: true,
      lesson: null as LessonSchema | null,
      words: {},
      phrases: {},
      selectedVocab: null,
      selectedIsPhrase: false,
      selectedOverLappingPhrases: null,
      lessonElements: null,
    };
  },
  async mounted() {
    await this.lessonStore.addLessonToUserHistory({lessonId: Number(this.$route.params.lessonId as string)});
    await this.fetchLesson();
    await this.fetchWordsLevels();
    this.parseLesson();
  },
  computed: {
    loading() {
      return this.loadingLesson || this.loadingWords || this.parsingLesson;
    },
    imageUrl() {
      const imagePath = this.lesson!.image || this.lesson!.course.image;
      if (imagePath)
        return `${this.store.resourceUrl}/${imagePath}`
      return "";
    },
    vocab() {
      return {...this.words, ...this.phrases};
    }
  },
  methods: {
    async fetchLesson() {
      this.loadingLesson = true;
      this.lesson = await this.lessonStore.fetchLesson({lessonId: Number(this.$route.params.lessonId as string)});
      this.lesson.text = this.lesson.text.replace(/[\r\n]{3,}/g, "\n\n");
      this.loadingLesson = false;
    },
    async fetchWordsLevels() {
      this.loadingWords = true;
      const lessonVocabs = await this.vocabStore.fetchLessonVocabs({lessonId: Number(this.$route.params.lessonId as string)}, {});

      this.words = lessonVocabs.filter(v => !v.isPhrase).reduce((obj, w) => ({...obj, [w.text]: w}), {});
      this.phrases = lessonVocabs.filter(v => v.isPhrase).reduce((obj, p) => ({...obj, [p.text]: p}), {});
      this.loadingWords = false;
    },
    setSelectedVocab(vocabText: string) {
      this.selectedVocab = {text: vocabText, ...this.vocab[vocabText.toLowerCase()]};
      this.selectedIsPhrase = !!this.phrases[vocabText.toLowerCase()];
      this.selectedOverLappingPhrases = null;
    },
    selectNewPhrase(phraseText) {
      this.selectedVocab = {
        text: phraseText,
        level: constants.ALL_VOCAB_LEVELS.NEW,
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
    showOverlappingPhrases(phrasesText) {
      this.selectedOverLappingPhrases = phrasesText;
    },
    onMeaningAdded(vocab, newMeaning) {
      const key = vocab.text.toLowerCase();
      if (vocab.level === constants.ALL_VOCAB_LEVELS.KNOWN || vocab.level === constants.ALL_VOCAB_LEVELS.IGNORED)
        vocab.level = constants.ALL_VOCAB_LEVELS.LEVEL_1;
      if (this.vocab[key] === undefined) {
        //only for new phrases
        this.phrases[key] = vocab;
        //TODO: find less expensive solution to update lessonElements where the new phrase was added
        this.parseLesson();
        this.onVocabLevelSet(vocab, vocab.level);
      } else
        this.onVocabLevelSet(vocab, vocab.level);
      this.vocab[key].learnerMeanings.push(newMeaning);
      this.vocab[key].id = vocab.id;
      this.setSelectedVocab(vocab.text);
    },
    onVocabLevelSet(vocab, level) {

      const key = vocab.text.toLowerCase();
      this.vocab[key].level = level;
      if (level === constants.ALL_VOCAB_LEVELS.IGNORED || level === constants.ALL_VOCAB_LEVELS.KNOWN) {
        this.vocab[key].learnerMeanings = [];
        this.clearSelectedVocab();
        if (level === constants.ALL_VOCAB_LEVELS.IGNORED && this.phrases[key])
          this.phrases[key] = constants.ALL_VOCAB_LEVELS.NEW;
      } else
        this.setSelectedVocab(vocab.text);
    },
    onMeaningDeleted(word, deleted_meaning) {
      const index = word.learnerMeanings.findIndex((meaning) => meaning.id === deleted_meaning.id);
      word.learnerMeanings.splice(index, 1);
      if (word.learnerMeanings.length === 0)
        this.onVocabLevelSet(word, constants.ALL_VOCAB_LEVELS.NEW);
    },
    parseLesson() {
      this.parsingLesson = true;
      this.lessonElements = {
        title: this.parseStringToElements([this.lesson.title])[0],
        text: this.parseStringToElements(this.lessonParagraphs(this.lesson.text))
      };
      this.parsingLesson = false;
    },
    parseStringToElements(texts: string[]) {
      let paragraphList = [];

      const phrases = Object.keys(this.phrases);
      // wrap every paragraph in whitespace to allow regex to detect phrases at the beginning of paragraph
      texts = texts.map(text => ` ${text} `);

      for (let paragraph of texts) {
        let elements = getTextElements(paragraph);
        let paragraphElements = [];
        for (let element of elements)
          paragraphElements.push({
            text: element,
            isWord: !!this.words[element.toLowerCase()],
            phrases: {}
          });

        for (let phrase of phrases) {
          //detect every phrase surrounded by non letters and non-numbers
          let regex = new RegExp(`[^\\p{L}\\d]${phrase}[^\\p{L}\\d]`, "igu");
          let matches = paragraph.matchAll(regex);
          for (let match of matches) {
            let beforePhraseIndex = getTextElements(paragraph.substring(0, match.index)).length;
            let phraseSlice = getTextElements(match[0]);
            const phraseElements = paragraphElements.slice(beforePhraseIndex, beforePhraseIndex + phraseSlice.length);
            phraseElements.forEach((pe, index) => pe.phrases[phrase] = {
              index: index,
              length: phraseElements.length
            });

          }
        }
        paragraphList.push(paragraphElements);
      }
      return paragraphList;
    },

    lessonParagraphs(text) {
      return text.split(/\s\s+/g);
    },
  },
  setup() {
    return {
      store: useStore(),
      lessonStore: useLessonStore(),
      vocabStore: useVocabStore()
    }
  }
};
</script>
<style>
body {
  user-select: none;
}
</style>
<style scoped>
.base-card {
  width: 80vw;
  display: grid;
  grid-template-columns: 2fr 1.3fr;
  grid-template-rows: 70vh;
  margin: auto;
  column-gap: 2rem;
  border-radius: 20px;
  max-width: 1150px;
  padding: 40px min(5vw, 20px);
}

.lesson-content {
}

.meaning-panel-wrapper:deep(.meaning-sub-panel) {
  height: 100%;
}
</style>
