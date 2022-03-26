<template>
  <div>
    <h2 class="title">
      <span v-for="(word, index) in paragraphWords(title)" :key="index">
        <span
          v-if="isWord(word)"
          :class="getWordClass(word)"
          @click="onWordClicked(word)"
          >{{ word }}</span
        >
        <template v-else>{{ word }}</template>
      </span>
    </h2>

    <div class="lesson-text">
      <p v-for="(paragraph, index) in lessonParagraphs" :key="index">
        <span
          v-for="(word, index) in paragraphWords(paragraph)"
          :key="index"
          @click="onWordClicked(word)"
        >
          <span v-if="isWord(word)" :class="getWordClass(word)">{{
            word
          }}</span>
          <template v-else>{{ word }}</template>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    words: {
      type: Object,
      required: true,
    },
  },
  emits: ['onWordClicked'],
  computed: {
    lessonParagraphs() {
      return this.text.split(/\s\s+/g);
    },
  },
  methods: {
    paragraphWords(paragraph) {
      //[^\p{L}\d]
      return paragraph.split(/([^\p{L}\d])/gu);
      // return paragraph.split(/(\s|[^a-zA-Z\d\s:])+/g);
    },
    getWordClass(word) {
      switch (this.words[word.toLowerCase()].level) {
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
    onWordClicked(word) {
      this.$emit('onWordClicked', word);
    },
    isWord(text) {
      return !!text.match(/[\p{L}]+/gu);
    },
  },
};
</script>

<style scoped>
.lesson-content {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
.title {
  font-size: 1.55rem;
  line-height: 2.5rem;
}

.lesson-text {
  overflow-y: auto;
}
p {
  font-size: 1.15rem;
  line-height: 2rem;
}
span {
  user-select: none;
}
.word {
  border: 1px solid transparent;
  padding: 0.1rem 0.2rem;
  border-radius: 5px;
}

.word:hover {
  border: 1px solid darkblue;
  cursor: pointer;
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