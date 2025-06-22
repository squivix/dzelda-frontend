<template>
  <ol class="levels"
      v-if="level !== VocabLevel.NEW && level !== VocabLevel.IGNORED&& level !== VocabLevel.KNOWN">
    <li :class="{ highlighted: level === VocabLevel.LEVEL_1 }"
        @click.stop="setVocabLevel(VocabLevel.LEVEL_1)">
      {{ VocabLevel.LEVEL_1 }}
    </li>
    <li :class="{ highlighted: level === VocabLevel.LEVEL_2 }"
        @click.stop="setVocabLevel(VocabLevel.LEVEL_2)">
      {{ VocabLevel.LEVEL_2 }}
    </li>
    <li :class="{ highlighted: level === VocabLevel.LEVEL_3 }"
        @click.stop="setVocabLevel(VocabLevel.LEVEL_3)">
      {{ VocabLevel.LEVEL_3 }}
    </li>
    <li :class="{ highlighted: level === VocabLevel.LEVEL_4 }"
        @click.stop="setVocabLevel(VocabLevel.LEVEL_4)">
      {{ VocabLevel.LEVEL_4 }}
    </li>
    <li :class="{ highlighted: level === VocabLevel.LEARNED }"
        @click.stop="setVocabLevel(VocabLevel.LEARNED)">
      <inline-svg :src="icons.checkMark"/>
    </li>
    <li :class="{ highlighted: level === VocabLevel.IGNORED }"
        @click.stop="setVocabLevel(VocabLevel.IGNORED)">
      <inline-svg :src="icons.circleSlash"/>
    </li>
  </ol>

</template>

<script lang="ts">
import constants from "@/constants.js";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import type {LearnerVocabSchema, VocabLevelSchema} from "dzelda-common";
import {VocabLevel} from "dzelda-common";
import type {PropType} from "vue";

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
      VocabLevel,
      icons,
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
  border-start-start-radius: 10px;
  border-end-start-radius: 10px;
}

.levels > li:last-child {
  border-end-end-radius: 10px;
  border-start-end-radius: 10px;
}

.levels .highlighted {
  background-color: var(--primary-color);
  color: var(--on-primary-color);
}
</style>
