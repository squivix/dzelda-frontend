<template>
  <ol class="levels"
      v-if="level !== constants.ALL_VOCAB_LEVELS.NEW && level !== constants.ALL_VOCAB_LEVELS.IGNORED&& level !== constants.ALL_VOCAB_LEVELS.KNOWN">
    <li :class="{ highlighted: level === constants.ALL_VOCAB_LEVELS.LEVEL_1 }"
        @click.stop="setVocabLevel(constants.ALL_VOCAB_LEVELS.LEVEL_1)">
      {{ constants.ALL_VOCAB_LEVELS.LEVEL_1 }}
    </li>
    <li :class="{ highlighted: level === constants.ALL_VOCAB_LEVELS.LEVEL_2 }"
        @click.stop="setVocabLevel(constants.ALL_VOCAB_LEVELS.LEVEL_2)">
      {{ constants.ALL_VOCAB_LEVELS.LEVEL_2 }}
    </li>
    <li :class="{ highlighted: level === constants.ALL_VOCAB_LEVELS.LEVEL_3 }"
        @click.stop="setVocabLevel(constants.ALL_VOCAB_LEVELS.LEVEL_3)">
      {{ constants.ALL_VOCAB_LEVELS.LEVEL_3 }}
    </li>
    <li :class="{ highlighted: level === constants.ALL_VOCAB_LEVELS.LEVEL_4 }"
        @click.stop="setVocabLevel(constants.ALL_VOCAB_LEVELS.LEVEL_4)">
      {{ constants.ALL_VOCAB_LEVELS.LEVEL_4 }}
    </li>
    <li :class="{ highlighted: level === constants.ALL_VOCAB_LEVELS.LEARNED }"
        @click.stop="setVocabLevel(constants.ALL_VOCAB_LEVELS.LEARNED)">
      <font-awesome-icon icon="check" ref="toggleShowIcon"/>
    </li>
    <li :class="{ highlighted: level === constants.ALL_VOCAB_LEVELS.IGNORED }"
        @click.stop="setVocabLevel(constants.ALL_VOCAB_LEVELS.IGNORED)">
      <font-awesome-icon icon="ban" ref="toggleShowIcon"/>
    </li>
  </ol>

</template>

<script>
import constants from "@/constants.js";
import {useVocabStore} from "@/stores/vocab.js";

export default {
  name: "VocabLevelPicker",
  components: {},
  data() {
    return {constants};
  },
  emits: ["onVocabLevelSet"],
  props: {
    vocabId: {
      type: Number,
      required: true
    },
    level: {
      type: Number,
      required: true
    }
  },
  methods: {
    async setVocabLevel(level) {
      await this.vocabStore.updateUserVocab({
        vocabId: this.vocabId,
        level: level
      });
      this.$emit("onVocabLevelSet", level);
    },
  },
  created() {
    this.vocabStore = useVocabStore();
  }
};
</script>

<style scoped>
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

.levels .highlighted {
  background-color: var(--primary-color);
  color: var(--on-primary-color);
}
</style>