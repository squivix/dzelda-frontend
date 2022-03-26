<template>
  <div v-if="word">
    <p>{{ word.text }}</p>
    <div v-if="word.data">
      <ul style="background-color: rgba(255, 0, 0, 0.2)">
        <li v-for="meaning in word.data.user_meanings" :key="meaning">
          {{ meaning.text }}
        </li>
      </ul>

      <ul style="background-color: rgba(0, 0, 255, 0.2)">
        <li v-for="meaning in word.data.meanings" :key="meaning">
          {{ meaning.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    word(new_value) {
      if (new_value) {
        this.fetchMeanings();
      }
    },
  },
  props: {
    word: {
      type: Object,
      required: false,
    },
  },
  methods: {
    fetchMeanings() {},
  },
};
</script>