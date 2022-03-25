<template>
  <base-card v-if="!loading">
    <template v-slot:all>
      <div class="lesson">
        <h2>
          <span
            v-for="(word, index) in paragraphWords(lesson.title)"
            :key="index"
            :class="getWordClass(word)"
            >{{ word }}</span
          >
        </h2>
        <div class="lesson-text">
          <p v-for="(paragraph, index) in lessonParagraphs" :key="index">
            <span
              v-for="(word, index) in paragraphWords(paragraph)"
              :data-level="getWordLevel(word)"
              :key="index"
            >
              <span v-if="isWord(word)" :class="getWordClass(word)">{{
                word
              }}</span>
              <template v-else>{{ word }}</template>
            </span>
          </p>
        </div>
      </div>
      <div class="word-panel"></div>
    </template>
  </base-card>
</template>
<script>
export default {
  data() {
    return { loadingLesson: true, loadingWords: true, lesson: null, words: {} };
  },
  async created() {
    this.fetchLesson();
    this.fetchWordsLevels();
  },
  computed: {
    loading() {
      return this.loadingLesson || this.loadingWords;
    },
    lessonParagraphs() {
      return this.lesson.text.split(/\s\s+/g);
    },
  },
  methods: {
    async fetchLesson() {
      this.loadingLesson = true;
      const response = await fetch(
        `${this.$store.getters.baseUrl}/lessons/${this.$route.params.lessonId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${this.$store.getters.user}`,
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        this.lesson = responseData;
        this.loadingLesson = false;
        this.prepareLessonText();
      }
    },
    async fetchWordsLevels() {
      this.loadingWords = true;
      const response = await fetch(
        `${this.$store.getters.baseUrl}/lessons/${this.$route.params.lessonId}/words`,
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${this.$store.getters.user}`,
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        this.words = responseData;
        this.loadingWords = false;
      }
    },
    prepareLessonText() {
      let text = this.lesson.text;
      text = text.replace(/[\r\n]{3,}/g, '\n\n');
      this.lesson.text = text;
      return text;
    },
    paragraphWords(paragraph) {
      //[^\p{L}\d]
      return paragraph.split(/([^\p{L}\d])/gu);
      // return paragraph.split(/(\s|[^a-zA-Z\d\s:])+/g);
    },
    isWord(text) {
      return !!text.match(/[\p{L}]+/gu);
    },
    getWordLevel(word) {
      if (this.lesson == null || this.words == null || !this.isWord(word))
        return '';
    },
    getWordClass(word) {
      if (this.lesson == null || this.words == null || !this.isWord(word))
        return '';
      switch (this.words[word.toLowerCase()]) {
        case -1:
          return 'word word-ignored';
        case 0:
          return 'word word-new';
        case 1:
          return 'word word-level-1';
        case 2:
          return 'word word-level-2';
        case 3:
          return 'word word-level-3';
        case 4:
          return 'word word-level-4';
        case 5:
          return 'word word-learned';
        case 6:
          return 'word word-known';
        default:
          return 'word';
      }
    },
  },
};
</script>

<style scoped>
.base-card {
  width: 80vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: auto;
  border-radius: 20px;
}
.word-new {
  background-color: #aee0f4;
}
.word-level-1 {
  background-color: #ffeda1;
}

.word-level-2 {
  background-color: #fff2ab;
}

.word-level-3 {
  background-color: #fff6c7;
}

.word-level-4 {
  background-color: transparent;
  border-bottom: 1px dotted black;
}
.word-known,
.word-learned,
.word-ignored {
  background-color: transparent;
}
</style>