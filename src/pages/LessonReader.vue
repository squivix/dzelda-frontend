<template>
  <base-card v-if="!loading">
    <template v-slot:all>
      <div class="lesson">
        <h2>{{ lesson.title }}</h2>
        <div class="lesson-text"></div>
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
  watch: {
    lesson(value) {
      if (value) {
        let text = value.text;
        text = text.replace(/[^a-z\s]/gi, '')
        text=text.replace(/\s\s+/g, ' ');
        console.log(text);
      }
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
</style>