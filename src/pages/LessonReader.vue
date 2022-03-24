<template>
  <base-card v-if="!loading">
    <template v-slot:all>
      <div class="lesson">
        <h2>
          <span
            v-for="(word, index) in paragraphWords(lesson.title)"
            :key="index"
            >{{ word }}</span
          >
        </h2>
        <div class="lesson-text">
          <p v-for="(paragraph, index) in lessonParagraphs" :key="index">
            <span
              v-for="(word, index) in paragraphWords(paragraph)"
              :key="index"
              >{{ word }}</span
            >
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
    return { loading: true, lesson: null, words: [] };
  },
  async created() {
    this.fetchLesson();
  },
  computed: {
    lessonParagraphs() {
      return this.lesson.text.split(/\s\s+/g);
    },
  },
  methods: {
    async fetchLesson() {
      this.loading = true;
      const response = await fetch(`${this.$store.getters.baseUrl}/lessons/1`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${this.$store.getters.user}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        this.lesson = responseData;
        this.loading = false;
        this.prepareLessonText();
      }
    },
    prepareLessonText() {
      let text = this.lesson.text;
      text = text.replace(/[\r\n]{3,}/g, '\n\n');
      this.words = text.split(/\s+/g);
      console.log(this.words);
      // text = text.replace(/[^a-z\s]/gi, '');
      // text = text.replace(/\s\s+/g, ' ');
      this.lesson.text = text;
      return text;
    },
    paragraphWords(paragraph) {
      return paragraph.replace(/\s+/g, ' ').split(/\s+|([^\p{L}\d]+)/gu);
      // return paragraph.split(/(\s|[^a-zA-Z\d\s:])+/g);
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
</style>