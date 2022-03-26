<template>
  <div v-if="word">
    <h4 class="word-text">{{ word.text }}</h4>
    <div class="meanings">
      <ol class="user-meanings">
        <li v-for="meaning in userMeanings" :key="meaning.id">
          <input :value="meaning.text" />
        </li>
      </ol>

      <ul class="new-meanings">
        <li v-for="meaning in newMeaningsPreview" :key="meaning">
          {{ meaning.text }}
        </li>
      </ul>

      <ol class="levels" v-if="level !== 0">
        <li :class="{ highlighted: level === 1 }">1</li>
        <li :class="{ highlighted: level === 2 }">2</li>
        <li :class="{ highlighted: level === 3 }">3</li>
        <li :class="{ highlighted: level === 4 }">4</li>
        <li :class="{ highlighted: level === 5 }">
          <font-awesome-icon icon="check" ref="toggleShowIcon" />
        </li>
        <li :class="{ highlighted: level === -1 }">
          <font-awesome-icon icon="ban" ref="toggleShowIcon" />
        </li>
      </ol>
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
  computed: {
    level() {
      return this.word.level;
    },
    userMeanings() {
      return this.word.user_meanings;
    },
    newMeaningsPreview() {
      return this.word.meanings
        .filter((meaning) => {
          return !this.userMeanings.some((m) => m.id === meaning.id);
        })
        .slice(0, 3);
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

<style scoped>
.meaning-panel {
  background-color: #f0f9fe;
  border-radius: 10px;
  padding: 1vw;
}
.word-text {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.meanings {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
.user-meanings {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}
.user-meanings input {
  width: 100%;
}
.new-meanings {
  display: flex;
  flex-direction: column;
  row-gap: 0.25rem;
}
.new-meanings > li {
  background-color: var(--primary-color);
  padding: 15px 10px;
  cursor: pointer;
  font-size: 1.15rem;
  color: var(--on-primary-color);
  border-radius: 5px;
  width: 100%;
}
.levels {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  align-content: stretch;
}
.levels > li {
  background-color: #cfe8ed;
  flex-grow: 1;
  border: 1px solid #408adb;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}
.levels > li:first-child {
  border-start-start-radius: 20px;
  border-end-start-radius: 20px;
}
.levels > li:last-child {
  border-end-end-radius: 20px;
  border-start-end-radius: 20px;
}
.levels .highlighted{
  background-color: var(--primary-color);
  color: var(--on-primary-color);
}
</style>