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
      <inline-svg :src="icons.checkMark"/>
    </li>
    <li :class="{ highlighted: level === constants.ALL_VOCAB_LEVELS.IGNORED }"
        @click.stop="setVocabLevel(constants.ALL_VOCAB_LEVELS.IGNORED)">
      <inline-svg :src="icons.circleSlash"/>
    </li>
  </ol>

</template>

<script lang="ts">
import constants from "@/constants.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {LearnerVocabSchema, VocabLevelSchema} from "dzelda-common";
import {PropType} from "vue";

export default {
  name: "VocabLevelPicker",
  components: {InlineSvg},
  data() {
    return {constants};
  },
  emits: ["onVocabLevelButtonClicked"],
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema>, required: true},
    level: {
      type: Number,
      required: true
    }
  },
  methods: {
    async setVocabLevel(level: VocabLevelSchema) {
      if (level === this.vocab.level)
        return;
      this.$emit("onVocabLevelButtonClicked", level);
    },
  },
  setup() {
    return {
      icons,
      vocabStore: useVocabStore()
    };
  }
};
</script>

<style scoped>
.levels {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-content: stretch;
}

.levels > li {
  background-color: var(--primary-faint-color);
  flex-grow: 1;
  border: 1px solid #408adb;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.levels > li:first-child {
  border-start-start-radius: 5px;
  border-end-start-radius: 5px;
}

.levels > li:last-child {
  border-end-end-radius: 5px;
  border-start-end-radius: 5px;
}

.levels .highlighted {
  background-color: var(--primary-color);
  color: var(--on-primary-color);
}
</style>
